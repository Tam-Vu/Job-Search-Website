import EmployerService from "../services/employerSerivce";
class EmployerController {
  getEmployers = async (req, res) => {
    try {
      const result = await EmployerService.getEmployers();
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  getEmployerById = async (req, res) => {
    try {
      const employerId = req.params.id;
      const result = await EmployerService.getEmployerById(employerId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  updateEmployer = async (req, res) => {
    try {
      const { companyName, companyDescription, location, website, field, email, image } = req.body;
      const employerId = req.user.employerId;
      const file = req.file;
      const result = await EmployerService.updateEmployer(employerId, companyName, companyDescription, location, website, field, email, image, file);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  GetMyCompany = async (req, res) => {
    try {
      const result = await EmployerService.getEmployerById(req.user.employerId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
}

module.exports = new EmployerController();
