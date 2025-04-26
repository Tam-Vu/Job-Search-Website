import ChatController from "../controllers/chatController";
import express from "express";
import { checkUserJwt } from "../middlewares/jwtService";
import multer from "multer";

const router = express.Router();
const upload = multer();

const chatRoute = (app) => {
  // Create a new conversation
  router.post("/conversations", checkUserJwt, ChatController.createConversation);
  
  // Add members to a conversation
  router.post("/conversations/:conversationId/members", checkUserJwt, ChatController.addMembersToConversation);
  
  // Send a message (with optional file)
  router.post("/conversations/:conversationId/messages", checkUserJwt, upload.single("file"), ChatController.sendMessage);
  
  // Mark conversation as seen
  router.patch("/conversations/:conversationId/seen", checkUserJwt, ChatController.markAsSeen);
  
  // Get messages for a conversation
  // Supports query parameters: page, limit, startDate, endDate
  router.get("/conversations/:conversationId/messages", checkUserJwt, ChatController.getMessages);
  
  // Get all conversations for the current user
  router.get("/conversations", checkUserJwt, ChatController.getConversations);

  return app.use("/chat", router);
};

module.exports = chatRoute;
