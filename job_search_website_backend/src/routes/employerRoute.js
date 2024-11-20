import EmployerController from "../controllers/employerController";
import express from "express";

const router = express.Router();

const employerRoute = (app) => {
  router.get("", EmployerController.getEmployers);
  router.get("/my-company", EmployerController.GetMyCompany);
  router.get("/:id", EmployerController.getEmployerById);
  return app.use("/employers", router);
};

module.exports = employerRoute;
