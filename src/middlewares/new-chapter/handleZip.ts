import decompress from "decompress";
import { NextFunction, Request, Response } from "express";
import fs from "fs";
import { tempDir } from "helpers/tempDir";
import path from "path";

export const UnZip = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { dir } = tempDir({ folder: "chapterTemp" });

  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (req.file) {
      const originPath = path.join(__dirname, "temp", req.file.filename);
      const dist = dir;

      await decompress(originPath, dist);
      next();
    } else {
      return res.status(400).json({ error: "File is missing" });
    }
  } catch (error) {
    console.error("Error during decompression:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};
