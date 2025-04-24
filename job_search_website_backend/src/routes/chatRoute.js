import ChatController from "../controllers/chatController";
import express from "express";
import { checkUserJwt } from "../middlewares/jwtService";

const router = express.Router();

const chatRoute = (app) => {
    router.post("/create-conversation", checkUserJwt, ChatController.createConversation);
    router.post("/send-message", checkUserJwt, ChatController.sendMessage);
    router.get("/get-messages/:id", checkUserJwt, ChatController.getMessages);
    router.get("/get-conversations", checkUserJwt, ChatController.getConversations);
  return app.use("/chat", router);
};

module.exports = chatRoute;
