import userController from "../controllers/userController";
import express from "express";
import { checkUserJwt, checkUserPermission } from "../middlewares/jwtService";
const router = express.Router();

const userRoute = (app) => {
  router.get("/me", checkUserJwt, userController.getCurrentUser);
  router.delete("/delete-user/:userId", userController.deleteUser);
  return app.use("/user", router);
};

module.exports = userRoute;
