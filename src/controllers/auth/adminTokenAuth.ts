import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
  email: string;
}

const prisma = new PrismaClient(); // initiate new prisma client

export const adminTokenAuth = async (req: Request, res: Response) => {
  // getting token from request's headers

  const token = req.header("disaster-admin-token");

  // if no token then return false

  if (!token) {
    return res.status(401).json({ verified: false });
  }

  try {
    // verify the jwt token

    const isVerified = jwt.verify(
      token,
      process.env.ADMIN_JWT_PASSWORD!
    ) as DecodedToken;

    // check for the user's details in db

    const adminInDb = await prisma.admin.findUnique({
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
  } catch (error) {
    return res.status(500).json({ verified: false, error });
  } finally {
    return async () => await prisma.$disconnect();
  }
};
