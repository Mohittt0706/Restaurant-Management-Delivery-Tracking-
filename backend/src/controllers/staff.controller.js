const getStaffList = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: [] });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStaffList };
