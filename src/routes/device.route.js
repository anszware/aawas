'use strict';
const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/device.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');
const validate = require('../middlewares/validator');
const { createDeviceSchema, updateDeviceSchema, activeDeviceSchema } = require('../validators/device.validator');

// All routes in this file are protected
router.use(authenticateToken);
router.use(authorizeRole(['super_admin', 'admin_user']));

// @route   POST /api/devices
// @desc    Create a new device
// @access  super_admin, admin_user
router.post('/', deviceController.createDevice);
// router.post('/', validate(createDeviceSchema), deviceController.createDevice);

// @route   GET /api/devices
// @desc    Get all devices
// @access  super_admin, admin_user
router.get('/', deviceController.getAllDevices);

// @route   GET /api/devices/locationId
// @desc    Get all devices
// @access  super_admin, admin_user
router.get('/location/:id', deviceController.getAllDevicesLocations);

// @route   GET /api/devices/:id
// @desc    Get a single device by ID
// @access  super_admin, admin_user
router.get('/:id', deviceController.getDeviceById);

// @route   PUT /api/devices/:id
// @desc    Update a device
// @access  super_admin, admin_user
router.put('/:id', validate(updateDeviceSchema), deviceController.updateDevice);
router.put('/active/:noseri', validate(activeDeviceSchema), deviceController.activeDevice);

// @route   DELETE /api/devices/:id
// @desc    Delete a device
// @access  super_admin, admin_user
router.delete('/:id', deviceController.deleteDevice);

// @route   GET /api/devices/map
// @desc    Get devices with location data for map display
// @access  All authenticated users
router.get('/map', authenticateToken, authorizeRole(['super_admin', 'admin', 'admin_user', 'user']), deviceController.getDevicesForMap);

module.exports = router;
