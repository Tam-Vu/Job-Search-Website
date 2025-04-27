import { raw } from "body-parser";
import db from "../models";
class resumeratingService {
  getAllRatings = async (id) => {
    try {
      const resumeratings = await db.resumeratings.findAll({
        where: {
          resumeId: id,
        },
        include: [
          {
            model: db.employers,
            include: [
              {
                model: db.users,
              },
            ],
          },
        ],
        raw: false,
        nest: true,
      });
      return {
        EM: "Get all ratings successfully",
        EC: 0,
        DT: resumeratings,
      };
    } catch (error) {
      return {
        EM: error.message,
        EC: 1,
        DT: "",
      };
    }
  };

  createRating = async (resumeId, employerId, star, content) => {
    try {
      const resumerating = await db.resumeratings.create({
        resumeId: resumeId,
        employerId: employerId,
        star: star,
        content: content,
      });
      return {
        EM: "update rating successfully",
        EC: 0,
        DT: resumerating,
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
module.exports = new resumeratingService();
