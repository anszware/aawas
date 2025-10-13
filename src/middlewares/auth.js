'use strict';
const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Adjust path if necessary

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_default_secret');
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(403).json({ message: 'Invalid token: User not found' });
    }

    req.user = user; // Attach user object to the request
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. User role '${req.user.role}' is not authorized.` 
      });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRole };
