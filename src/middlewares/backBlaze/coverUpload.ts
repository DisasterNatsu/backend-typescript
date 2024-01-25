import fs from "fs";

import { promisify } from "util";
import { NextFunction, Request, Response } from "express";

import { backblazeAuthorize } from "helpers/backBlazeAuthorize";
import { tempDir } from "helpers/tempDir";
import { uploadToBackBlaze } from "helpers/uploadToBackblaze";
import { getUploadUrl } from "helpers/backBlazeGetUploadUrl";

const readdirAsync = promisify(fs.readdir);

export const CoverUploadToBackBlaze = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

    // // bucketid

    const bucketID = process.env.BACKBLAZE_BUCKET_ID!;

    const urlRes = await getUploadUrl({
      apiUrl: apiUrl,
      authorizationToken: authToken,
      bucketId: bucketID,
    });

    // // Use type assertion to inform TypeScript about the actual type

    const { uploadUrlToken, uploadUrl } = urlRes as UploadUrlResult;

    // declare mimetype

    const mime = "image/png" || "image/jpg" || "image/jpeg" || "image/webp";

    const fileId = await uploadToBackBlaze({
      authToken: uploadUrlToken,
      targetDir: "temp",
      mime: mime,
      uploadUrl: uploadUrl,
    });

    return res.status(200).json("Debugging");

    // await b2.authorize(); // authorizing the b2

    // // define bucket id

    // const bucketID = process.env.BACKBLAZE_BUCKET_ID!;

    // // reading the files in the folder

    // const files = await readdirAsync(dir);

    // // maping through the files in the temp dir

    // const uploadPromises = files.map(async (file) => {
    //   const fileData = fs.readFileSync(path.join(dir, file)); // the file
    //   const uploadFileName = path.join(file); // the filename
    //   const uploadUrl = await b2.getUploadPartUrl({ fileId: bucketID }); // getting the upload url

    //   // uploading the files

    //   const response = await b2.uploadFile({
    //     uploadUrl: uploadUrl.data.uploadUrl,
    //     uploadAuthToken: uploadUrl.data.authorizationToken,
    //     fileName: uploadFileName,
    //     data: fileData,
    //     mime: mime.lookup(file) || "application/octet-stream",
    //   });

    //   req.coverImage = response.data.fileId;
    // });

    // await Promise.all(uploadPromises);

    // fs.rmdirSync(dir, { recursive: true });

    // next();
  } catch (error) {
    // remove images

    // fs.rmdirSync(dir, { recursive: true });

    console.log(error);

    return res.status(500).json({
      error,
      message: "Something wrong with the backblaze upload",
    });
  }
};
