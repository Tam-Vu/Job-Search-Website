import JobService from "../services/jobService";

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
            console.log(req.user);
            const employerId = req.user.employerId;
            const response = await JobService.createJob(title, description, location, salaryRange, jobType, requirements, jobCategory, employerId);
            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }

    }

    GetAllLegalJob = async (req, res) => {
        try {
            const response = await JobService.GetAllLegalJob();
            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    GetJobById = async (req, res) => {
        try {
            const jobId = req.params.id;
            const response = await JobService.GetJobById(jobId);
            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
module.exports = new JobController();
