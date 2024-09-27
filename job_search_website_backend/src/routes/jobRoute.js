import jobController from "../controllers/jobController";
import express from "express";

const router = express.Router();

const jobRoute = (app) => {
    router.post('/create-job', jobController.createJob);

    return app.use('/job', router);
}

module.exports = jobRoute;