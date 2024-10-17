import express from "express";
import {
  ContactEmail,
  ForgetPassword,
  Register,
  ResetPassword,
  SignIn,
} from "../../controllers/auth/userAuth";
import { userTokenAuth } from "../../controllers/auth/userTokenAuth";

const Router = express.Router();

Router.post("/register", Register);
Router.post("/sign-in", SignIn);
Router.post("/forget-password", ForgetPassword);
Router.post("/reset-password", ResetPassword);
Router.post("/contact-us", ContactEmail);
Router.get("/token", userTokenAuth);

export default Router;
