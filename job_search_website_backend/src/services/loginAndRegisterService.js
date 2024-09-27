import { where } from "sequelize";
import db from "../models/index";
import { hashUserPassword, checkPassword } from "../utils/security";
import { createJWT } from "../middlewares/jwtService";
import { checkEmail } from "../utils/valiation";
class LoginAndRegisterService {
    registerUser = async (email, password, fullName, role) => {
        try {
            const hashPassword = hashUserPassword(password);
            let checkUser = {};
            checkUser = await checkEmail(email);
            if (checkUser) {
                return {
                    EM: "Email has been used",
                    EC: 1,
                    DT: ""
                }
            }
            const user = await db.users.create({ email, password: hashPassword, fullName, role });
            return {
                EM: "Register successfully",
                EC: 0,
                DT: user
            };
        } catch (e) {
            return {
                EM: e.message,
                EC: 1,
                DT: "",
            };
        }
    }

    registerEmployer = async (companyName, companyDescription, location, website, fullName, email, password, role) => {
        try {
            let checkUser = await checkEmail(email);
            if (checkUser) {
                return {
                    EM: "Email has been used",
                    EC: 1,
                    DT: ""
                }
            }
            const hashPassword = hashUserPassword(password);
            let account = await db.users.create({ email, password: hashPassword, fullName, role });
            let employer = await db.employers.create({ companyName, companyDescription, location, website, userId: account.id });
            return {
                EM: "Register successfully",
                EC: 0,
                DT: employer
            };
        } catch (e) {
            return {
                EM: e.message,
                EC: 1,
                DT: "",
            };
        }
    }

    login = async (email, password) => {
        try {
            const user = await db.users.findOne({
                where: {
                    email: email
                }
            })
            if (!user) {
                return {
                    EM: "email or password is incorrect",
                    EC: 1,
                    DT: ""
                }
            }
            const isCorrectPassword = checkPassword(password, user.password);
            if (isCorrectPassword) {
                let payload = {};
                if (user.role === "employer") {
                    const employer = await db.employers.findOne({
                        where: {
                            userId: user.id
                        }
                    })
                    payload = {
                        id: user.id,
                        role: user.role,
                        employerId: employer.id
                    }
                }
                else {
                    payload = {
                        id: user.id,
                        role: user.role
                    }
                }

                let token = createJWT(payload);
                return {
                    EM: "login successfully",
                    EC: 0,
                    DT: token
                }
            }
            else {
                return {
                    EM: "email or password is incorrect",
                    EC: 1,
                    DT: ""
                }
            }
        } catch (e) {
            return {
                EM: e.message,
                EC: 1,
                DT: "",
            };
        }
    }
}

module.exports = new LoginAndRegisterService();