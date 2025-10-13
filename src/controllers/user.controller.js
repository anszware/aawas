'use strict';
const { User } = require('../models');

// Controller for admin/super_admin to manage users

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] } // Don't return passwords
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { fullName, username, email, password, role, gender, phone, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // The password will be hashed automatically by the model's beforeCreate hook
    const newUser = await User.create({
      fullName,
      username,
      email,
      password,
      role, // Default role is 'user' if not provided
      gender,
      phone,
      address
    });

    // Generate JWT
    // const token = jwt.sign(
    //   { id: newUser.id, email: newUser.email, role: newUser.role },
    //   process.env.JWT_SECRET || 'your_default_secret',
    //   { expiresIn: '1h' }
    // );

    res.status(201).json({ 
      message: 'User registered successfully', 
      // token,
      // user: { id: newUser.id, fullName: newUser.fullName, email: newUser.email }
    });

  } catch (error) {
    res.status(500).json({ message: 'An error occurred during registration', error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // The beforeUpdate hook in the model will handle password hashing if password is changed
    await user.update(req.body);

    const updatedUser = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
};