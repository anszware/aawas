'use strict';
const { User, Sequelize } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Op } = Sequelize;

const register = async (req, res) => {
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
      role: role || 'admin_user', // Default role is 'user' if not provided
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

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: email },
          { username: email }
        ]
      }
    });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // The model has an instance method `validPassword` to check the hash
    const isMatch = await user.validPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_default_secret',
      { expiresIn: '1h' }
    );

    res.status(200).json({ 
      success: true,
      message: 'Login successful', 
      token,
      user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role }
    });

  } catch (error) {
    res.status(500).json({ message: 'An error occurred during login', error: error.message });
  }
};


const profile = async (req, res) => {
  try {
    // The user object is attached to the request by the authenticateToken middleware
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] } // Exclude password from the result
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching profile', error: error.message });
  }
};

module.exports = { register, login, profile };

