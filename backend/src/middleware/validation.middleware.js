const validationMiddleware = (schema) => {
  return (req, res, next) => {
    if (!schema) return next();
    const { error } = schema.validate ? schema.validate(req.body) : { error: null };
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };
};

module.exports = validationMiddleware;
