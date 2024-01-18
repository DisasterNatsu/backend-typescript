import { postComic } from "../../controllers/comics/postComic";
import express from "express";

const router = express.Router();

router.post("/new", postComic);

export default router;
