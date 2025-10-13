'use strict';
const { Notification, User, LocationMember } = require('../models');

const createLocationNotification = async (req, res) => {
  try {
    const { locationId, message, type } = req.body;
    const io = req.app.get('socketio');

    const members = await LocationMember.findAll({ where: { locationId } });

    if (!members.length) {
      return res.status(404).json({ message: 'No members found in this location' });
    }

    const notifications = members.map(member => ({
      userId: member.userId,
      message,
      type,
    }));

    const createdNotifications = await Notification.bulkCreate(notifications);

    // Emit a socket event to the location room
    io.to(`location_${locationId}`).emit('new_notification', {
      message,
      type,
      locationId,
      createdAt: new Date(),
    });

    res.status(201).json({ message: 'Location notification created successfully', createdNotifications });
  } catch (error) {
    res.status(500).json({ message: 'Error creating location notification', error: error.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

const getUnreadNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.findAll({
      where: { userId, isRead: false },
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching unread notifications', error: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    const notification = await Notification.findOne({ where: { id: notificationId, userId } });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found or not authorized' });
    }

    await notification.update({ isRead: true });
    res.status(200).json({ message: 'Notification marked as read', notification });
  } catch (error) {
    res.status(500).json({ message: 'Error marking notification as read', error: error.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    await Notification.update({ isRead: true }, { where: { userId, isRead: false } });
    res.status(200).json({ message: 'All unread notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking all notifications as read', error: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    const notification = await Notification.findOne({ where: { id: notificationId, userId } });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found or not authorized' });
    }

    await notification.destroy();
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notification', error: error.message });
  }
};

const createNotification = async (req, res) => {
  try {
    const { userId, message, type } = req.body;
    const io = req.app.get('socketio');

    const notification = await Notification.create({ userId, message, type });

    // Emit a socket event to the specific user
    io.to(userId.toString()).emit('new_notification', notification);

    res.status(201).json({ message: 'Notification created successfully', notification });
  } catch (error) {
    res.status(500).json({ message: 'Error creating notification', error: error.message });
  }
};

module.exports = {
  createLocationNotification,
  createNotification,
  getNotifications,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
