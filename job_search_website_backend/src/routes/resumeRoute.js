import express from "express";
import resumeController from "../controllers/resumeController";
const router = express.Router();
import { checkUserJwt, checkUserPermission } from "../middlewares/jwtService";
const resumeRoute = (app) => {
  router.post("/create-resume",checkUserJwt, resumeController.createResume);
  router.get("/details/:resumeId", resumeController.detailsResume);
  router.put("/update/:resumeId",checkUserJwt, resumeController.updateResume);
  router.delete("/delete/:resumeId", resumeController.deleteResume);
  router.get("/all-my-resume",checkUserJwt, resumeController.getAllMyResume);
  return app.use("/resumes", router);
};

module.exports = resumeRoute;
