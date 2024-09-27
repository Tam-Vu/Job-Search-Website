import cookieParser from "cookie-parser";
import cors from "cors";
import Connection from "./config/connectDB";
import express from "express";
import bodyParser from "body-parser";
import loginAndRegisterRoute from "./routes/loginAndRegisterRoute";
import resumeRoute from "./routes/resumeRoute";
import userRoute from "./routes/userRoute";
import jobRoute from "./routes/jobRoute";
import { checkUserJwt } from "./middlewares/jwtService";
import applicationRoute from "./routes/applicationRoute";
import interviewScheduleRoute from "./routes/interviewSheduleRoute"
require("dotenv").config();
const PORT = process.env.PORT || 8080;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173",
        methods: "GET,POST,PUT,PATCH,DELETE",
        credentials: true,
    })
);

app.all('*', checkUserJwt);
loginAndRegisterRoute(app);
resumeRoute(app);
userRoute(app);
jobRoute(app);
applicationRoute(app);
interviewScheduleRoute(app);
Connection();
app.use((req, res) => {
    return res.send("404 not found");
});
app.listen(PORT, () => {
    console.log("backend is running in port: " + PORT);
});
