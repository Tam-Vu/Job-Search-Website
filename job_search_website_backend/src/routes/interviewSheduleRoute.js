import InterviewScheduleController from "../controllers/interviewScheduleController";
import express from "express";

const router = express.Router();

const interviewScheduleRoute = (app) => {
  router.post("/create/:applicationId", InterviewScheduleController.createInterviewShedule);
  // router.put("/update/:interviewScheduleId", InterviewScheduleController.updateInterviewSchedule);
  router.patch("/complete/:interviewScheduleId", InterviewScheduleController.completeInterviewShedule);
  router.patch("/cancel/:interviewScheduleId", InterviewScheduleController.cancelInterviewShedule);
  // router.get("/my-interview", InterviewScheduleController.createInterviewShedule);
  // router.get("/:jobId", InterviewScheduleController.createInterviewShedule);

  return app.use("/interview-schedule", router);
};

module.exports = interviewScheduleRoute;
