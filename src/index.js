const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust this for your client's origin
  },
});

// Store io instance
app.set('socketio', io);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on('join_location', (locationId) => {
    socket.join(`location_${locationId}`);
    console.log(`User joined location room ${locationId}`);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

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

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
