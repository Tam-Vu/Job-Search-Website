import { InstanceIdClientErrorCode } from "firebase-admin/instance-id";
import db from "../models/index";
import { raw } from "body-parser";

class UserService {
  getCurrentUser = async (userId, role) => {
    try {
      if(role == "user")
      {        
        const user = await db.users.findOne({
          where: {
            id: userId,
          },
          include: [
            {
              model: db.employees,
              attributes: { exclude: ["createdAt", "updatedAt"] },
            }
          ],
          raw: false,
          nest: true,
          attributes: { exclude: ["createdAt", "updatedAt", "fullName"] },
        });
        if (!user) {
          return {
            EM: "User not found",
            EC: 1,
            DT: "",
          };
        }
        return {
          EM: "Get user successfully",
          EC: 0,
          DT: user,
        };
      }
      else
      {
        const user = await db.users.findOne({
          where: {
            id: userId,
          },
          include: [
            {
              model: db.employers,
              attributes: { exclude: ["createdAt", "updatedAt"] },
            }
          ],
          raw: false,
          nest: true,
          attributes: { exclude: ["createdAt", "updatedAt", "fullName"] },
        });
        if (!user) {
          return {
            EM: "User not found",
            EC: 1,
            DT: "",
          };
        }
        return {
          EM: "Get user successfully",
          EC: 0,
          DT: user,
        };
      }
    } catch (error) {
      return {
        EM: error.message,
        EC: 1,
        DT: "",
      };
    }
  };
  deleteUser = async (userId) => {
    try {
      const user = await db.users.findByPk(userId);
      if (!user) {
        return {
          EM: "User not found",
          EC: 1,
          DT: "",
        };
      }
      await db.users.destroy({
        where: {
          id: userId,
        },
      });
      return {
        EM: "Delete user successfully",
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

module.exports = new UserService();
