
import skillService from '../services/skillService';
class SkillController {
    getAllSkills = async(req, res) => {
        try {
            const response = await skillService.getAllSkills();
            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
module.exports = new SkillController();