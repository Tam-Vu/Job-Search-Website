import jobService from "../services/jobService";

class JobController {
    createJob = async (req, res) => {
        try {
            const { title, description, location, salaryRange, jobType, requirements, jobCategory } = req.body;
            if (!title || !description || !location || !salaryRange || !jobType || !requirements || !jobCategory) {
                return res.status(200).json({
                    EM: 'Missing required fields',
                    EC: '1',
                    DT: ''
                });
            }
            const employerId = req.user.employerId;
            const response = await jobService.createJob(title, description, location, salaryRange, jobType, requirements, jobCategory, employerId);
            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }

    }
}
module.exports = new JobController();
