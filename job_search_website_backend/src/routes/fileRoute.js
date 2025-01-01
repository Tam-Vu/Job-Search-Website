import express from "express";
import fileController from "../controllers/fileController";
const router = express.Router();
import multer from "multer";
const upload = multer();
const fileRoute = (app) => {
  router.post("/upload", upload.single("file"), fileController.uploadFile);

  return app.use("/file", router);
};

module.exports = fileRoute;
