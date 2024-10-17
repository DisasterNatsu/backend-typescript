"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postComic = void 0;
const idGenerator_1 = __importDefault(require("../../helpers/idGenerator"));
const client_1 = require("@prisma/client");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const prisma = new client_1.PrismaClient();
const postComic = async (req, res) => {
    // get the data from request.body
    let { comicTitle, desc, origin, status, genres, author, artist, badge } = req.body;
    const coverImage = req.coverImage;
    console.log(coverImage);
    // if the data necessary is not provided
    if (!comicTitle || !desc || !origin || !status || !genres) {
        return res
            .status(400)
            .json({ message: "Necessary data was not provided!" });
    }
    // generate unique ID
    const randomId = (0, idGenerator_1.default)(10000, 99999);
    const id = randomId().toString(); // call the Id generator function
    // try catch block
    try {
        const data = {
            id: id,
            ComicTitle: comicTitle,
            Description: desc,
            CoverImage: coverImage || "",
            Origin: origin,
            Status: status,
            Genres: genres,
            Author: author,
            Artist: artist,
            Badges: badge,
        };
        // @ts-ignore
        const postComictoDb = await prisma.comics.create({ data });
        // if successfull
        if (postComictoDb.ComicTitle) {
            // the link
            const link = `/comics/${postComictoDb.id}-${postComictoDb.ComicTitle.toLowerCase().split(" ").join("-")}`;
            // the message
            const message = "Comic Uploaded Successfully";
            return res.status(201).json({ message, link });
        }
    }
    catch (error) {
        // delete the local image
        console.log(error);
        const __dirname = path_1.default.resolve(); // resolve the dir source
        const dir = path_1.default.join(__dirname, "temp"); // dir to the temp folder
        if (fs_1.default.existsSync(dir))
            fs_1.default.rmdirSync(dir, { recursive: true });
        // return if error
        return res.status(500).json({
            error,
            message: "Something wrong happened while writing to database",
        });
    }
    finally {
        await prisma.$disconnect();
    }
    return res.status(200).json({ message: "Working", id });
};
exports.postComic = postComic;
//# sourceMappingURL=postComic.js.map