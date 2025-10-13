'use strict';
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { authenticateToken } = require('../middlewares/auth');

// All notification routes require authentication
router.use(authenticateToken);

// @route   POST /api/notifications/location
// @desc    Create a new notification for a location
// @access  Authenticated User
router.post('/location', notificationController.createLocationNotification);

// @route   POST /api/notifications
// @desc    Create a new notification
// @access  Authenticated User
router.post('/', notificationController.createNotification);

// @route   GET /api/notifications
// @desc    Get all notifications for the authenticated user
// @access  Authenticated User
router.get('/', notificationController.getNotifications);

// @route   GET /api/notifications/unread
// @desc    Get unread notifications for the authenticated user
// @access  Authenticated User
router.get('/unread', notificationController.getUnreadNotifications);

// @route   PUT /api/notifications/:id/read
// @desc    Mark a specific notification as read
// @access  Authenticated User (owner of notification)
router.put('/:id/read', notificationController.markAsRead);

// @route   PUT /api/notifications/read-all
// @desc    Mark all unread notifications for the authenticated user as read
// @access  Authenticated User
router.put('/read-all', notificationController.markAllAsRead);

// @route   DELETE /api/notifications/:id
// @desc    Delete a specific notification
// @access  Authenticated User (owner of notification)
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
