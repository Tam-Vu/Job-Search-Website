import db from "../models";
class EmployerService {
    getEmployers = async() => {
        try {
            const employers = await db.employers.findAll();
            return {
                EM: 'Success',
                EC: 0,
                DT: employers
            }
        } catch(error) {
            return {
                EM: error.message,
                EC: 1,
                DT: ''
            }
        }
    }

    getEmployerById = async(employerId) => {
        try {
            const employer = await db.employers.findOne({
                where: {
                    id: employerId
                }
            });
            if (employer === null) {
                return {
                    EM: 'Employer not found',
                    EC: 1,
                    DT: ''
                }
            }
            return {
                EM: 'Success',
                EC: 0,
                DT: employer
            }
        } catch(error) {
            return {
                EM: error.message,
                EC: 1,
                DT: ''
            }
        }
    }
}

module.exports = new EmployerService();
