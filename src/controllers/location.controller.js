'use strict';
const { Location, LocationMember } = require('../models');

const createLocation = async (req, res) => {
  try {
    if (!req.body.name || typeof req.body.name !== 'string' || req.body.name.trim() === '') {
      return res.status(400).json({ message: 'Name is required and must be a non-empty string' });
    }
    const newLocation = await Location.create(req.body);
    res.status(201).json({ message: 'Location created successfully', location: newLocation });
  } catch (error) {
    res.status(500).json({ message: 'Error creating location', error: error.message });
  }
};
const createUserLocation = async (req, res) => {
  const dreq = req.body;
  try {
    if (!dreq.name || typeof dreq.name !== 'string' || dreq.name.trim() === '') {
      return res.status(400).json({ message: 'Name is required and must be a non-empty string' });
    }
     const dataLocation = {
      name: dreq.name,
      address: dreq.address,
      lang: dreq.lang,
      long: dreq.long,
    }
    const newLocation = await Location.create(dataLocation);
    const locationId = newLocation.id;
     const dataLocationMember = {
        userId: dreq.userId,
        locationId: locationId,
        role_member: 'admin',
      }
    const newLocationMember = await LocationMember.create(dataLocationMember);
    res.status(201).json({ message: 'Location created successfully', location: newLocation, locationMember: newLocationMember });
  } catch (error) {
    res.status(500).json({ message: 'Error creating location', error: error.message });
  }
};

const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.findAll();
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching locations', error: error.message });
  }
};

const getLocationById = async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching location', error: error.message });
  }
};
const getLocationUserId = async (req, res) => {
  try {
    const location = await LocationMember.findAll(
      {where:{
       userId : req.params.userId
      }},
    );
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching location', error: error.message });
  }
};

const updateLocation = async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    await location.update(req.body);
    res.status(200).json({ message: 'Location updated successfully', location });
  } catch (error) {
    res.status(500).json({ message: 'Error updating location', error: error.message });
  }
};

const deleteLocation = async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    await location.destroy();
    res.status(200).json({ message: 'Location deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting location', error: error.message });
  }
};

module.exports = {
  createLocation,
  getAllLocations,
  getLocationById,
  updateLocation,
  deleteLocation,
  createUserLocation,
  getLocationUserId
};
