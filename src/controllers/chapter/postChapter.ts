import { Request, Response } from "express";
import UniqueRandom from "helpers/idGenerator";
import { PrismaClient } from "@prisma/client";

// define a new prismaclient

const prisma = new PrismaClient();

export const PostChapter = async (req: Request, res: Response) => {
  // get necessary data from request's body

  let { comicTitle, chapterNumber, chapterName, comicID } = req.body;

  // array of image ids from middleware

  const imageIds = JSON.stringify(req.chapterImages);

  if (!comicTitle || !chapterNumber || !comicID) {
    return res
      .status(401)
      .json({ message: "Necessary Datas were not provided" });
  } else if (!chapterName) {
    chapterName === null;
  }

  // convert the number to number

  const number = Number(chapterNumber);

  // generate id

  const randomId = UniqueRandom(10000, 99999);

  const id = randomId();

  // try catch block

  try {
    // check if a chapter with the same chapter Number already exist

    const chapterInDb = await prisma.chapters.findFirst({
      where: {
        ChapterNumber: chapterNumber,
        comicID: comicID,
      },
    });

    // if user in db

    if (chapterInDb) {
      return res.status(400).json({
        message: `The chapter ${chapterNumber} for the same comic already exist`,
      });

      // delete the images uploaded to backblaze (Make a different function)
    }

    // data to upload update in database

    const data = {
      chapterID: id,
      ComicTitle: comicTitle,
      comicID: comicID,
      ChapterNumber: JSON.stringify(number),
      ChapterName: chapterName,
      pages: imageIds,
    };

    // write to database

    const newChapter = await prisma.chapters.create({ data });

    // if successful send response with the link of the new chapter

    return (
      newChapter.ChapterNumber &&
      res.status(201).json({
        message: `Chapter ${newChapter.ChapterNumber} was uploaded successfully!`,
        link: `https://disasterscans.com/comics/${
          newChapter.comicID
        }-${newChapter.ComicTitle?.toLocaleLowerCase().split(" ").join("-")}/${
          newChapter.chapterID
        }-chapter-${newChapter.ChapterNumber}`,
      })
    );
  } catch (error) {
    // return if error

    return res.status(500).json({
      error,
      message: "Something went wrong while connecting to database",
    });
  } finally {
    // disconnect from prisma

    return await prisma.$disconnect();
  }
};
