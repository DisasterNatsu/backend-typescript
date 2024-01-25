import fs from "fs";
import path from "path";
import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

export const uploadToBackBlaze = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Defining backblaze masterkey and application key
};
