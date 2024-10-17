"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const getComics_1 = __importDefault(require("./routes/comics/getComics"));
const postComics_1 = __importDefault(require("./routes/comics/postComics"));
const user_1 = __importDefault(require("./routes/auth/user"));
const admin_1 = __importDefault(require("./routes/auth/admin"));
const postChapter_1 = __importDefault(require("./routes/chapter/postChapter"));
const getChapters_1 = __importDefault(require("./routes/chapter/getChapters"));
const app = (0, express_1.default)(); // declare app
app.use("/public", express_1.default.static("./public")); // define static files dir
dotenv_1.default.config(); // .env config
app.use(body_parser_1.default.urlencoded({
    limit: "100mb",
    extended: true,
})); // urlEncoded and max size of body
app.use(express_1.default.json()); // .env config
app.use((0, cors_1.default)());
// comics
app.use("/get-comics", getComics_1.default);
// post requests
app.use("/post-comic", postComics_1.default);
// users
app.use("/user", user_1.default);
// admin
app.use("/admin", admin_1.default);
// chapters
app.use("/get-chapters", getChapters_1.default);
// post requests
app.use("/post-chapters", postChapter_1.default);
app.listen(process.env.PORT || 3000, () => {
    console.log(`Listning on port ${process.env.PORT || 3000}`);
});
//# sourceMappingURL=index.js.map