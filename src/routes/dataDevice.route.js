'use strict';
const express = require('express');
const router = express.Router();
const dataDeviceController = require('../controllers/dataDevice.controller');
const validate = require('../middlewares/validator');
const { createDataDeviceSchema } = require('../validators/dataDevice.validator');

// @route   POST /api/data
// @desc    Create new data for a device (public)
// @access  Public
router.post('/', validate(createDataDeviceSchema), dataDeviceController.createDataDevice);

// @route   GET /api/data/category/:jenis_data
// @desc    Get data devices by category (suhu, karbon, lampu)
// @access  Public
router.get('/category/:jenis_data', dataDeviceController.getDataDeviceByCategory);

module.exports = router;
