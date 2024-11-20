import jobController from "../controllers/jobController";
import express from "express";

const router = express.Router();

const jobRoute = (app) => {
  router.post("/create-job", jobController.createJob);
  router.get("/my-jobs", jobController.GetMyJobs);
  router.get("/employer/:id", jobController.GetJobByEmployerId);
  router.get("/get-all-legal-job", jobController.GetAllLegalJob);
  router.get("/:id", jobController.GetJobById);
  return app.use("/jobs", router);
};

module.exports = jobRoute;
