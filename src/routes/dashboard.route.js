'use strict';
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');

// @route   GET /api/dashboard/my-data
// @desc    Get location, device, and data_device based on user's assigned locations
// @access  admin, admin_user, user
router.get('/my-data', authenticateToken, authorizeRole(['admin', 'admin_user', 'user']), dashboardController.getUserDashboardData);

// @route   GET /api/dashboard/superadmin
// @desc    Get dashboard data for Super Admin
// @access  admin
router.get('/superadmin', authenticateToken, authorizeRole(['admin']), dashboardController.getSuperAdminDashboard);

// @route   GET /api/dashboard/admin
// @desc    Get dashboard data for Admin User
// @access  admin_user
router.get('/admin', authenticateToken, authorizeRole(['admin_user']), dashboardController.getAdminUserDashboard);

// @route   GET /api/dashboard/user
// @desc    Get dashboard data for regular User based on proximity
// @access  user
router.get('/user', authenticateToken, authorizeRole(['user']), dashboardController.getUserRoleDashboard);

module.exports = router;
