import e from "express";
import db from "../models/index";
import EmailService from "../utils/EmailService";
import { raw } from "body-parser";
class InterviewScheduleService {
  createInterviewShedule = async (applicationId, location, date, time) => {
    try {
      const check = await db.interviewschedules.findOne({
        where: {
          applicationId,
        }
      });
      if (check) {
        return {
          EM: "Interview Schedule already created",
          EC: 1,
          DT: "",
        };
      }
      const interviewschedule = await db.interviewschedules.create({
        applicationId,
        location,
        date,
        time,
      });
      const applicationData = await db.applications.findOne({
        where: {
          id: applicationId,
        },
        include: [
          {
            model: db.jobs,
            attributes: ["title", "id"],            
            include: [
              {
                model: db.employers,
                attributes: ["id", "companyName", "field"],
              }
            ]
          },
          {
            model: db.resumes,
            attributes: ["id", "name"],
            include: [
              {
                model: db.employees,
                attributes: { exclude: ["createdAt", "updatedAt"] },
                include: [
                  {
                    model: db.users,
                    attributes: ["email", "image"],
                  }
                ]
              }
            ]
          },
        ],
        raw: false,
        nest: true,
      });
      const email = applicationData.resume.employee.user.email;
      const jobTitle = applicationData.job.title;
      const companyName = applicationData.job.employer.companyName;
      EmailService.sendInterviewScheduleEmail(email, jobTitle, companyName, interviewschedule.location, interviewschedule.date, interviewschedule.time);
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
      const applicationData = await db.applications.findOne({
        where: {
          id: interviewschedule.applicationId,
        },
        include: [
          {
            model: db.jobs,
            attributes: ["title", "id"],            
            include: [
              {
                model: db.employers,
                attributes: ["id", "companyName", "field"],
              }
            ]
          },
          {
            model: db.resumes,
            attributes: ["id", "name"],
            include: [
              {
                model: db.employees,
                attributes: { exclude: ["createdAt", "updatedAt"] },
                include: [
                  {
                    model: db.users,
                    attributes: ["email", "image"],
                  }
                ]
              }
            ]
          },
        ],
        raw: false,
        nest: true,
      });
      const email = applicationData.resume.employee.user.email;
      const jobTitle = applicationData.job.title;
      const companyName = applicationData.job.employer.companyName;
      EmailService.sendCompletedInterviewScheduleEmail(email, jobTitle, companyName, interviewschedule.location);
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
        EM: "interivew completed",
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
      const applicationData = await db.applications.findOne({
        where: {
          id: interviewschedule.applicationId,
        },
        include: [
          {
            model: db.jobs,
            attributes: ["title", "id"],            
            include: [
              {
                model: db.employers,
                attributes: ["id", "companyName", "field"],
              }
            ]
          },
          {
            model: db.resumes,
            attributes: ["id", "name"],
            include: [
              {
                model: db.employees,
                attributes: { exclude: ["createdAt", "updatedAt"] },
                include: [
                  {
                    model: db.users,
                    attributes: ["email", "image"],
                  }
                ]
              }
            ]
          },
        ],
        raw: false,
        nest: true,
      });
      const email = applicationData.resume.employee.user.email;
      const jobTitle = applicationData.job.title;
      const companyName = applicationData.job.employer.companyName;
      EmailService.sendCanceledInterviewScheduleEmail(email, jobTitle, companyName, interviewschedule.location, interviewschedule.date, interviewschedule.time);
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
        EM: "interivew cancelled",
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

  getMyInterviewSchedule = async (employeeId) => {
    try {
      const interviewschedules = await db.interviewschedules.findAll({
        include: [
          {
            model: db.applications,
            attributes: ["status", "id"],
            required: true,
            include: [
              {
                model: db.jobs,
                attributes: ["title", "id"],
                required: true,
                include: [
                  {
                    model: db.employers,
                    attributes: ["companyName", "id"],
                    required: true,
                  },
                ],
              },
              {
                model: db.resumes,
                attributes: ["id", "name"],
                required: true,
                include: [
                  {
                    model: db.employees,
                    attributes: ["fullName"],
                    required: true,
                    where: {
                      id: employeeId,
                    },
                  },
                ],
              },
            ],
          }
        ],
        attributes: { exclude: ["createdAt", "updatedAt"] },
        raw: false,
        nest: true,
      });
      return {
        EM: "these are my interview schedules",
        EC: 0,
        DT: interviewschedules,
      };
    } catch (error) {
      return {
        EM: error.message,
        EC: 1,
        DT: "",
      };
    }
  };

  getInterviewScheduleByJobId = async (jobId) => {
    try {
      const interviewschedules = await db.interviewschedules.findAll({
        include: [
          {
            model: db.applications,
            attributes: ["status", "id"],
            required: true,
            include: [
              {
                model: db.jobs,
                attributes: ["title", "id"],
                required: true,
                where: {
                  id: jobId,
                },
                include: [
                  {
                    model: db.employers,
                    attributes: ["companyName", "id"],
                    required: true,
                  },
                ],
              },
              {
                model: db.resumes,
                attributes: ["id", "name"],
                required: true,
                include: [
                  {
                    model: db.employees,
                    attributes: ["fullName"],
                    required: true,
                  },
                ],
              },
            ],
          }
        ],
        attributes: { exclude: ["createdAt", "updatedAt"] },
        raw: false,
        nest: true,
      });
      return {
        EM: "these are interview schedules for this job",
        EC: 0,
        DT: interviewschedules,
      };
    } catch (error) {
      return {
        EM: error.message,
        EC: 1,
        DT: "",
      };
    }
  }

  getAllInterviewScheduleByEmployerId = async(employerId) => {
    try
    {
      const interviewschedules = await db.interviewschedules.findAll({
        include: [
          {
            model: db.applications,
            attributes: ["status", "id"],
            required: true,
            include: [
              {
                model: db.jobs,
                attributes: ["title", "id"],
                required: true,
                include: [
                  {
                    model: db.employers,
                    attributes: ["companyName", "id"],
                    required: true,
                    where: {
                      id: employerId,
                    }
                  },
                ],
              },
              {
                model: db.resumes,
                attributes: ["id", "name"],
                required: true,
                include: [
                  {
                    model: db.employees,
                    attributes: ["fullName"],
                    required: true,
                  },
                ],
              },
            ],
          }
        ],
        attributes: { exclude: ["createdAt", "updatedAt"] },
        raw: false,
        nest: true,
      });
      return {
        EM: "these are interview schedules for this job",
        EC: 0,
        DT: interviewschedules,
      }
    }
    catch(error)  
    {
      return {
        EM: error.message,
        EC: 1,
        DT: "",
      }
    }
  }
}

module.exports = new InterviewScheduleService();
