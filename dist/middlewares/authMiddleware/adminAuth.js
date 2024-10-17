"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AdminAuthMiddleware = (req, res, next) => {
    const token = req.header("ds-admin-token"); // getting token from request's header
    // try catch block
    try {
        // if no token
        if (!token) {
            return res.status(401).json({ message: "Not authorised" });
        }
        else {
            const decodedToken = jsonwebtoken_1.default.verify(token, process.env.ADMIN_JWT_PASSWORD);
            // assign decoded email to req.admin
            req.admin = decodedToken.email;
            // call next to proceed to the next middleware or route handler
            next();
        }
    }
    catch (error) {
        return res.status(500).json({ error, message: "Something went wrong" }); // response with error
    }
};
exports.AdminAuthMiddleware = AdminAuthMiddleware;
//# sourceMappingURL=adminAuth.js.map