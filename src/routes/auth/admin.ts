import {
  AdminLogIn,
  AdminSignUp,
  ResetPassword,
} from "../../controllers/auth/adminAuth";
import { adminTokenAuth } from "../../controllers/auth/adminTokenAuth";
import express from "express";

const Router = express.Router();

Router.post("/register", AdminSignUp);
Router.post("/sign-in", AdminLogIn);
Router.post("reset-password", ResetPassword);
Router.get("/token", adminTokenAuth);

export default Router;
