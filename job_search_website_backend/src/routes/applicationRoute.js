import applicationController from "../controllers/applicationController";
import express from "express";

const router = express.Router();

const applicationRoute = (app) => {
  router.post("/apply/:jobId", applicationController.createApplication);

  return app.use("/applications", router);
};

module.exports = applicationRoute;
