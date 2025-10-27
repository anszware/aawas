'use strict';
const { Notification, LocationMember } = require('../models');

const createLocationNotification = async (io, locationId, message, type) => {
  try {
    const members = await LocationMember.findAll({ where: { locationId } });

    if (!members.length) {
      console.log('No members found in this location');
      return;
    }

    const notifications = members.map(member => ({
      userId: member.userId,
      message,
      type,
    }));

    await Notification.bulkCreate(notifications);

    // Emit a socket event to the location room
    io.to(`location_${locationId}`).emit('new_notification', {
      message,
      type,
      locationId,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Error creating location notification', error);
  }
};

module.exports = {
  createLocationNotification,
};
