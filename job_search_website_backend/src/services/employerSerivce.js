import db from "../models";
import FileService from "./fileService"

class EmployerService {
  getEmployers = async () => {
    try {
      const employers = await db.employers.findAll();
      return {
        EM: "Success",
        EC: 0,
        DT: employers,
      };
    } catch (error) {
      return {
        EM: error.message,
        EC: 1,
        DT: "",
      };
    }
  };

  getEmployerById = async (employerId) => {
    try {
      const employer = await db.employers.findOne({
        where: {
          id: employerId,
        },
      });
      if (employer === null) {
        return {
          EM: "Employer not found",
          EC: 1,
          DT: "",
        };
      }
      return {
        EM: "Success",
        EC: 0,
        DT: employer,
      };
    } catch (error) {
      return {
        EM: error.message,
        EC: 1,
        DT: "",
      };
    }
  };

  updateEmployer = async (employerId, companyName, companyDescription, location, website, field, email, image, file) => {
    try
    {
      if (file != null)
      {
        image = await FileService.uploadFile(file);
      }
      const employer = await db.employers.findOne({
        where: {
          id: employerId,
        },
      });
      if (employer === null) {
        return {
          EM: "Employer not found",
          EC: 1,
          DT: "",
        };
      }
      await db.employers.update(
        {
          companyName: companyName,
          companyDescription: companyDescription,
          location: location,
          website: website,
          field: field,
        },
        {
          where: {
            id: employerId,
          },
        }
      );
      await db.users.update(
        {
          email: email,
          image: image,
        },
        {
          where: {
            id: employer.userId,
          },
        }
      )
      return {
        EM: "Update employer successfully",
        EC: 0,
        DT: "",
      };
    }
    catch (error) {
      return {
        EM: error.message,
        EC: 1,
        DT: "",
      };
    }
  };
}

module.exports = new EmployerService();
