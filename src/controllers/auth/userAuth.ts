import { Request, Response, response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); // initiate a new prisma client

export const Register = async (req: Request, res: Response) => {
  // Get data from reqest's body

  const { userName, email, password, confirmPassword } = req.body;

  // check if all the necessary data was provided

  if (!email || !userName || !password || !confirmPassword) {
    return res.status(400).json({ message: "Necessary data was not provided" });
  } else if (password.length < 5) {
    // return if password is not more than 5 charaters

    return res
      .status(400)
      .json({ message: "Password must be over 5 letters/characters" });
  } else if (password !== confirmPassword) {
    // return if password doesn't match password check

    return res
      .status(400)
      .json({ message: "Password doesn't match with Confirm Password" });
  }

  // try Catch block

  try {
    // check if an account with the same email already exists

    const userInDb = await prisma.users.findFirst({
      where: {
        Email: email,
      },
    });

    if (userInDb) {
      return res
        .status(400)
        .json({ message: `An account with that ${email} already exist` }); // return error if user already exists
    }

    const salt = await bcrypt.genSalt(); // generating salt for bcrypt

    const passwordHash = await bcrypt.hash(password, salt); // hash the password

    // new user data

    const data = { Email: email, UserName: userName, Password: passwordHash };

    // proceed to create new account with the email

    const newAccount = await prisma.users.create({ data });

    // return the successful account creation message

    return (
      newAccount.Email &&
      res
        .status(201)
        .json({ message: `A new account with the ${email} has been created!` })
    );
  } catch (error) {
    res.json({ error });
  } finally {
    return async () => await prisma.$disconnect(); // disconnect from client
  }
};

export const SignIn = async (req: Request, res: Response) => {
  // getting email and password from request's body

  const { email, password } = req.body;

  // return if not necessary data was provided

  if (!email || !password) {
    return res
      .status(401)
      .json({ message: "Email or Password was not provided" });
  }

  try {
    // check if an account with the provided email exists

    const userInDb = await prisma.users.findFirst({
      where: {
        Email: email,
      },
    });

    // response if no account with the provided detail

    if (!userInDb?.id) {
      return res
        .status(404)
        .json({ message: `No account with the email: ${email} was found` });
    }

    // check if hashed password matches the real password

    const isPasswordValid = await bcrypt.compare(password, userInDb.Password);

    // if password matches

    if (isPasswordValid) {
      // generate jwt token

      const token = jwt.sign(
        { email: userInDb.Email },
        process.env.USER_JWT_PASSWORD!,
        {
          expiresIn: "48h",
        }
      );

      // response with necessary data

      return res.status(200).json({
        authToken: token,
        email: userInDb.Email,
        UserName: userInDb.UserName,
      });
    }

    // default reply after all the checks

    return res.status(401).json({ message: "Email or Password is incorrect" });
  } catch (error) {
    return res.status(500).json({ error });
  } finally {
    return async () => await prisma.$disconnect();
  }
};
