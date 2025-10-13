'use strict';
const express = require('express');
const router = express.Router();
const locationController = require('../controllers/location.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');
const validate = require('../middlewares/validator');
const { createLocationSchema, updateLocationSchema, createLocationUserSchema } = require('../validators/location.validator');

// All routes in this file are protected
router.use(authenticateToken);
router.use(authorizeRole(['super_admin', 'admin_user']));

// @route   POST /api/locations
// @desc    Create a new location
// @access  super_admin, admin_user
router.post('/', validate(createLocationSchema), locationController.createLocation);
router.post('/user', validate(createLocationUserSchema), locationController.createUserLocation);

// @route   GET /api/locations
// @desc    Get all locations
// @access  super_admin, admin_user
router.get('/', locationController.getAllLocations);

// @route   GET /api/locations/:id
// @desc    Get a single location by ID
// @access  super_admin, admin_user
router.get('/:id', locationController.getLocationById);

router.get('/user/:userId', locationController.getLocationUserId);

// @route   PUT /api/locations/:id
// @desc    Update a location
// @access  super_admin, admin_user
router.put('/:id', validate(updateLocationSchema), locationController.updateLocation);

// @route   DELETE /api/locations/:id
// @desc    Delete a location
// @access  super_admin, admin_user
router.delete('/:id', locationController.deleteLocation);

module.exports = router;
