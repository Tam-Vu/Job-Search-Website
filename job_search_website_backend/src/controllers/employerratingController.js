import employerratingService from '../services/employerratingService';
class employerratingController {
    getAllRatings = async(req, res) => {
        try {
            const response = await employerratingService.getAllRatings(req.params.id);
            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    createRating = async(req, res) => {
        try {
            const employerId = req.params.id;
            const { star, content } = req.body;
            const employeeId = req.user.employeeId;
            const response = await employerratingService.createRating(employeeId, employerId, star, content);
            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
module.exports = new employerratingController();