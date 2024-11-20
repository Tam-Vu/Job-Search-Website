import { where } from "sequelize";
import db from "../models/index";
class InterviewScheduleService {
  createInterviewShedule = async (resumeId, jobId, location, date, time) => {
    try {
      const check = db.interviewschedules.findOne({
        where: {
          jobId,
          resumeId,
          date,
          time,
        },
      });
      if (check) {
        return {
          EM: "You have already done",
          EC: 1,
          DT: "",
        };
      }
      const interviewschedule = db.interviewschedules.create({
        resumeId,
        jobId,
        location,
        date,
        time,
      });
      return {
        EM: "success",
        EC: 0,
        DT: interviewschedule,
      };
    } catch (error) {
      return {
        EM: error.message,
        EC: 1,
        DT: "",
      };
    }
  };
}

module.exports = new InterviewScheduleService();
