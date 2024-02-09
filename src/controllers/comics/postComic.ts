import { Request, Response } from "express";
import UniqueRandom from "helpers/idGenerator";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

export const postComic = async (req: Request, res: Response) => {
  // get the data from request.body

  let { comicTitle, desc, origin, status, genres, author, artist, badge } =
    req.body;

  const coverImage = req.coverImage;

  console.log(coverImage);

  // if the data necessary is not provided

  if (!comicTitle || !desc || !origin || !status || !genres) {
    return res
      .status(400)
      .json({ message: "Necessary data was not provided!" });
  }

  // generate unique ID

  const randomId = UniqueRandom(10000, 99999);

  const id = randomId(); // call the Id generator function

  // try catch block

  try {
    const data = {
      id: id,
      ComicTitle: comicTitle,
      Description: desc,
      CoverImage: coverImage || "",
      Origin: origin,
      Status: status,
      Genre: genres,
      Author: author,
      Artist: artist,
      Badges: badge,
    };

    // @ts-ignore

    const postComictoDb = await prisma.comics.create({ data });

    // if successfull

    if (postComictoDb.ComicTitle) {
      // the link

      const link = `https://disasterscans.com/comics/${
        postComictoDb.id
      }-${postComictoDb.ComicTitle.toLowerCase().split(" ").join("-")}`;

      // the message

      const message = "Comic Uploaded Successfully";

      return res.status(201).json({ message, link });
    }
  } catch (error) {
    // delete the local image

    console.log(error);

    const __dirname = path.resolve(); // resolve the dir source

    const dir = path.join(__dirname, "temp"); // dir to the temp folder

    if (fs.existsSync(dir)) fs.rmdirSync(dir, { recursive: true });
    // return if error

    return res.status(500).json({
      error,
      message: "Something wrong happened while writing to database",
    });
  } finally {
    await prisma.$disconnect();
  }

  return res.status(200).json({ message: "Working", id });
};
