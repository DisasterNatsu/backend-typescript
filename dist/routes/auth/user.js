"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userAuth_1 = require("../../controllers/auth/userAuth");
const userTokenAuth_1 = require("../../controllers/auth/userTokenAuth");
const Router = express_1.default.Router();
Router.post("/register", userAuth_1.Register);
Router.post("/sign-in", userAuth_1.SignIn);
Router.post("/forget-password", userAuth_1.ForgetPassword);
Router.post("/reset-password", userAuth_1.ResetPassword);
Router.post("/contact-us", userAuth_1.ContactEmail);
Router.get("/token", userTokenAuth_1.userTokenAuth);
exports.default = Router;
//# sourceMappingURL=user.js.map