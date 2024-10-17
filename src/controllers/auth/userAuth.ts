import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); // initiate a new prisma client

// User Register Function

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
        .json({ message: `An account with ${email} already exist` }); // return error if user already exists
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

// User Log In fuunction

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

// Forget Password

export const ForgetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const userInDb = await prisma.users.findFirst({ where: { Email: email } });

    if (!userInDb) {
      return res.status(404).json({ message: "No user found!" });
    }

    let config = {
      service: "gmail",
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASS,
      },
    };

    const token = jwt.sign(
      { email: userInDb.Email, password: userInDb.Password },
      process.env.USER_JWT_PASSWORD!,
      {
        expiresIn: "1h",
      }
    );

    const transporter = nodemailer.createTransport(config);

    const mailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "Disaster Scans",
        link: `mailto:diasterscans.sp@gmail.com`,
      },
    });

    let response = {
      body: {
        name: userInDb.UserName || "User",
        intro: "Reset Password!",
        action: {
          instructions: "Click the link below to Reset your Password!",
          button: {
            color: "#22BC66", // Optional action button color
            text: "Confirm your account",
            link: `http://localhost:3000/recover/${token}`,
          },
        },
        outro: "The reset link is only valid for 1 hour!",
      },
    };

    const mail = mailGenerator.generate(response);

    let message = {
      from: process.env.GMAIL,
      to: email,
      subject: "Password Reset!",
      html: mail,
    };

    const sendMail = await transporter.sendMail(message);

    if (sendMail.rejected.length > 0) {
      return res.status(500).json({ message: "Server Error!" });
    }
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Server Error", error });
  }
};

// Reset Password

export const ResetPassword = async (req: Request, res: Response) => {
  const { token, password, confirmPassword } = req.body;

  if (!token || !password || !confirmPassword) {
    return res.status(400).json({ message: "Invalid Request!" });
  }

  try {
    const verified = jwt.verify(
      token,
      process.env.USER_JWT_PASSWORD!
    ) as ResetPasswordTokenRes;

    if (!verified.success === false) {
      return res.status(403).json({ message: "Token expired!" });
    }

    const userInDb = await prisma.users.findFirst({
      where: { Email: verified.email },
    });

    if (!userInDb) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (userInDb.Password !== verified.password) {
      return res.status(403).json({ message: "Invalid Token!" });
    }

    const salt = await bcrypt.genSalt(); // generating salt for bcrypt

    const passwordHash = await bcrypt.hash(password, salt); // hash the password

    console.log(passwordHash);

    // Update the user's password in the database using their ID
    await prisma.users.update({
      where: { id: userInDb.id }, // Use id which is unique in the Prisma schema
      data: { Password: passwordHash },
    });

    return res.status(200).json({ message: "Password reset successful!" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Server Error!" });
  }
};

// Contact us Page

export const ContactEmail = async (req: Request, res: Response) => {
  const [email, name, message] = req.body;

  if (!email || !name || !message) {
    return res.status(400).json({ message: "Invalid Request!" });
  }

  try {
    let config = {
      service: "gmail",
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASS,
      },
    };

    const transporter = nodemailer.createTransport(config);

    const mailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "Disaster Scans",
        link: `mailto:diasterscans.sp@gmail.com`,
      },
    });

    let response = {
      body: {
        name: `from ${name}`,
        intro: `Contact Us from ${email}`,
        outro: message,
      },
    };

    const mail = mailGenerator.generatePlaintext(response);

    let emailMessage = {
      from: email,
      to: "shilajitdutta44@gmail.com",
      subject: "Contact Us | Disaster Scans",
      html: mail,
    };

    const sendMail = await transporter.sendMail(emailMessage);

    if (sendMail.rejected.length > 0) {
      return res.status(500).json({ message: "Server Error!" });
    }
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Server Error", error });
  }
};
