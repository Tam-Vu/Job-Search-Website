import db from "../models/index";
class InterviewScheduleService {
  createInterviewShedule = async (applicationId, location, date, time) => {
    try {
      const interviewschedule = db.interviewschedules.create({
        applicationId,
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

  updateInterviewShedule = async (interviewScheduleId, location, date, time) => {
    try {
      const interviewschedule = await db.interviewschedules.findOne({
        where: {
          id: interviewScheduleId,
        },
      });
      if (!interviewschedule) {
        return {
          EM: "Interview Schedule not found",
          EC: 1,
          DT: "",
        };
      }
      await db.interviewschedules.update(
        {
          location,
          date,
          time,
        },
        {
          where: {
            id: interviewScheduleId,
          },
        }
      );
      return {
        EM: "success",
        EC: 0,
        DT: "",
      };
    } catch (error) {
      return {
        EM: error.message,
        EC: 1,
        DT: "",
      };
    }
  };

  completeInterviewShedule = async (interviewScheduleId) => {
    try {
      const interviewschedule = await db.interviewschedules.findOne({
        where: {
          id: interviewScheduleId,
        },
      });
      if (!interviewschedule) {
        return {
          EM: "Interview Schedule not found",
          EC: 1,
          DT: "",
        };
      }
      await db.interviewschedules.update(
        {
          status: "completed",
        },
        {
          where: {
            id: interviewScheduleId,
          },
        }
      );
      return {
        EM: "success",
        EC: 0,
        DT: "",
      };
    } catch (error) {
      return {
        EM: error.message,
        EC: 1,
        DT: "",
      };
    }
  };

  cancelInterviewShedule = async (interviewScheduleId) => {
    try {
      const interviewschedule = await db.interviewschedules.findOne({
        where: {
          id: interviewScheduleId,
        },
      });
      if (!interviewschedule) {
        return {
          EM: "Interview Schedule not found",
          EC: 1,
          DT: "",
        };
      }
      await db.interviewschedules.update(
        {
          status: "cancelled",
        },
        {
          where: {
            id: interviewScheduleId,
          },
        }
      );
      return {
        EM: "success",
        EC: 0,
        DT: "",
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
