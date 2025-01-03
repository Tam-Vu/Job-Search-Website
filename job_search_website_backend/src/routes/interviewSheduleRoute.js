import InterviewScheduleController from "../controllers/interviewScheduleController";
import express from "express";
import { checkUserJwt } from "../middlewares/jwtService"
const router = express.Router();

const interviewScheduleRoute = (app) => {
  router.post("/create/:applicationId", InterviewScheduleController.createInterviewShedule);
  // router.put("/update/:interviewScheduleId", InterviewScheduleController.updateInterviewSchedule);
  router.patch("/complete/:interviewScheduleId", InterviewScheduleController.completeInterviewShedule);
  router.patch("/cancel/:interviewScheduleId", InterviewScheduleController.cancelInterviewShedule);
  router.get("/my-interview", checkUserJwt, InterviewScheduleController.getMyInterviewSchedule);
  router.get("/my-interview-recuiter", checkUserJwt, InterviewScheduleController.getAllInterviewScheduleByEmployerId);
  router.get("/:jobId", InterviewScheduleController.getInterviewScheduleByJob);

  return app.use("/interview-schedule", router);
};

module.exports = interviewScheduleRoute;
