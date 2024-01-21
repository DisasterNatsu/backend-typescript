import fs from "fs";
import B2 from "backblaze-b2";
import path from "path";

export const CoverUploadToBackBlaze = async (images: string) => {
  const __dirname = path.resolve(); // getting the path

  // create a temporary directory to store the zip file for further prossesing
  let dir = path.join(__dirname, "temp");

  // initialize b2

  const b2 = new B2({
    applicationKeyId: process.env.BACKBLAZE_MASTER_APPLICATION_KEY_ID!,
    applicationKey: process.env.BACKBLAZE_MASTER_APPLICATION_ID!,
  });

  // parse the stingified array of imageIds

  const fileIds = JSON.parse(images);

  try {
  } catch (error) {
    return new Error("Something happened while deleting");
  }
};
