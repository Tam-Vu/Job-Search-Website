import jobController from "../controllers/jobController";
import express from "express";

const router = express.Router();

const jobRoute = (app) => {
    router.post('/create-job', jobController.createJob);
    router.get('/get-all-legal-job', jobController.GetAllLegalJob);
    return app.use('/jobs', router);
}

module.exports = jobRoute;