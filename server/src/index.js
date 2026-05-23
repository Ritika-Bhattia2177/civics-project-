import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import connectDB from './config/db.js';
import { initSocket } from './socket/index.js';

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  },
});

initSocket(io);
connectDB();

server.listen(PORT, () => {
  console.log(`Civic Routes API running on port ${PORT}`);
});
