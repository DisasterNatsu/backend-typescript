import { tempDir } from "./tempDir";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { getUrlEncodedFileName } from "./getUrlEncodedFileName";
import axios from "axios";
import { getUploadUrl } from "./backBlazeGetUploadUrl";

const sha1 = (fileData: Buffer) => {
  const hash = crypto.createHash("sha1");
  // @ts-ignore
  hash.update(fileData); // Directly use the Buffer
  return hash.digest("hex");
};

export const uploadToBackBlaze = async ({
  mime,
  targetDir,
  bucketId,
  apiUrl,
  authorizationToken,
}: uploadToBackBlazeProps) => {
  // Declare directory
  const { dir } = tempDir({ folder: targetDir });

  // Get the files from the directory
  const filesArray = fs.readdirSync(dir);

  const uploadPromises = filesArray.map(async (file) => {
    const filePath = path.join(dir, file);

    try {
      // Get upload URL for every file
      const urlRes = await getUploadUrl({
        apiUrl,
        authorizationToken,
        bucketId,
      });

      const { uploadUrlToken, uploadUrl } = urlRes as UploadUrlResult;

      // Read file data
      const data = fs.readFileSync(filePath);
      const urlEncodedFileName = getUrlEncodedFileName(file);

      // Prepare headers
      const headers = {
        Authorization: uploadUrlToken,
        "Content-Type": mime || "b2/x-auto",
        "Content-Length": data.length,
        "X-Bz-File-Name": urlEncodedFileName,
        "X-Bz-Content-Sha1": sha1(data),
      };

      // Upload file
      const backBlazeRes = await axios.post(uploadUrl, data, { headers });
      return backBlazeRes.data.fileId; // Return file ID on successful upload
    } catch (error) {
      console.error(`Error uploading file ${file}:`, error);
      throw error; // Rethrow the error for better error handling up the stack
    }
  });

  // Wait for all uploads to complete
  try {
    const ids = await Promise.all(uploadPromises);
    return ids;
  } catch (error) {
    console.error("Error uploading files:", error);
    throw new Error("Upload failed for one or more files.");
  }
};
