const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Main router
// const apiRouter = require('./routes');
// app.use('/api/v1', apiRouter);

// Example usage of user routes
const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');
const locationRoutes = require('./routes/location.route');
const deviceRoutes = require('./routes/device.route');
const dataDeviceRoutes = require('./routes/dataDevice.route');
const dashboardRoutes = require('./routes/dashboard.route');
const notificationRoutes = require('./routes/notification.route');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/data', dataDeviceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);


app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
