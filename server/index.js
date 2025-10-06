const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const config = require('./config.dev');
const mockDB = require('./mockDatabase');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: config.CLIENT_URL,
    methods: ["GET", "POST"]
  }
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.CLIENT_URL,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  // Allow auth routes (login/register) to bypass to prevent lockouts during testing/demo
  skip: (req) => req.path.startsWith('/api/auth/')
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from uploads directory (use absolute path)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const connectDatabase = async () => {
  try {
    if (config.MONGODB_URI) {
      await mongoose.connect(config.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('✅ Connected to MongoDB at:', config.MONGODB_URI);
    } else {
      console.log('MONGODB_URI not set — using mock database for demo purposes');
      console.log('Demo users created:');
      console.log('- Citizen: demo@example.com / password');
      console.log('- Admin: admin@example.com / password');
    }
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    console.log('Falling back to mock database');
  }
};

connectDatabase();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/complaints', require('./routes/complaints-simple'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/volunteers', require('./routes/volunteers'));
app.use('/api/admin/volunteers', require('./routes/volunteer-admin'));

// Socket.io for real-time updates
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join-room', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

const PORT = config.PORT;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Client URL: ${config.CLIENT_URL}`);
  console.log(`📊 Database: ${config.MONGODB_URI ? 'MongoDB' : 'Mock Database'}`);
});

module.exports = { app, io };
