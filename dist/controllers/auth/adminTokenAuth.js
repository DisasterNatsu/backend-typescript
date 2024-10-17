"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminTokenAuth = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient(); // initiate new prisma client
const adminTokenAuth = async (req, res) => {
    // getting token from request's headers
    const token = req.header("disaster-admin-token");
    // if no token then return false
    if (!token) {
        return res.status(401).json({ verified: false });
    }
    try {
        // verify the jwt token
        const isVerified = jsonwebtoken_1.default.verify(token, process.env.ADMIN_JWT_PASSWORD);
        // check for the user's details in db
        const adminInDb = await prisma.admin.findFirst({
            where: {
                Email: isVerified.email,
            },
        });
        // return require details if admin in db
        if (adminInDb) {
            return res.status(200).json({
                verified: true,
                email: adminInDb.Email,
                userName: adminInDb.UserName,
            });
        }
        // default return
        return res.status(403).json({ verified: false });
    }
    catch (error) {
        return res.status(500).json({ verified: false, error });
    }
    finally {
        return async () => await prisma.$disconnect();
    }
};
exports.adminTokenAuth = adminTokenAuth;
//# sourceMappingURL=adminTokenAuth.js.map