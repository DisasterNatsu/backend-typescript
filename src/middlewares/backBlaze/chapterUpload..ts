import fs from "fs";
import path from "path";
import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { tempDir } from "helpers/tempDir";
import { backblazeAuthorize } from "helpers/backBlazeAuthorize";
import { uploadToBackBlaze } from "helpers/uploadToBackblaze";

export const chapterUploadToBackBlaze = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // define the dir

  const { dir } = tempDir({ folder: "chapterTemp" });

  // try catch block

  try {
    // getting header token

    const applicationKey = process.env.BACKBLAZE_MASTER_APPLICATION_KEY_ID!;

    const applicationID = process.env.BACKBLAZE_MASTER_APPLICATION_ID!;

    // authorize backblaze and get the api url and authtoken

    const result = await backblazeAuthorize({
      applicationKey: applicationKey,
      applicationID: applicationID,
    });

    // // Use type assertion to inform TypeScript about the actual type
    const { apiUrl, authToken } = result as BackblazeAuthorizeResult;

    // bucketid

    const bucketID = process.env.BACKBLAZE_BUCKET_ID!;

    // declare mimetype

    const mime = "image/png" || "image/jpg" || "image/jpeg" || "image/webp";

    const fileId = await uploadToBackBlaze({
      targetDir: "chapterTemp",
      mime: mime,
      bucketId: bucketID,
      apiUrl: apiUrl,
      authorizationToken: authToken,
    });

    req.chapterImages = fileId;

    fs.rmSync(dir, { recursive: true });

    next();
  } catch (error) {
    fs.rmdirSync(dir, { recursive: true });

    console.log(error);

    return res.status(500).json({
      error,
      message: "Something wrong with the backblaze upload",
    });
  }
};
