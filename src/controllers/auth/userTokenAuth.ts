import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
  email: string;
}

const prisma = new PrismaClient(); // initiate new prisma client

export const userTokenAuth = async (req: Request, res: Response) => {
  // getting token from request's headers

  const token = req.header("disaster-scans-token");

  // if no token then return false

  if (!token) {
    return res.status(401).json({ verified: false });
  }

  try {
    // verify the jwt token

    const isVerified = jwt.verify(
      token,
      process.env.USER_JWT_PASSWORD!
    ) as DecodedToken;

    // check for the user's details in db

    const userInDb = await prisma.users.findUnique({
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
  } catch (error) {
    return res.status(500).json({ verified: false });
  } finally {
    return async () => await prisma.$disconnect();
  }
};
