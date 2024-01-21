import fs from "fs";
import path from "path";
import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import B2 from "backblaze-b2";

export const uploadToBackBlaze = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Defining backblaze masterkey and application key

  const b2 = new B2({
    applicationKeyId: process.env.BACKBLAZE_MASTER_APPLICATION_KEY_ID!,
    applicationKey: process.env.BACKBLAZE_MASTER_APPLICATION_ID!,
  });

  const __dirname = path.resolve(); // Defining directory
  let tempDir = path.join(__dirname, "chapterTemp"); // the temp directory

  try {
    // authorize b2

    await b2.authorize();

    const bucketId = process.env.BACKBLAZE_BUCKET_ID!;
    const files = fs.readdirSync(tempDir);

    const uid = uuidv4();

    const uploadPromises = files.map(async (file) => {
      const fileData = fs.readFileSync(path.join(tempDir, file));
      const uploadFileName = path.join(uid, file);

      // Use an object with 'bucketId' property
      const uploadUrl = await b2.getUploadUrl({ bucketId });

      const response = await b2.uploadFile({
        uploadUrl: uploadUrl.data.uploadUrl,
        uploadAuthToken: uploadUrl.data.authorizationToken,
        fileName: uploadFileName,
        data: fileData,
        mime: "image/png" || "image/jpg" || "image/jpeg" || "image/webp",
      });

      return response.data.fileId;
    });

    req.chapterImages = await Promise.all(uploadPromises);

    // removing the files from local server

    fs.rmdirSync(tempDir, { recursive: true });

    // calling next

    next();
  } catch (error) {
    fs.rmdirSync(tempDir, { recursive: true }); // Removing Files From Temp Dir

    // respond with error

    return res
      .status(500)
      .json({ message: "Error uploading to backblaze", error });
  }
};
