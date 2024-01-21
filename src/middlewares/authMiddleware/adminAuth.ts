import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const AdminAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("ds-admin-token"); // getting token from request's header

  // try catch block

  try {
    // if no token

    if (!token) {
      return res.status(401).json({ message: "Not authorised" });
    } else {
      const decodedToken = jwt.verify(
        token,
        process.env.ADMIN_JWT_PASSWORD!
      ) as { email: string };

      // assign decoded email to req.admin
      req.admin = decodedToken.email;

      // call next to proceed to the next middleware or route handler
      next();
    }
  } catch (error) {
    return res.status(500).json({ error, message: "Something went wrong" }); // response with error
  }
};
