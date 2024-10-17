import decompress from "decompress";
import { NextFunction, Request, Response } from "express";
import path from "path";
import fs from "fs";
import { tempDir } from "../../helpers/tempDir";

export const UnZip = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { dir } = tempDir({ folder: "chapterTemp" });
  const dir2 = tempDir({ folder: "temp" });

  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (req.file) {
      const originPath = path.join(dir2.dir, req.file.filename);
      console.log(originPath);

      const dist = dir;

      await decompress(originPath, dist);
      if (fs.existsSync(dir2.dir)) {
        fs.rmdirSync(dir2.dir, { recursive: true });
      }
      next();
    } else {
      return res.status(400).json({ error: "File is missing" });
    }
  } catch (error) {
    console.error("Error during decompression:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};
