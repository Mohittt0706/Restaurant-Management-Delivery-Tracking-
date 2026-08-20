const getProfile = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: 'Customer profile endpoint' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile };
