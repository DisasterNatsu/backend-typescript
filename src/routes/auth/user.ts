import { Register, SignIn } from "controllers/auth/userAuth";
import { userTokenAuth } from "controllers/auth/userTokenAuth";
import express from "express";

const Router = express.Router();

Router.post("/register", Register);
Router.post("/sign-in", SignIn);
Router.get("/token", userTokenAuth);

export default Router;
