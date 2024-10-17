"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadComicCover = void 0;
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const tempDir_1 = require("helpers/tempDir");
const fs_1 = __importDefault(require("fs"));
const UploadComicCover = (req, res, next) => {
    // create a temporary directory to store the zip file for further prossesing
    const { dir } = (0, tempDir_1.tempDir)({ folder: "temp" });
    if (!fs_1.default.existsSync(dir))
        fs_1.default.mkdirSync(dir);
    // define storage
    const storage = multer_1.default.diskStorage({
        // define destination
        destination: (req, file, cb) => {
            cb(null, dir);
        },
        //  filename
        filename: async (req, file, cb) => {
            const filename = file.originalname
                .toLocaleLowerCase()
                .split(" ")
                .join("-");
            cb(null, (0, uuid_1.v4)() + "-" + filename);
        },
    });
    // storing the image file in temp directory
    const upload = (0, multer_1.default)({
        storage: storage,
        // check if the file type is image
        fileFilter: (req, file, cb) => {
            if (file.mimetype == "image/png" ||
                file.mimetype == "image/jpg" ||
                file.mimetype == "image/jpeg" ||
                file.mimetype == "image/webp") {
                cb(null, true);
            }
            else {
                cb(null, false);
                return cb(new Error("Only .png, .jpg, .jpeg and .webp formats are allowed!"));
            }
        },
    }).single("coverImage");
    // calling the upload function
    upload(req, res, (err) => {
        if (err) {
            console.log(err);
            return res
                .status(500)
                .json({ error: err, message: "Something went wrong with multer" });
        }
        else {
            next();
        }
    });
};
exports.UploadComicCover = UploadComicCover;
//# sourceMappingURL=multerComicCover.js.map