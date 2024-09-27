import applicationController from "../controllers/applicationController";
import express from "express";

const router = express.Router();

const applicationRoute = (app) => {
    router.post('/apply', applicationController.createApplication);

    return app.use('/application', router);
}

module.exports = applicationRoute;