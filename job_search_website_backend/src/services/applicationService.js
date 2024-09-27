import db from "../models/index";

class ApplicationService {
    createApplication = async (jobId, resumeId) => {
        try {
            const check = await db.applications.findOne({
                where: {
                    jobId: jobId,
                    resumeId: resumeId
                }
            })
            if (check) {
                return {
                    EM: 'You have already applied this job',
                    EC: 1,
                    DT: ''
                }
            }
            const application = await db.applications.create({ jobId, resumeId });
            return {
                EM: 'Application created successfully',
                EC: '0',
                DT: application
            }
        }
        catch (error) {
            return {
                EM: error.message,
                EC: 1,
                DT: ''
            }
        }
    }
}
module.exports = new ApplicationService();
