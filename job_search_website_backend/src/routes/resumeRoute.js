import express from "express";
import resumeController from "../controllers/resumeController";
const router = express.Router();

const resumeRoute = (app) => {
  router.post("/create-resume", resumeController.createResume);
  router.get("/details/:resumeId", resumeController.detailsResume);
  router.put("/update/:resumeId", resumeController.updateResume);
  router.delete("/delete/:resumeId", resumeController.deleteResume);
  router.get("/all-my-resume", resumeController.getAllMyResume);
  return app.use("/resumes", router);
};

module.exports = resumeRoute;
