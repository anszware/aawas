'use strict';
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');
const validate = require('../middlewares/validator');
const { updateUserSchema } = require('../validators/user.validator');

// All routes in this file are protected and require admin/super_admin privileges
router.use(authenticateToken);
router.use(authorizeRole(['super_admin', 'admin']));

// @route   GET /api/users
// @desc    Get all users
// @access  super_admin, admin
router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);

// @route   GET /api/users/:id
// @desc    Get a single user by ID
// @access  super_admin, admin
router.get('/:id', userController.getUserById);

// @route   PUT /api/users/:id
// @desc    Update a user
// @access  super_admin, admin
router.put('/:id', validate(updateUserSchema), userController.updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete a user
// @access  super_admin, admin
router.delete('/:id', userController.deleteUser);

module.exports = router;