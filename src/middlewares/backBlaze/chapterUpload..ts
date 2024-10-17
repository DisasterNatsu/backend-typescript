import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { NextFunction, Request, Response } from "express";
import { tempDir } from "../../helpers/tempDir";
import { backblazeAuthorize } from "../../helpers/backBlazeAuthorize";
import { uploadToBackBlaze } from "../../helpers/uploadToBackblaze";

export const chapterUploadToBackBlaze = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Define the directory
  const { dir } = tempDir({ folder: "chapterTemp" });

  // Try-catch block to handle errors
  try {
    // Check if the file exists in the request
    // Read files from the directory
    const files = fs.readdirSync(dir);

    if (files.length === 0) {
      return res
        .status(400)
        .json({ message: "No files found in the directory" });
    }

    // Get the Backblaze credentials from environment variables
    const applicationKey = process.env.BACKBLAZE_MASTER_APPLICATION_KEY_ID!;
    const applicationID = process.env.BACKBLAZE_MASTER_APPLICATION_ID!;
    const bucketID = process.env.BACKBLAZE_BUCKET_ID!;

    // Authorize Backblaze and get the API URL and auth token
    const result = await backblazeAuthorize({
      applicationKey: applicationKey,
      applicationID: applicationID,
    });

    // Use type assertion to inform TypeScript about the actual type
    const { apiUrl, authToken } = result as BackblazeAuthorizeResult;

    // Define allowed MIME types
    const mimeTypes = ["image/png", "image/jpg", "image/jpeg", "image/webp"];

    const fileId = await uploadToBackBlaze({
      targetDir: "chapterTemp",
      bucketId: bucketID,
      apiUrl,
      authorizationToken: authToken,
    });

    req.chapterImages = fileId;

    // Clean up temp directory asynchronously
    await fs.rmSync(dir, { recursive: true, force: true });
    next();
  } catch (error) {
    // In case of an error, remove the temporary directory
    fs.rmSync(dir, { recursive: true });

    console.error(error);

    return res.status(500).json({
      error,
      message: "Something went wrong with the Backblaze upload",
    });
  }
};
