"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminAuth_1 = require("../../controllers/auth/adminAuth");
const adminTokenAuth_1 = require("../../controllers/auth/adminTokenAuth");
const Router = express_1.default.Router();
Router.post("/register", adminAuth_1.AdminSignUp);
Router.post("/sign-in", adminAuth_1.AdminLogIn);
Router.post("reset-password", adminAuth_1.ResetPassword);
Router.get("/token", adminTokenAuth_1.adminTokenAuth);
exports.default = Router;
//# sourceMappingURL=admin.js.map