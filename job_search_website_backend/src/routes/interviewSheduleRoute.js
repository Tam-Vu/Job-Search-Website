import InterviewScheduleController from "../controllers/interviewScheduleController";
import express from "express";

const router = express.Router();

const interviewScheduleRoute = (app) => {
  router.post("/create", InterviewScheduleController.createInterviewShedule);

  return app.use("/interview-schedule", router);
};

module.exports = interviewScheduleRoute;
