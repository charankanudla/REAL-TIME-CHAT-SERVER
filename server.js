const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // change this to your frontend URL in production
    methods: ['GET', 'POST']
  }
});

// Listen for client connections
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  // Join a room
  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`✅ User ${socket.id} joined room: ${room}`);
  });

  // Send message
  socket.on('send_message', (data) => {
    console.log(`📨 Message from ${socket.id} in ${data.room}: ${data.message}`);
    socket.to(data.room).emit('receive_message', data);
  });

  // Leave room
  socket.on('leave_room', (room) => {
    socket.leave(room);
    console.log(`🚪 User ${socket.id} left room: ${room}`);
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
