import multer from "multer";
import fs from "fs";

import { NextFunction, Request, Response } from "express";
import { tempDir } from "helpers/tempDir";

const ZipUpload = (req: Request, res: Response, next: NextFunction) => {
  // create a temporary directory to store the zip file for further prossesing

  const { dir } = tempDir({ folder: "temp" });

  // define storage

  const storage = multer.diskStorage({
    // define destination

    destination: (req, file, cb) => {
      cb(null, dir);
    },

    //  filename

    filename: async (req, file, cb) => {
      const filename = file.originalname
        .toLocaleLowerCase()
        .split(" ")
        .join("-");
      cb(null, filename);
    },
  });

  // storing the zip file in temp directory

  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      // check if the file type is zip

      if (
        file.mimetype == "application/zip" ||
        "application/octet-stream" ||
        "application/x-zip-compressed" ||
        "multipart/x-zip"
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error("Only .zip files are allowed"));
      }
    },
  }).single("pages");

  // calling the upload function

  upload(req, res, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: err, message: "Something went wrong with multer" });
    } else {
      next();
    }
  });
};

export default ZipUpload;
