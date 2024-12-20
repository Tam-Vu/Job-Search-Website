
import skillController from "../controllers/skillController";
import express from "express";

const router = express.Router();

const skillRoute = (app) => {
  router.get("/get-all-skills", skillController.getAllSkills);

  return app.use("/skills", router);
};

module.exports = skillRoute;