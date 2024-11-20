import userService from "../services/userService";

class UserController {
  deleteUser = async (req, res) => {
    try {
      const userId = req.params.userId;
      const response = await userService.deleteUser(userId);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
}

module.exports = new UserController();
