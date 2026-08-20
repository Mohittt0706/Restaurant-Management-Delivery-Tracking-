const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const prisma = require('../config/prisma');
const env = require('../config/env');
const { ApiError } = require('../middleware/error.middleware');
const { sendPasswordResetEmail } = require('./email.service');

const BCRYPT_ROUNDS = 12;
const RESET_TOKEN_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes
const RESET_TOKEN_EXPIRY_MINUTES = 30;

const googleClient = new OAuth2Client(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET || undefined,
);

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function generateResetToken() {
  return crypto.randomBytes(32).toString('hex');
}

function toSafeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
  };
}

function signToken(user) {
  if (!env.JWT_SECRET) {
    throw new ApiError(500, 'JWT_SECRET is not configured.');
  }
  if (env.JWT_SECRET === 'change_me' && env.NODE_ENV === 'production') {
    throw new ApiError(500, 'JWT_SECRET must be changed before production.');
  }

  return jwt.sign(
    { userId: user.id, role: user.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN || '7d' },
  );
}

async function register({ name, email, phone, password }) {
  const [userByEmail, userByPhone] = await Promise.all([
    prisma.user.findUnique({ where: { email } }),
    prisma.user.findUnique({ where: { phone } }),
  ]);

  if (userByEmail) {
    throw new ApiError(409, 'An account with this email already exists.');
  }

  if (userByPhone) {
    throw new ApiError(409, 'An account with this phone number already exists.');
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone,
      passwordHash,
      role: 'CUSTOMER',
    },
  });

  return {
    message: 'Registration successful',
    user: toSafeUser(user),
    token: signToken(user),
  };
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });

  const valid =
    user && user.passwordHash
      ? await bcrypt.compare(password, user.passwordHash)
      : false;

  if (!valid) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  return { user: toSafeUser(user), token: signToken(user) };
}

async function verifyGoogleIdToken(idToken) {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });
    return ticket.getPayload();
  } catch {
    throw new ApiError(401, 'Invalid Google token.');
  }
}

async function googleLogin({ idToken }) {
  const payload = await verifyGoogleIdToken(idToken);

  if (!payload.email_verified || !payload.email) {
    throw new ApiError(401, 'Google account email is not verified.');
  }

  const googleId = payload.sub;
  const email = payload.email;
  const name = payload.name || email.split('@')[0];

  let user = await prisma.user.findUnique({ where: { googleId } });

  if (!user) {
    user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId },
      });
    } else {
      user = await prisma.user.create({
        data: {
          name,
          email,
          googleId,
          role: 'CUSTOMER',
        },
      });
    }
  }

  return { user: toSafeUser(user), token: signToken(user) };
}

async function forgotPassword({ email }) {
  const genericMessage =
    'If an account exists for this email, a password reset link has been sent.';

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { message: genericMessage };
  }

  const token = generateResetToken();
  const tokenHash = hashToken(token);

  await prisma.$transaction([
    prisma.passwordResetToken.deleteMany({
      where: { userId: user.id, usedAt: null },
    }),
    prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + RESET_TOKEN_EXPIRY_MS),
      },
    }),
  ]);

  const resetUrl = `${env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

  try {
    await sendPasswordResetEmail(email, resetUrl, RESET_TOKEN_EXPIRY_MINUTES);
  } catch (error) {
    console.error('[auth] Failed to send password reset email:', error.message);
  }

  return { message: genericMessage };
}

async function resetPassword({ token, newPassword }) {
  const tokenHash = hashToken(token);

  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (
    !record ||
    record.usedAt ||
    record.expiresAt.getTime() < Date.now()
  ) {
    throw new ApiError(400, 'This reset link is invalid or has expired.');
  }

  const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.delete({ where: { id: record.id } }),
  ]);

  return { message: 'Your password has been reset successfully.' };
}

module.exports = {
  register,
  login,
  googleLogin,
  forgotPassword,
  resetPassword,
  toSafeUser,
  signToken,
};
