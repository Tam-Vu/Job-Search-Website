import express from "express";
import resumeController from "../controllers/resumeController";
const router = express.Router();

const resumeRoute = (app) => {
    router.post('/create-resume', resumeController.createResume);
    router.get("/details/:resumeId", resumeController.detailsResume);
    // router.post('/login', loginAndRegisterController.login);
    return app.use('/resume', router);
}

module.exports = resumeRoute;