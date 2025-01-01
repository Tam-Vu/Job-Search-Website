import db from "../models/index";
import EmailService from "../utils/EmailService";
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

  updateApplication = async (applicationId, resumseId) => {
    try
    {
      const application = await db.applications.update(
        { resumeId: resumseId },
        {
          where: {
            id: applicationId,
          },
        }
      );
      return {
        EM: "Application updated successfully",
        EC: 0,
        DT: "",
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
            model: db.resumes,
            attributes: ["id", "name", "experience", "field"],
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
              },
              {
                model: db.resumeSkills,
                attributes: ['skillId'],
              },
              {
                model: db.experienceDetails,
                attributes: { exclude: ["createdAt", "updatedAt"] },
              },
              {
                model: db.educations,
                attributes: { exclude: ["createdAt", "updatedAt"] },
              }
            ],
          },
        ],
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: {
          jobId: jobId,
        },
        raw: false,
        nest: true,
      });
      const temps = applications.map(application => application.get({ plain: true }));
      const results = temps.map(item => {
          item.resume.resumeSkills = item.resume.resumeSkills.map(skill => skill.skillId);
        return item;
      });

      return {
        EM: "Get all applications successfully",
        EC: 0,
        DT: results,
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
      await db.applications.update(
        { status: "accepted" },
        {
          where: {
            id: applicationId,
          },
        }
      );
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
      EmailService.sendAcceptedApplicationEmail(email, jobTitle, companyName);
      return {
        EM: "Application approved successfully",
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
      EmailService.sendRejectedApplicationEmail(email, jobTitle, companyName);
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
            model: db.resumes,
            attributes: ["id", "name", "experience", "field"],
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
              },
              {
                model: db.resumeSkills,
                attributes: ['skillId'],
              },
              {
                model: db.experienceDetails,
                attributes: { exclude: ["createdAt", "updatedAt"] },
              },
              {
                model: db.educations,
                attributes: { exclude: ["createdAt", "updatedAt"] },
              }
            ],
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
      const temps = applications.map(application => application.get({ plain: true }));
      const results = temps.map(item => {
          item.resume.resumeSkills = item.resume.resumeSkills.map(skill => skill.skillId);
        return item;
      });
      return {
        EM: "Get all applications successfully",
        EC: 0,
        DT: results,
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
