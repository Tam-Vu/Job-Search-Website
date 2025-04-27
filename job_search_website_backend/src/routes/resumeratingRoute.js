import resumeratingController from "../controllers/resumeratingController";
import express from "express";
import { checkUserJwt } from "../middlewares/jwtService";
const router = express.Router();

const resumeratingRoute = (app) => {
  router.get("/:id", checkUserJwt, resumeratingController.getAllRatings);
  router.post("/:id", checkUserJwt, resumeratingController.createRating);
  return app.use("/resume-ratings", router);
};

module.exports = resumeratingRoute;
