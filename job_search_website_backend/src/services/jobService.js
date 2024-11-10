import { raw } from "body-parser";
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
    
    GetAllLegalJob = async() => {
        try {
            const LegalJobs = await db.jobs.findAll({
                where: {
                    status: "accept"
                },
                attributes:{exclude: ["createdAt", "updatedAt"]},
                include: [
                    {
                        model: db.employers,
                        attributes: ["companyName", "id"]
                    }
                ],
                raw: false,
                nest: true
            })
            return {
                EM: "Get all legal jobs successfully",
                EC: 0,
                DT: LegalJobs
            }
        } catch (error) {
            return {
                EM: error.message,
                EC: 1,
                DT: ""
            }
        }
    }

    GetJobById = async(id) => {
        try {
            const job = await db.jobs.findOne({
                where: {
                    id: id
                }
            })
            return {
                EM: "Get job by id successfully",
                EC: 0,
                DT: job
            }
        } catch (error) {
            return {
                EM: error.message,
                EC: 1,
                DT: ""
            }
        }
    }
}

module.exports = new JobService();