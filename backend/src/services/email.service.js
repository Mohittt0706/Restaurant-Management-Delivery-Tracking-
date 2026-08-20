const nodemailer = require('nodemailer');

const env = require('../config/env');

function createTransporter() {
  if (!env.SMTP_HOST || !env.SMTP_USER) {
    return null;
  }

  const port = Number(env.SMTP_PORT) || 587;

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
    },
  });
}

const getFrom = () =>
  env.MAIL_FROM || `"CULT Restaurant" <${env.SMTP_USER || 'no-reply@cult.local'}>`;

async function sendPasswordResetEmail(email, resetUrl, expiryMinutes) {
  const transporter = createTransporter();

  if (!transporter) {
    console.warn(
      '[email] SMTP is not configured (SMTP_HOST/SMTP_USER missing). Password reset email not sent.',
    );
    return false;
  }

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
      <div style="text-align: center; padding-bottom: 16px; border-bottom: 2px solid #c9a227;">
        <h2 style="margin: 0; letter-spacing: 4px; color: #1a1a1a;">CULT</h2>
        <p style="margin: 4px 0 0; color: #777; font-size: 12px; letter-spacing: 2px;">RESTAURANT</p>
      </div>
      <h3 style="margin-top: 24px;">Reset your password</h3>
      <p>We received a request to reset the password for your CULT account.</p>
      <p>Click the button below to choose a new password. This link is valid for <strong>${expiryMinutes} minutes</strong>.</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetUrl}" style="display: inline-block; background: #c9a227; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 6px; font-weight: bold;">Reset Password</a>
      </div>
      <p style="font-size: 13px; color: #777;">If the button does not work, copy and paste this link into your browser:</p>
      <p style="font-size: 13px; word-break: break-all;"><a href="${resetUrl}">${resetUrl}</a></p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p style="font-size: 12px; color: #999;">If you did not request a password reset, you can safely ignore this email. Your password will not be changed.</p>
      <p style="font-size: 12px; color: #999;">CULT Restaurant Management &amp; Delivery Tracking</p>
    </div>
  `;

  await transporter.sendMail({
    from: getFrom(),
    to: email,
    subject: 'CULT Restaurant — Password Reset',
    html,
  });

  return true;
}

module.exports = {
  sendPasswordResetEmail,
};
