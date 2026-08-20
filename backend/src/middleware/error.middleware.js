const env = require('../config/env');

class ApiError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: {
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    },
  });
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  if (statusCode >= 500) {
    console.error('[error]', err);
    if (env.NODE_ENV === 'production') {
      return res.status(500).json({
        success: false,
        error: { message: 'Internal server error.' },
      });
    }
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(err.details ? { details: err.details } : {}),
    },
  });
}

module.exports = {
  ApiError,
  notFoundHandler,
  errorHandler,
};
