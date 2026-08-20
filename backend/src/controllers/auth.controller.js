const authService = require('../services/auth.service');

async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { user, token } = await authService.login(req.body);
    res.status(200).json({ success: true, data: { user, token } });
  } catch (error) {
    next(error);
  }
}

async function googleLogin(req, res, next) {
  try {
    const { user, token } = await authService.googleLogin(req.body);
    res.status(200).json({ success: true, data: { user, token } });
  } catch (error) {
    next(error);
  }
}

async function forgotPassword(req, res, next) {
  try {
    const result = await authService.forgotPassword(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

async function resetPassword(req, res, next) {
  try {
    const result = await authService.resetPassword(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  googleLogin,
  forgotPassword,
  resetPassword,
};