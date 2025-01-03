import jobController from "../controllers/jobController";
import {checkUserJwt} from "../middlewares/jwtService";
import express from "express";

const router = express.Router();

const jobRoute = (app) => {
  router.post("/create-job", checkUserJwt, jobController.createJob);
  router.get("/my-jobs", jobController.GetMyJobs);
  router.get("/employer/:id", jobController.GetJobByEmployerId);
  router.get("/get-all-legal-job", jobController.GetAllLegalJob);
  router.get("/recommended-job", checkUserJwt, jobController.getRecommendedJobs);
  router.post("/save-job/:id", checkUserJwt, jobController.saveJob);
  router.get("/my-saved-jobs", checkUserJwt, jobController.getAllMySavedJobs);
  router.get("/single-job/:id",checkUserJwt, jobController.GetJobById);
  return app.use("/jobs", router);
};

module.exports = jobRoute;
