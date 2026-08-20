const express = require('express');

const {
  register,
  login,
  googleLogin,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth.controller');
const { validate } = require('../middleware/validation.middleware');
const {
  registerSchema,
  loginSchema,
  googleSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require('../validators/auth.validator');

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/google', validate(googleSchema), googleLogin);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

module.exports = router;