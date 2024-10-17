"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userTokenAuth = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient(); // initiate new prisma client
const userTokenAuth = async (req, res) => {
    // getting token from request's headers
    const token = req.header("disaster-scans-token");
    // if no token then return false
    if (!token) {
        return res.status(401).json({ verified: false });
    }
    try {
        // verify the jwt token
        const isVerified = jsonwebtoken_1.default.verify(token, process.env.USER_JWT_PASSWORD);
        // check for the user's details in db
        const userInDb = await prisma.users.findFirst({
            where: {
                Email: isVerified.email,
            },
        });
        // return require details if varified
        return res.status(200).json({
            verified: true,
            email: userInDb?.Email,
            userName: userInDb?.UserName,
        });
    }
    catch (error) {
        return res.status(500).json({ verified: false });
    }
    finally {
        return async () => await prisma.$disconnect();
    }
};
exports.userTokenAuth = userTokenAuth;
//# sourceMappingURL=userTokenAuth.js.map