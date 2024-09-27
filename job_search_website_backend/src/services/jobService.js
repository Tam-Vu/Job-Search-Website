import db from "../models/index";

class JobService {
    createJob = async (title, description, location, salaryRange, jobType, requirements, jobCategory, employerId) => {
        try {
            const job = await db.jobs.create({ title, description, location, salaryRange, jobType, requirements, jobCategory, employerId });
            return {
                EM: "Create job successfully",
                EC: 0,
                DT: job
            };
        } catch (error) {
            return {
                EM: error.message,
                EC: 1,
                DT: ""
            };
        }
    }
}

module.exports = new JobService();