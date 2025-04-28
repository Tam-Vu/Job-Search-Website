import employerratingController from "../controllers/employerratingController";
import express from "express";
import { checkUserJwt } from "../middlewares/jwtService";
const router = express.Router();

const employerratingRoute = (app) => {
  router.get("/:id", checkUserJwt, employerratingController.getAllRatings);
  router.post("/:id", checkUserJwt, employerratingController.createRating);
  return app.use("/employer-ratings", router);
};

module.exports = employerratingRoute;
