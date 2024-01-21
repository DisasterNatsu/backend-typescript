import { AllComics, GetTopEight } from "controllers/comics/getComics";
import express from "express";

const Router = express.Router();

Router.get("/top-eight", GetTopEight);
Router.get("/all", AllComics);

export default Router;
