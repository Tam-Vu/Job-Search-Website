import userController from "../controllers/userController";
import express from "express";
import { checkUserJwt, checkUserPermission } from "../middlewares/jwtService";
const router = express.Router();
import multer from "multer";
const upload = multer();

const userRoute = (app) => {
  router.get("/me", checkUserJwt, userController.getCurrentUser);
  router.put("/update-user", checkUserJwt, upload.single('file'), userController.updateUser);
  router.delete("/delete-user/:userId", userController.deleteUser);
  return app.use("/user", router);
};

module.exports = userRoute;
