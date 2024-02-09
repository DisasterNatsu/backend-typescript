import { tempDir } from "./tempDir";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { getUrlEncodedFileName } from "./getUrlEncodedFileName";
import axios from "axios";
import { getUploadUrl } from "./backBlazeGetUploadUrl";

const sha1 = (fileData: Buffer) => {
  const hash = crypto.createHash("sha1");
  hash.update(fileData);
  return hash.digest("hex");
};

export const uploadToBackBlaze = async ({
  mime,
  targetDir,
  bucketId,
  apiUrl,
  authorizationToken,
}: uploadToBackBlazeProps) => {
  // declare dir

  const { dir } = tempDir({ folder: targetDir });

  const fileType = mime;

  // get the files from the dir

  const filesArray = fs.readdirSync(dir);

  const uploadPromises = filesArray.map(async (file) => {
    // get upload url for every file

    const urlRes = await getUploadUrl({
      apiUrl: apiUrl,
      authorizationToken: authorizationToken,
      bucketId: bucketId,
    });

    const { uploadUrlToken, uploadUrl } = urlRes as UploadUrlResult;

    // get fileData

    const data = fs.readFileSync(path.join(dir, file)); // filedata
    const uploadFileName = path.join(file); // file name
    const url = uploadUrl; // upload Url
    const token = uploadUrlToken;
    const urlEncodedFileName = getUrlEncodedFileName(uploadFileName);

    const headers = {
      Authorization: token,
      "Content-Type": mime || "b2/x-auto",
      "Content-Length": data.byteLength || data.length,
      "X-Bz-File-Name": urlEncodedFileName,
      "X-Bz-Content-Sha1": data ? sha1(data) : null,
    };

    try {
      const backBlazeRes = await axios.post(uploadUrl, data, { headers });
      return backBlazeRes.data.fileId;
    } catch (error) {
      return console.log(error);
    }
  });

  const ids = await Promise.all(uploadPromises);

  return ids;
};
