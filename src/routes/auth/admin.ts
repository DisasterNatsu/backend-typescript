import { AdminLogIn, AdminSignUp } from "controllers/auth/adminAuth";
import express from "express";

const Router = express.Router();

Router.post("/register", AdminSignUp);
Router.post("/sign-in", AdminLogIn);

export default Router;
