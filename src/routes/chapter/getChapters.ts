import express from "express";
import {
  AllChapters,
  ChapterPages,
} from "../../controllers/chapter/getChapters";

const Router = express.Router();

Router.get("/all/:comicName", AllChapters);
Router.get("/pages/:comicName/:chapter", ChapterPages);

export default Router;
