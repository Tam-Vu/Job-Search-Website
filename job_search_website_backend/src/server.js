import cookieParser from "cookie-parser";
import cors from "cors";
import Connection from "./config/connectDB";
import express from "express";
import bodyParser from "body-parser";
import http from 'http';
import { Server } from 'socket.io';
import socketAuthMiddleware from './middlewares/socketAuthMiddleware';
import loginAndRegisterRoute from "./routes/loginAndRegisterRoute";
import resumeRoute from "./routes/resumeRoute";
import userRoute from "./routes/userRoute";
import jobRoute from "./routes/jobRoute";
import fileRoute from "./routes/fileRoute";
import { checkUserJwt, checkUserPermission } from "./middlewares/jwtService";
import applicationRoute from "./routes/applicationRoute";
import interviewScheduleRoute from "./routes/interviewSheduleRoute";
import employerRoute from "./routes/employerRoute";
import skillRoute from "./routes/skillRoute";
import employerratingRoute from "./routes/employerratingRoute";
import resumeratingRoute from "./routes/resumeratingRoute";
import chatRoute from "./routes/chatRoute";
import path from 'path';

require("dotenv").config();
const PORT = process.env.PORT || 8080;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Add static file middleware with absolute path
app.use(express.static(path.join(__dirname, '../public')));

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: "GET,POST,PUT,PATCH,DELETE",
    credentials: true,
  }),
);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with CORS settings
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
  }
});

// Apply authentication middleware to all incoming socket connections
io.use(socketAuthMiddleware);

// Socket.IO connection handling - this runs after authentication succeeds
io.on('connection', (socket) => {
  console.log('User authenticated and connected:', socket.id);
  console.log('User data:', socket.user);
  
  // Handle socket events for chat functionality
  setupChatHandlers(io, socket);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Setup chat-related socket event handlers
function setupChatHandlers(io, socket) {
  const chatSocketController = require('./controllers/chatSocketController')(io);
  
  // Register event handlers for chat operations
  socket.on('create_conversation', (data) => chatSocketController.createConversation(socket, data));
  socket.on('send_message', (data) => chatSocketController.sendMessage(socket, data));
  socket.on('mark_seen', (data) => chatSocketController.markAsSeen(socket, data));
  socket.on('get_messages', (data) => chatSocketController.getMessages(socket, data));
  socket.on('get_conversations', () => chatSocketController.getConversations(socket));
  socket.on('add_members', (data) => chatSocketController.addMembersToConversation(socket, data));
}

// Update your chat route to pass the io instance
loginAndRegisterRoute(app);
resumeRoute(app);
userRoute(app);
jobRoute(app);
applicationRoute(app);
interviewScheduleRoute(app);
employerRoute(app);
skillRoute(app);
fileRoute(app);
employerratingRoute(app);
resumeratingRoute(app);
chatRoute(app, io); // Pass io to chatRoute

Connection();
app.use((req, res) => {
  return res.send("404 not found");
});

// Use the HTTP server instead of Express app for listening
server.listen(PORT, () => {
  console.log("backend is running in port: " + PORT);
});

//Hello
