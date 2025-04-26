import express from "express";
import { checkUserJwt } from "../middlewares/jwtService";
import multer from "multer";

const router = express.Router();
const upload = multer();

const chatRoute = (app, io) => {
  // Import the controller with io
  const ChatController = require("../controllers/chatController")(io);

  // Create a new conversation
  router.post("/conversations", checkUserJwt, ChatController.createConversation.bind(ChatController));
  
  // Add members to a conversation
  router.post("/conversations/:conversationId/members", checkUserJwt, ChatController.addMembersToConversation.bind(ChatController));
  
  // Send a message (with optional file)
  router.post("/conversations/:conversationId/messages", checkUserJwt, upload.single("file"), ChatController.sendMessage.bind(ChatController));
  
  // Mark conversation as seen
  router.patch("/conversations/:conversationId/seen", checkUserJwt, ChatController.markAsSeen.bind(ChatController));
  
  // Get messages for a conversation
  router.get("/conversations/:conversationId/messages", checkUserJwt, ChatController.getMessages.bind(ChatController));
  
  // Get all conversations for the current user
  router.get("/conversations", checkUserJwt, ChatController.getConversations.bind(ChatController));

  return app.use("/chat", router);
};

module.exports = chatRoute;
