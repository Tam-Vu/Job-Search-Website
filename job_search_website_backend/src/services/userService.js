import db from "../models/index";
import user from "../models/user";
import FileService from "./fileService"

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

  updateUser = async (employeeId, fullName, email, image, file) => {
    try
    {
      if (file != null)
      {
        image = await FileService.uploadFile(file);
      }
      const employee = await db.employees.findOne({
        where: {
          id: employeeId,
        },
      })
      if (employee === null) {
        return {
          EM: "Employee not found",
          EC: 1,
          DT: "",
        };
      }
      await db.employees.update(
        {
          fullName: fullName,
        },
        {
          where: {
            id: employeeId,
          }
        }
      )
      await db.users.findOne({
        where: {
          id: employee.userId,
        },
      });
      if (user === null) {
        return {
          EM: "User not found",
          EC: 1,
          DT: "",
        };
      }
      await db.users.update(
        {
          email: email,
          image: image,
        },
        {
          where: {
            id: employee.userId,
          },
        }
      );
      return {
        EM: "Update user successfully",
        EC: 0,
        DT: "",
      };
    }
    catch(error)
    {
      return {
        EM: error.message,
        EC: 1,
      }
    }
  }
}

module.exports = new UserService();
