import express from "express";
import type { Express } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import postComic from "./routes/comics/postComics";
import UserAuth from "./routes/auth/user";
import AdminAuth from "./routes/auth/admin";

const app: Express = express(); // declare app

app.use(express.json()); //

app.use(
  bodyParser.urlencoded({
    limit: "100mb",
    extended: true,
  })
); // urlEncoded and max size of body

dotenv.config(); // .env config

app.use(cors({ credentials: true }));

app.use("/public", express.static("./public")); // define static files dir

// post requests

// comics
app.use("/post", postComic);

// users
app.use("/user", UserAuth);

// admin
app.use("/admin", AdminAuth);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Listning on port ${process.env.PORT || 3000}`);
});
