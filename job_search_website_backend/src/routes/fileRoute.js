import express from "express";
import multer from "multer";
import fileController from "../controllers/fileController";
const router = express.Router();
const upload = multer();
const fileRoute = (app) => {
  router.post("/upload", upload.single("file"), fileController.uploadFile);

  return app.use("/file", router);
};

module.exports = fileRoute;
