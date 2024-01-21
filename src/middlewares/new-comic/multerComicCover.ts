import multer from "multer";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { NextFunction, Request, Response } from "express";
import path from "path";

export const UploadComicCover = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const __dirname = path.resolve(); // getting the path

  // create a temporary directory to store the zip file for further prossesing
  let dir = path.join(__dirname, "temp");

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); // if the 'temp' folder doesn't exists, create one

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
      cb(null, uuidv4() + "-" + filename);
    },
  });

  // storing the image file in temp directory

  const upload = multer({
    storage: storage,

    // check if the file type is image

    fileFilter: (req, file, cb) => {
      if (
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg" ||
        file.mimetype == "image/webp"
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(
          new Error("Only .png, .jpg, .jpeg and .webp formats are allowed!")
        );
      }
    },
  }).single("coverImage");

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