import { Request, Response } from "express";
import UniqueRandom from "helpers/idGenerator";

export const postComic = async (req: Request, res: Response) => {
  let {
    comicTitle,
    description,
    origin,
    status,
    genres,
    author,
    artist,
    badge,
    coverImage,
  } = req.body;

  if (!comicTitle || !description || !origin || !status || !genres) {
    return res
      .status(401)
      .json({ message: "Necessary data was not provided!" });
  }

  const randomId = UniqueRandom(10000, 99999);

  const id = randomId();

  return res.status(200).json({ message: "Working" });
};
