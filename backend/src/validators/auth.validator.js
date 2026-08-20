const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9]{7,15}$/;
const MIN_PASSWORD_LENGTH = 8;

function validateEmail(email) {
  if (typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
    return 'A valid email address is required.';
  }
  return null;
}

function validatePhone(phone) {
  if (typeof phone !== 'string' || !PHONE_REGEX.test(phone)) {
    return 'A valid contact number is required.';
  }
  return null;
}

function validatePassword(password) {
  if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`;
  }
  return null;
}

function validateName(name) {
  if (typeof name !== 'string' || name.trim().length < 2) {
    return 'Name must be at least 2 characters long.';
  }
  return null;
}

function validateRequiredString(value, label) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return `${label} is required.`;
  }
  return null;
}

function normalize(body, fields) {
  const value = {};
  for (const field of fields) {
    if (body[field] !== undefined) {
      value[field] = typeof body[field] === 'string' ? body[field].trim() : body[field];
    }
  }
  return value;
}

const registerSchema = {
  validate(body = {}) {
    const errors = [];
    const { name, email, phone, password } = body;

    const nameError = validateName(name);
    if (nameError) errors.push({ field: 'name', message: nameError });

    const emailError = validateEmail(email);
    if (emailError) errors.push({ field: 'email', message: emailError });

    const phoneError = validatePhone(phone);
    if (phoneError) errors.push({ field: 'phone', message: phoneError });

    const passwordError = validatePassword(password);
    if (passwordError) errors.push({ field: 'password', message: passwordError });

    return {
      errors,
      value: normalize(body, ['name', 'email', 'phone', 'password']),
    };
  },
};

const loginSchema = {
  validate(body = {}) {
    const errors = [];
    const { email, password } = body;

    const emailError = validateEmail(email);
    if (emailError) errors.push({ field: 'email', message: emailError });

    if (typeof password !== 'string' || password.length === 0) {
      errors.push({ field: 'password', message: 'Password is required.' });
    }

    return {
      errors,
      value: normalize(body, ['email', 'password']),
    };
  },
};

const googleSchema = {
  validate(body = {}) {
    const errors = [];
    const { idToken } = body;

    const tokenError = validateRequiredString(idToken, 'Google ID token');
    if (tokenError) errors.push({ field: 'idToken', message: tokenError });

    return {
      errors,
      value: { idToken: typeof idToken === 'string' ? idToken.trim() : idToken },
    };
  },
};

const forgotPasswordSchema = {
  validate(body = {}) {
    const errors = [];
    const { email } = body;

    const emailError = validateEmail(email);
    if (emailError) errors.push({ field: 'email', message: emailError });

    return {
      errors,
      value: normalize(body, ['email']),
    };
  },
};

const resetPasswordSchema = {
  validate(body = {}) {
    const errors = [];
    const { token, newPassword } = body;

    const tokenError = validateRequiredString(token, 'Reset token');
    if (tokenError) errors.push({ field: 'token', message: tokenError });

    const passwordError = validatePassword(newPassword);
    if (passwordError) errors.push({ field: 'newPassword', message: passwordError });

    return {
      errors,
      value: {
        token: typeof token === 'string' ? token.trim() : token,
        newPassword,
      },
    };
  },
};

module.exports = {
  registerSchema,
  loginSchema,
  googleSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};