const express = require('express');
const router = express.Router();

// Import other routes here
const authRoutes = require('./auth.route');
router.use('/auth', authRoutes);

module.exports = router;
