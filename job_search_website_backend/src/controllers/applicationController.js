import applicationService from "../services/applicationService";

class ApplicationController {
    createApplication = async (req, res) => {
        try {
            const { jobId, resumeId } = req.body;
            if (!jobId || !resumeId) {
                return res.status(200).json({
                    EM: 'Missing required fields',
                    EC: '1',
                    DT: ''
                });
            }
            const response = await applicationService.createApplication(jobId, resumeId);
            return res.status(200).json(response);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
module.exports = new ApplicationController();