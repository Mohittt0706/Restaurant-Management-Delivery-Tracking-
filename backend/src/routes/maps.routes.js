const express = require('express');
const router = express.Router();
const mapsController = require('../controllers/maps.controller');

router.get('/route', mapsController.getRoute);

module.exports = router;
