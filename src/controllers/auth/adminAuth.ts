import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

  try {
    // validate the email and password
    const adminInDb = await prisma.admin.findFirst({
      where: {
        Email: email,
      },
    });

    // if admin

    if (adminInDb?.Email) {
      // check if password is vaid

      const isPasswordValid = await bcrypt.compare(
        password,
        adminInDb.Password
      );

      // if password is valid

      if (isPasswordValid) {
        // assign a token

        const token = jwt.sign(
          { email: adminInDb.Email },
          process.env.ADMIN_JWT_PASSWORD!,
          {
            expiresIn: "48h",
          }
        );

        // return token with email and user name

        return res.status(200).json({
          authToken: token,
          email: adminInDb.Email,
          UserName: adminInDb.UserName,
        });
      }
    }

    // default return

    return res.status(403).json({ message: "Unauthorised" });
  } catch (error) {
    return res.status(500).json({ error, message: "Some error occured!" });
  } finally {
    return async () => prisma.$disconnect();
  }
};

export const ResetPassword = async (req: Request, res: Response) => {
  const { email, password, newPassword } = req.body;

  if (!email || !password || !newPassword) {
    return res
      .status(400)
      .json({
        message: "Email, current password, and new password are required",
      });
  } else if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be more than 6 characters long" });
  }

  try {
    // Find the admin by email
    const adminInDb = await prisma.admin.findFirst({
      where: {
        Email: email,
      },
    });

    if (adminInDb) {
      const isPasswordValid = await bcrypt.compare(
        password,
        adminInDb.Password
      );

      if (isPasswordValid) {
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(newPassword, salt);

        // Use the id to update the password
        await prisma.admin.update({
          where: {
            id: adminInDb.id,
          },
          data: {
            Password: passwordHash,
          },
        });

        return res
          .status(200)
          .json({ message: "Password updated successfully!" });
      } else {
        return res
          .status(403)
          .json({ message: "Current password is incorrect" });
      }
    } else {
      return res
        .status(403)
        .json({ message: "No admin with the provided email was found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({
        error,
        message: "An error occurred while resetting the password",
      });
  } finally {
    await prisma.$disconnect();
  }
};
