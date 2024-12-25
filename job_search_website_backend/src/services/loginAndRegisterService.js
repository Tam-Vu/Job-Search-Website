import db from "../models/index";
import { hashUserPassword, checkPassword } from "../utils/security";
import { createJWT } from "../middlewares/jwtService";
import { checkEmail } from "../utils/valiation";
class LoginAndRegisterService {
  registerUser = async (email, password, confirmPassword, fullName) => {
    try {
      if (password !== confirmPassword) {
        return {
          EM: "Password and confirm password do not match",
          EC: 1,
          DT: "",
        };
      }
      const hashPassword = hashUserPassword(password);
      let checkUser = {};
      checkUser = await checkEmail(email);
      if (checkUser) {
        return {
          EM: "Email has been used",
          EC: 1,
          DT: "",
        };
      }
      const user = await db.users.create({
        email,
        password: hashPassword,
        role: 3,
      });
      await db.employees.create({ fullName, userId: user.id });
      return {
        EM: "Register successfully",
        EC: 0,
        DT: user,
      };
    } catch (e) {
      return {
        EM: e.message,
        EC: 1,
        DT: "",
      };
    }
  };

  registerEmployer = async (
    companyName,
    companyDescription,
    location,
    website,
    email,
    password,
    confirmPassword,
    field,
  ) => {
    try {
      if (password !== confirmPassword) {
        return {
          EM: "Password and confirm password do not match",
          EC: 1,
          DT: "",
        };
      }
      let checkUser = await checkEmail(email);
      if (checkUser) {
        return {
          EM: "Email has been used",
          EC: 1,
          DT: "",
        };
      }
      const hashPassword = hashUserPassword(password);
      let account = await db.users.create({
        email,
        password: hashPassword,
        role: 2,
      });
      let employer = await db.employers.create({
        companyName,
        companyDescription,
        location,
        website,
        userId: account.id,
        field,
      });
      return {
        EM: "Register successfully",
        EC: 0,
        DT: employer,
      };
    } catch (e) {
      return {
        EM: e.message,
        EC: 1,
        DT: "",
      };
    }
  };

  login = async (email, password) => {
    try {
      const user = await db.users.findOne({
        where: {
          email: email,
        },
      });
      if (!user) {
        return {
          EM: "email or password is incorrect",
          EC: 1,
          DT: "",
        };
      }
      const isCorrectPassword = checkPassword(password, user.password);
      if (isCorrectPassword) {
        let payload = {};
        if (user.role === "employer") {
          const employer = await db.employers.findOne({
            where: {
              userId: user.id,
            },
          });
          payload = {
            id: user.id,
            role: user.role,
            employerId: employer.id,
          };
        } else {
          const employee = await db.employees.findOne({
            where: {
              userId: user.id,
            },
          });
          payload = {
            id: user.id,
            role: user.role,
            employeeId: employee.id,
          };
        }

        let token = createJWT(payload);
        return {
          EM: "login successfully",
          EC: 0,
          DT: token, payload
        };
      } else {
        return {
          EM: "email or password is incorrect",
          EC: 1,
          DT: "",
        };
      }
    } catch (e) {
      return {
        EM: e.message,
        EC: 1,
        DT: "",
      };
    }
  };
}

module.exports = new LoginAndRegisterService();
