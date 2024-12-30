import db from "../models/index";

class ApplicationService {
  createApplication = async (jobId, resumeId) => {
    try {
      const check = await db.applications.findOne({
        where: {
          jobId: jobId,
          resumeId: resumeId
        },
      });
      if (check) {
        return {
          EM: "You have already applied this job",
          EC: 1,
          DT: "",
        };
      }
      const application = await db.applications.create({ 
        jobId: jobId, 
        resumeId: resumeId,
        status: "pending" 
      });
      return {
        EM: "Application created successfully",
        EC: "0",
        DT: application,
      };
    } catch (error) {
      return {
        EM: error.message,
        EC: 1,
        DT: "",
      };
    }
  };

  getAllMyApplications = async (employeeId) => {
    try
    {
      const applications = await db.applications.findAll({
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
            required: true,
            attributes: ["id", "name"],
            where: {
              employeeId: employeeId,
            },
          },
        ],
        attributes: { exclude: ["createdAt", "updatedAt"] },
        raw: false,
        nest: true,
      });
      return {
        EM: "Get all applications successfully",
        EC: 0,
        DT: applications,
      };
    }
    catch (error) {
      return {
        EM: error.message,
        EC: 1,
        DT: "",
      };
    }
  }

  getApplicationsByJobId = async (jobId) => {
    try {
      const applications = await db.applications.findAll({
        include: [
          {
            model: db.jobs,
            attributes: ["title", "id"],
          },
          {
            model: db.resumes,
            attributes: ["id", "name"],
            include: [
              {
                model: db.employees,
                attributes: ["id", "fullName"],
              }
            ]
          },
        ],
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: {
          jobId: jobId,
        },
        raw: false,
        nest: true,
      });
      return {
        EM: "Get all applications successfully",
        EC: 0,
        DT: applications,
      };
    } catch (error) {
      return {
        EM: error.message,
        EC: 1,
        DT: "",
      };
    }
  };

  approveApplication = async (applicationId) => {
    try {
      const application = await db.applications.update(
        { status: "accepted" },
        {
          where: {
            id: applicationId,
          },
        }
      );
      return {
        EM: "Application approved successfully",
        EC: 0,
        DT: application,
      };
    } catch (error) {
      return {
        EM: error.message,
        EC: 1,
        DT: "",
      };
    }
  };

  rejectApplication = async (applicationId) => {
    try {
      const application = await db.applications.update(
        { status: "rejected" },
        {
          where: {
            id: applicationId,
          },
        }
      );
      return {
        EM: "Application rejected successfully",
        EC: 0,
        DT: application,
      };
    } catch (error) {
      return {
        EM: error.message,
        EC: 1,
        DT: "",
      };
    }
  };

  getAllAcceptedApplicationsByJobId = async (jobId) => {
    try {
      const applications = await db.applications.findAll({
        include: [
          {
            model: db.jobs,
            attributes: ["title", "id"],
          },
          {
            model: db.resumes,
            attributes: ["id", "name"],
          },
        ],
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: {
          jobId: jobId,
          status: "accepted",
        },
        raw: false,
        nest: true,
      });
      return {
        EM: "Get all applications successfully",
        EC: 0,
        DT: applications,
      };
    } catch (error) {
      return {
        EM: error.message,
        EC: 1,
        DT: "",
      };
    }
  }
}
module.exports = new ApplicationService();
