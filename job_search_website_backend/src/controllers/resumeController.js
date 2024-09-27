import resumeService from "../services/resumeService";

class ResumeController {
    createResume = async (req, res) => {
        try {
            let { name, skill, experience, education } = req.body;
            console.log(name, skill, experience, education);
            if (!name || !skill || !experience || !education) {
                return res.status(200).json({
                    EM: 'Missing required fields',
                    EC: '1',
                    DT: ''
                });
            }
            let userId = req.user.id;
            let response = await resumeService.createResume(name, skill, experience, education, userId);
            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    detailsResume = async (req, res) => {
        try {
            let resumeId = req.params.resumeId;
            let response = await resumeService.detailsResume(resumeId);
            return res.status(200).json(response);
        } catch(error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ResumeController();
