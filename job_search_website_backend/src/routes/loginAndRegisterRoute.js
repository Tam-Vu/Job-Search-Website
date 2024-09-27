import express from "express";
import loginAndRegisterController from "../controllers/loginAndRegisterController";

const router = express.Router();

const loginAndRegisterRoute = (app) => {
    router.post('/register-user', loginAndRegisterController.registerUser);
    router.post('/register-employer', loginAndRegisterController.registerEmployer);
    router.post('/login', loginAndRegisterController.login);
    return app.use('', router);
}

module.exports = loginAndRegisterRoute;