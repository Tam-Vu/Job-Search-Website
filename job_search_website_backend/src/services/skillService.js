import db from "../models";
class SkillService {
    getAllSkills = async () => {
        try
        {
            const skills = await db.skills.findAll(
                {
                    attributes: { exclude: ["createdAt", "updatedAt"] },
                }
            );
            return {
                EM: "Get all skills successfully",
                EC: 0,
                DT: skills,
              };
        }
        catch (error)
        {
            return {
                EM: error.message,
                EC: 1,
                DT: "",
              };
        }
    }
}
module.exports = new SkillService();