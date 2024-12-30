import userService from "../services/userService";

class UserController {
  getCurrentUser = async (req, res) => {
    try {
      const userId = req.user.id;
      const role = req.user.role;
      const response = await userService.getCurrentUser(userId, role);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
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
