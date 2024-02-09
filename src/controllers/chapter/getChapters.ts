import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { ParseParams, ParseParamsChapter } from "helpers/urlParser";

const prisma = new PrismaClient();

export const AllChapters = async (req: Request, res: Response) => {
  console.log("Here");

  // parsing the params to get the data needed

  const { id, title } = ParseParams(req.params.comicName);

  try {
    // get the chapters from database

    const chapters = await prisma.chapters.findMany({
      select: {
        chapterID: true,
        ChapterNumber: true,
        ChapterName: true,
        chapterDate: true,
      },
      where: {
        ComicTitle: title,
        comicID: JSON.stringify(id),
      },
      orderBy: {
        ChapterNumber: "desc",
      },
    });

    // get the comic details

    const ComicDetails = await prisma.comics.findFirst({
      select: {
        ComicTitle: true,
        CoverImage: true,
        id: true,
      },
      where: {
        ComicTitle: title,
        id: JSON.stringify(id),
      },
    });

    // if no chapters for that comic

    if (!chapters)
      return res
        .status(404)
        .json({ message: "No Chapters found", comicDetails: ComicDetails });

    // return the chapters

    res.status(200).json({ chapters: chapters, comicDetails: ComicDetails });
  } catch (error) {
    // respond if error

    return res.status(500).json({
      error,
      message: "Something went wrong while finding the chapters in database",
    });
  } finally {
    // Disconnect from the Prisma client
    await prisma.$disconnect();
  }
};

export const ChapterPages = async (req: Request, res: Response) => {
  // getting comicID and name

  const { id } = ParseParams(req.params.comicName);
  const { chapterID, chapterNumber } = ParseParamsChapter(req.params.chapter);

  try {
    const comicPages = await prisma.chapters.findUnique({
      select: {
        ChapterNumber: true,
        ChapterName: true,
        ComicTitle: true,
        pages: true,
      },
      where: {
        comicID: JSON.stringify(id),
        chapterID: chapterID,
        ChapterNumber: JSON.stringify(chapterNumber),
      },
    });
    return res.status(200).json(comicPages);
  } catch (error) {
    // respond if error

    return res.status(500).json({
      error,
      message: "Something went wrong while finding the chapters in database",
    });
  } finally {
    // Disconnect from the Prisma client
    await prisma.$disconnect();
  }
};
