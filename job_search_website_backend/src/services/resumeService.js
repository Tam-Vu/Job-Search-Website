
import { raw } from "body-parser";
import db from "../models/index";
import {calculateExperience} from "../utils/valiation";
class ResumeService {
  createResume = async (name, employeeId, field) => {
    try {
      const resume = await db.resumes.create({
        name,
        employeeId,
        field
      });
      return {
        EM: "Create resume successfully",
        EC: 0,
        DT: resume,
      };
    } catch (error) {
      return {
        EM: error.message,
        EC: 1,
        DT: "",
      };
    }
  };

  detailsResume = async (resumeId) => {
    try {
      const resume = await db.resumes.findOne({
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
        where: {
          id: resumeId,
        },
        raw: false,
        nest: true,
        plain: true,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      const result = resume.get({ plain: true });
      const skillIds = result.resumeSkills.map(skill => skill.skillId);
      result.resumeSkills = skillIds;
      return {
        EM: "get resume successfully",
        EC: 0,
        DT: result,
      };
    } catch (error) {
      return {
        EM: error.message,
        EC: 1,
        DT: "",
      };
    }
  };

  updateResume = async (resumeId, name, description, skills, experienceDetails, educations) => {
    try {
      const resume = await db.resumes.findOne({
        where: {
          id: resumeId,
        },
      });
      if (!resume) {
        return {
          EM: "Resume not found",
          EC: 1,
          DT: "",
        };
      }
      await db.resumes.update(
        {
          name,
          description,
          experience: calculateExperience(experienceDetails),
        },
        {
          where: {
            id: resumeId,
          },
        }
      );
      const resumeEducations = await db.educations.findAll({
        where: {
          resumeId: resumeId,
        }
      })
      if(resumeEducations.length > 0) {
        await db.educations.destroy({
          where: {
            resumeId
          },
        });
      }
      for(const education of educations) {
        await db.educations.create({
          resumeId,
          startYear: education.startYear,
          endYear: education.endYear,
          university: education.university,
          degree: education.degree,
        })
      }
      const resumeSkills = await db.resumeSkills.findAll({
        where: {
          resumeId: resumeId,
        }
      })
      if(resumeSkills.length > 0) {
        await db.resumeSkills.destroy({
          where: {
            resumeId
          },
        });
      }
      for(const skill of skills) {
        await db.resumeSkills.create({
          resumeId,
          skillId: skill,
        })
      }
      const resumeExperiences = await db.experienceDetails.findAll({
        where: {
          resumeId: resumeId,
        }
      })
      if(resumeExperiences.length > 0) {
        await db.experienceDetails.destroy({
          where: {
            resumeId,
          },
        });
      }
      for(const experience of experienceDetails) {
        await db.experienceDetails.create({
          resumeId,
          companyName: experience.companyName,
          startMonth: experience.startMonth,
          startYear: experience.startYear,
          endMonth: experience.endMonth,
          endYear: experience.endYear,
          description: experience.description,
        })
      }
      return {
        EM: "Update resume successfully",
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
  }

  deleteResume = async (resumeId) => {
    try {
      const resume = await db.resumes.findOne({
        where: {
          id: resumeId,
        },
      });
      if (!resume) {
        return {
          EM: "Resume not found",
          EC: 1,
          DT: "",
        };
      }
      await db.resumes.destroy({
        where: {
          id: resumeId,
        },
      });
      await db.resumeSkills.destroy({
        where: {
          resumeId,
        },
      });
      await db.experienceDetails.destroy({
        where: {
          resumeId,
        },
      });
      await db.educations.destroy({
        where: {
          resumeId,
        },
      });
      return {
        EM: "Delete resume successfully",
        EC: 0,
        DT: "",
      };
    } catch (error) {
      return {
        EM: error.message,
        EC: 1,
        DT: "",
      }
    }
  };

  getAllMyResume = async (employeeId) => {
    try {
      const resumes = await db.resumes.findAll({
        where: {
          employeeId,
        },
        raw: false,
        nest: true,
      });
      return {
        EM: "Get all my resume successfully",
        EC: 0,
        DT: resumes,
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

module.exports = new ResumeService();
