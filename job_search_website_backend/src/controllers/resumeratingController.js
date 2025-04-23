import resumeratingService from '../services/resumeratingService';
class resumeratingController {
    getAllRatings = async(req, res) => {
        try {
            const response = await resumeratingService.getAllRatings(req.params.id);
            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    createRating = async(req, res) => {
        try {
            const { star, content } = req.body;
            const resumeId = req.params.id;
            const employerId = req.user.employerId;
            const response = await resumeratingService.createRating(resumeId, employerId, star, content);
            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
module.exports = new resumeratingController();