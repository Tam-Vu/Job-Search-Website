import EmployerService from "../services/employerSerivce";
class EmployerController {
    getEmployers = async(req, res) => {
        try {
            const result = await EmployerService.getEmployers();
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    getEmployerById = async(req, res) => {
        try {
            const employerId = req.params.id;
            const result = await EmployerService.getEmployerById(employerId);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new EmployerController();