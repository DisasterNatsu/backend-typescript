import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// get the top eight

export const GetTopEight = async (req: Request, res: Response) => {
  // try catch block

  try {
    // get the comics from database

    const comics = await prisma.comics.findMany({
      orderBy: { Date: "desc" },
      take: 8,
    });

    res.status(200).json(comics); // respod with the comics
  } catch (error) {
    // respond if error

    return res.status(500).json({
      error,
      message: "Something went wrong while finding the comics in database",
    });
  } finally {
    return async () => prisma.$disconnect();
  }
};

// get all comics

export const AllComics = async (req: Request, res: Response) => {
  // try catch block
  try {
    // get the comics from database

    const comics = await prisma.comics.findMany({
      orderBy: { Date: "desc" },
    });

    res.status(200).json(comics); // respod with the comics
  } catch (error) {
    // respond if error

    return res.status(500).json({
      error,
      message: "Something went wrong while finding the comics in database",
    });
  } finally {
    return async () => prisma.$disconnect();
  }
};
