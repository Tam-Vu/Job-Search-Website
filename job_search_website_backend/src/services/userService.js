import db from "../models/index";

class UserService {
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
