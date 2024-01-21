import fs from "fs";
import B2 from "backblaze-b2";
import path from "path";
import mime from "mime-types";
import { promisify } from "util";
import { NextFunction, Request, Response } from "express";

const readdirAsync = promisify(fs.readdir);

export const CoverUploadToBackBlaze = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const __dirname = path.resolve(); // resolve the dir source

  const dir = path.join(__dirname, "temp"); // dir to the temp folder

  // declare b2

  const b2 = new B2({
    applicationKeyId: process.env.BACKBLAZE_MASTER_APPLICATION_KEY_ID!,
    applicationKey: process.env.BACKBLAZE_MASTER_APPLICATION_ID!,
  });

  try {
    await b2.authorize(); // authorizing the b2

    // define bucket id

    const bucketID = process.env.BACKBLAZE_BUCKET_ID!;

    // reading the files in the folder

    const files = await readdirAsync(dir);

    // maping through the files in the temp dir

    const uploadPromises = files.map(async (file) => {
      const fileData = fs.readFileSync(path.join(dir, file)); // the file
      const uploadFileName = path.join(file); // the filename
      const uploadUrl = await b2.getUploadPartUrl({ fileId: bucketID }); // getting the upload url

      // uploading the files

      const response = await b2.uploadFile({
        uploadUrl: uploadUrl.data.uploadUrl,
        uploadAuthToken: uploadUrl.data.authorizationToken,
        fileName: uploadFileName,
        data: fileData,
        mime: mime.lookup(file) || "application/octet-stream",
      });

      req.coverImage = response.data.fileId;
    });

    await Promise.all(uploadPromises);

    fs.rmdirSync(dir, { recursive: true });

    next();
  } catch (error) {
    return res.status(500).json({
      error,
      message: "Something wrong with the backblaze upload",
    });
  }
};
