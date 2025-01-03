import db from "../models/index";
import Sequelize from "sequelize";
import userActivitiesService from "./userActivitiesService"
class JobService {
  createJob = async (
    title,
    description,
    location,
    salaryRange,
    jobType,
    requirements,
    employerId,
    industry,
    jobField,
    professionalPosition,
    experience,
    closedDate
  ) => {
    try {
      const job = await db.jobs.create({
        title,
        description,
        location,
        salaryRange,
        jobType,
        requirements,
        industry,
        jobField,
        professionalPosition,
        experience,
        closedDate,
        employerId,
        status: "accept",
      });
      return {
        EM: "Create job successfully",
        EC: 0,
        DT: job,
      };
    } catch (error) {
      return {
        EM: error.message,
        EC: 1,
        DT: "",
      };
    }
  };

  GetAllLegalJob = async () => {
    try {
      const LegalJobs = await db.jobs.findAll({
        where: {
          status: "accept",
        },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            model: db.employers,
            attributes: ["companyName", "id"],
          },
        ],
        raw: false,
        nest: true,
      });
      return {
        EM: "Get all legal jobs successfully",
        EC: 0,
        DT: LegalJobs,
      };
    } catch (error) {
      return {
        EM: error.message,
        EC: 1,
        DT: "",
      };
    }
  };

  GetJobById = async (id, userId) => {
    try {
      const job = await db.jobs.findOne({
        where: {
          id: id,
        },
        include: [
          {
            model: db.employers,
            attributes: ["companyName", "id"],
          },
        ],
        raw: true,
        nest: true,
      });
      if (!job) {
        return {
          EM: "Job not found",
          EC: 1,
          DT: "",
        };
      }
      userActivitiesService.AddUserActivity(userId, id, "view");
      return {
        EM: "Get job by id successfully",
        EC: 0,
        DT: job,
      };
    } catch (error) {
      return {
        EM: error.message,
        EC: 1,
        DT: "",
      };
    }
  };

  GetJobByEmployerId = async (employerId) => {
    try {
      const jobs = await db.jobs.findAll({
        where: {
          employerId: employerId,
        },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        raw: false,
        nest: true,
      });
      return {
        EM: "Get job by employer id successfully",
        EC: 0,
        DT: jobs,
      };
    } catch (error) {
      return {
        EM: error.message,
        EC: 1,
        DT: "",
      };
    }
  };

  getRecommendedJobs = async (userId) => {
    try
    {
      const userActivities = await db.useractivities.findAll({
        where: {
          userId: userId,
        },
        include: [
          {
            model: db.jobs,
            attributes: ["jobField"],
          },
        ],
        raw: false,
        nest: true,
      });
      const jobFields = userActivities.map((activity) => activity.job.jobField);
      const jobs = await db.jobs.findAll({
        where: {
          jobField: { [Sequelize.Op.in]: jobFields },
        },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            model: db.employers,
            attributes: ["companyName", "id"],
          },
        ],
        raw: false,
        nest: true,
      })
      return {
        EM: "Get recommendation jobs successfully",
        EC: 0,
        DT: jobs,
      }
    } catch (error)
    {
      return {
        EM: error.message,
        EC: 1,
        DT: "",
      };
    }
  };

  saveJob = async (userId, jobId) => {
    try {
      const check = await db.useractivities.findOne({
          where: {
              userId,
              jobId,
              activityType: "save",
          }
      });
      if (check) {
          return {
            EM: "This job is already saved",
            EC: 1,
            DT: "",
          };
      }
      const savedJob = await db.useractivities.create({
        userId: userId,
        jobId: jobId,
        activityType: "save"
      });
      return {
        EM: "Save job successfully",
        EC: 0,
        DT: savedJob,
      };
    } catch (error) {
      return {
        EM: error.message,
        EC: 1,
        DT: "",
      };
    }
  };

  getAllMySavedJobs = async (userId) => {
    try
    {
      const savedJobs = await db.useractivities.findAll({
        where: {
          userId: userId,
          activityType: "save",
        },
        include: [
          {
            model: db.jobs,
            attributes: { exclude: ["createdAt", "updatedAt"] },
            include: [
              {
                model: db.employers,
                attributes: ["companyName", "id"],
              },
            ],
          },
        ],
        raw: false,
        nest: true,
      });
      return {
        EM: "Get all saved jobs successfully",
        EC: 0,
        DT: savedJobs,
      };
    }
    catch(error)
    {
      return {
        EM: error.message,
        EC: 1,
        DT: "",
      };
    }
  }
}

module.exports = new JobService();
