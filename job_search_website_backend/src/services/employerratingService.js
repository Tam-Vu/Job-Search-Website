import { raw } from "body-parser";
import db from "../models";
class employerratingService {
    getAllRatings = async (id) => {
        try
        {
            const employerratings = await db.employerratings.findAll(
                {
                    where: {
                        employerId: id,
                    },
                    attributes: { exclude: ["createdAt", "updatedAt"] },
                    include: [
                        {
                        model: db.employees,
                        include: [
                            {
                                model: db.users,
                            }
                        ]
                        },
                    ],
                    raw: false,
                    nest: true,
                }
            );
            return {
                EM: "Get all ratings successfully",
                EC: 0,
                DT: employerratings,
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

        createRating = async (employeeId, employerId, star, content) => {
            try
            {
                const resumerating = await db.employerratings.create({
                    employeeId: employeeId,
                    employerId: employerId,
                    star: star,
                    content: content,
                });
                return {
                    EM: "update rating successfully",
                    EC: 0,
                    DT: resumerating,
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
module.exports = new employerratingService();