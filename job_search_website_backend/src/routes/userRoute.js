import userController from "../controllers/userController";
import express from "express";
const router = express.Router();

const userRoute = (app) => {
    router.delete('/delete-user/:userId', userController.deleteUser);
    return app.use('/user', router);
}

module.exports = userRoute;