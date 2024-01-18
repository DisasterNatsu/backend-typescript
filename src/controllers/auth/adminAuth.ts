import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const AdminSignUp = async (req: Request, res: Response) => {
  // get the necessary data from request's body

  const { email, userName, password, confirmPassword } = req.body;

  // if necessary date was not provided

  if (!email || !userName || !password || !confirmPassword) {
    return res.status(400).json({
      message: "Admin Accounts can't be created without proper permissions",
    });
  } else if (password.length < 5) {
    // return if password is not more than 5 charaters

    return res.status(400).json({
      message: "Admin Accounts can't be created without proper permissions",
    });
  } else if (password !== confirmPassword) {
    // return if password doesn't match password check

    return res.status(400).json({
      message: "Admin Accounts can't be created without proper permissions",
    });
  }

  // try catch block

  try {
    const adminInDb = await prisma.admin.findMany();

    if (adminInDb.length === 0) {
      const salt = await bcrypt.genSalt(); // generating salt for bcrypt

      const passwordHash = await bcrypt.hash(password, salt); // hash the password

      const data = { Email: email, UserName: userName, Password: passwordHash }; // define the data

      const newAccount = await prisma.admin.create({ data }); // create the account with the data

      console.log(newAccount);

      return res.status(200).json({ message: "Account Created!" }); // send response
    }

    return res.status(403).json({
      message: "Admin Accounts can't be created without proper permission",
    });
  } catch (error) {
    return res.status(500).json(error);
  } finally {
    return async () => prisma.$disconnect();
  }
};

export const AdminLogIn = async (req: Request, res: Response) => {
  // get the email and password from

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email or Password is incorrect" });
  }

  return res.status(200).json({ message: "Great Success!" });
};
