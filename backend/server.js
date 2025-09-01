const express = require('express');
const cors = require('cors');
const http = require('http');
require('dotenv').config();
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');

// Route imports
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const drAppointmentRoutes = require('./routes/drAppointmentRoutes');
const reviewRoutes = require("./routes/reviewRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { initSocket } = require('./utils/socket');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3002;

// Use the cors middleware before any routes
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.use('/', authRoutes);
app.use('/patient', patientRoutes);
app.use('/doctor', doctorRoutes);
app.use('/patient/appointment', appointmentRoutes);
app.use('/doctor/appointment', drAppointmentRoutes);
app.use('/reviews', reviewRoutes);
app.use('/chat', chatRoutes);

// Initialize Socket.IO via central module
initSocket(server, process.env.FRONTEND_ORIGIN || 'http://localhost:5173');

// Database connection and server start
connectDB()
  .then(() => {
    console.log('DB connected successfully!!');
    server.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB connection Failed!!!', err);
    process.exit(1); // Exit if DB connection fails
  });