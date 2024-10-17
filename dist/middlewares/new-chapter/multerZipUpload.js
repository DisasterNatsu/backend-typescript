"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const tempDir_1 = require("helpers/tempDir");
const ZipUpload = (req, res, next) => {
    // create a temporary directory to store the zip file for further prossesing
    const { dir } = (0, tempDir_1.tempDir)({ folder: "temp" });
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
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
            cb(null, filename);
        },
    });
    // storing the zip file in temp directory
    const upload = (0, multer_1.default)({
        storage: storage,
        fileFilter: (req, file, cb) => {
            // check if the file type is zip
            if (file.mimetype == "application/zip" ||
                "application/octet-stream" ||
                "application/x-zip-compressed" ||
                "multipart/x-zip") {
                cb(null, true);
            }
            else {
                cb(null, false);
                return cb(new Error("Only .zip files are allowed"));
            }
        },
    }).single("pages");
    // calling the upload function
    upload(req, res, (err) => {
        if (err) {
            return res
                .status(500)
                .json({ error: err, message: "Something went wrong with multer" });
        }
        else {
            next();
        }
    });
};
exports.default = ZipUpload;
//# sourceMappingURL=multerZipUpload.js.map