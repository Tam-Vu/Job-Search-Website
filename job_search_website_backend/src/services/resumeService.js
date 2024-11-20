import { where } from "sequelize";
import db from "../models/index";
import users from "../models/user";
class ResumeService {
  createResume = async (name, skill, experience, education, userId) => {
    try {
      const resume = await db.resumes.create({
        name,
        skill,
        experience,
        education,
        userId,
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
            model: db.users,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
        where: {
          id: resumeId,
        },
      });
      return {
        EM: "get resume successfully",
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
}

module.exports = new ResumeService();
