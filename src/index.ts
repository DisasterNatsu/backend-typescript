import express from "express";
import type { Express } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import getComic from "./routes/comics/getComics";
import postComic from "./routes/comics/postComics";
import UserAuth from "./routes/auth/user";
import AdminAuth from "./routes/auth/admin";
import PostChapterRoutes from "./routes/chapter/postChapter";
import GetChapters from "./routes/chapter/getChapters";

const app: Express = express(); // declare app

app.use("/public", express.static("./public")); // define static files dir

dotenv.config(); // .env config

app.use(
  bodyParser.urlencoded({
    limit: "100mb",
    extended: true,
  })
); // urlEncoded and max size of body

app.use(express.json()); // .env config

app.use(cors());

// comics
app.use("/get-comics", getComic);
// post requests
app.use("/post-comic", postComic);

// users
app.use("/user", UserAuth);

// admin
app.use("/admin", AdminAuth);

// chapters
app.use("/get-chapters", GetChapters);
// post requests
app.use("/post-chapters", PostChapterRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Listning on port ${process.env.PORT || 3000}`);
});
