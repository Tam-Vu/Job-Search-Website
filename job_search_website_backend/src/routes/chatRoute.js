import ChatController from "../controllers/chatController";
import express from "express";
import { checkUserJwt } from "../middlewares/jwtService";

const router = express.Router();

const chatRoute = (app) => {
  router.post("/create-conversation", checkUserJwt, ChatController.createConversation);
  router.post("/send-message", checkUserJwt, ChatController.sendMessage);

  return app.use("/chat", router);
};

module.exports = chatRoute;
