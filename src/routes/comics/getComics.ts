import express from "express";
import {
  AllComics,
  GetFiveRandomComics,
  GetLatestEight,
  GetTopEight,
} from "../../controllers/comics/getComics";

const Router = express.Router();

Router.get("/top-eight", GetTopEight);
Router.get("/all", AllComics);
Router.get("/comic-with-chapter", GetLatestEight);
Router.get("/get-random-five", GetFiveRandomComics);

export default Router;
