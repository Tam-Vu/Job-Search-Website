import EmployerController from "../controllers/employerController";
import {checkUserJwt, checkUserPermission} from "../middlewares/jwtService";
import express from "express";

const router = express.Router();
import multer from "multer";
const upload = multer();
const employerRoute = (app) => {
  router.get("", EmployerController.getEmployers);
  router.put("/update-my-company", checkUserJwt, upload.single("file"), EmployerController.updateEmployer);
  router.get("/my-company", checkUserJwt, EmployerController.GetMyCompany) ;
  router.get("/:id", EmployerController.getEmployerById);
  return app.use("/employers", router);
};

module.exports = employerRoute;
