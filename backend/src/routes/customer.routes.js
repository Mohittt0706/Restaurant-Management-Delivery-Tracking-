const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');

router.get('/profile', customerController.getProfile);

module.exports = router;
