import { tempDir } from "./tempDir";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { getUrlEncodedFileName } from "./getUrlEncodedFileName";

// args

// {
//     uploadUrl,
//     authToken,
//     mime,
//     fileName,
//     data,
//   }: uploadToBackBlazeProps

const sha1 = (fileData: Buffer) => {
  const hash = crypto.createHash("sha1");
  hash.update(fileData);
  return hash.digest("hex");
};

export const uploadToBackBlaze = async ({
  uploadUrl,
  authToken,
  mime,
  targetDir,
}: uploadToBackBlazeProps) => {
  // declare dir

  const { dir } = tempDir({ folder: targetDir });

  // get the files from the dir

  const filesArray = fs.readdirSync(dir);
};

const uploadFunction = (options: UploadOptions) => {
  const uploadAuthToken = options.authToken;
  const data = options.data;
  const mime = options.mime;
  const length = options.contentLength || data.byteLength || data.length;
  const uploadUrl = options.url;
  const fileName = getUrlEncodedFileName(options.fileName);

  // define headers

  const headers = {
    Authorization: uploadAuthToken,
    "Content-Type": mime || "b2/x-auto",
    "Content-Length": length,
    "X-Bz-File-Name": fileName,
    "X-Bz-Content-Sha1": data ? sha1(data) : null,
  };
};
