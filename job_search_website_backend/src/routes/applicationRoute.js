import applicationController from "../controllers/applicationController";
import express from "express";
import {checkUserJwt} from "../middlewares/jwtService";
const router = express.Router();

const applicationRoute = (app) => {
  router.post("/apply/:jobId", applicationController.createApplication);
  router.get("/my-applications", checkUserJwt, applicationController.getAllMyApplications);
  router.get("/:jobId", applicationController.getApplicationsByJobId);
  router.patch("/approve/:applicationId", applicationController.approveApplication);
  router.patch("/reject/:applicationId", applicationController.rejectApplication);
  router.get("/accepted/:jobId", applicationController.getAllAcceptedApplicationsByJobId);
  router.put("/update/:applicationId", applicationController.updateApplication);
  return app.use("/applications", router);
};

module.exports = applicationRoute;
