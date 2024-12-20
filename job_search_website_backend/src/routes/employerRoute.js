import EmployerController from "../controllers/employerController";
import {checkUserJwt, checkUserPermission} from "../middlewares/jwtService";
import express from "express";

const router = express.Router();

const employerRoute = (app) => {
  router.get("", EmployerController.getEmployers);
  router.get("/my-company", EmployerController.GetMyCompany) ;
  router.get("/:id", checkUserJwt, checkUserPermission, EmployerController.getEmployerById);
  return app.use("/employers", router);
};

module.exports = employerRoute;
