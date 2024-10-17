"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnZip = void 0;
const decompress_1 = __importDefault(require("decompress"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const tempDir_1 = require("../../helpers/tempDir");
const UnZip = async (req, res, next) => {
    const { dir } = (0, tempDir_1.tempDir)({ folder: "chapterTemp" });
    const dir2 = (0, tempDir_1.tempDir)({ folder: "temp" });
    try {
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir, { recursive: true });
        }
        if (req.file) {
            const originPath = path_1.default.join(dir2.dir, req.file.filename);
            console.log(originPath);
            const dist = dir;
            await (0, decompress_1.default)(originPath, dist);
            if (fs_1.default.existsSync(dir2.dir)) {
                fs_1.default.rmdirSync(dir2.dir, { recursive: true });
            }
            next();
        }
        else {
            return res.status(400).json({ error: "File is missing" });
        }
    }
    catch (error) {
        console.error("Error during decompression:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};
exports.UnZip = UnZip;
//# sourceMappingURL=handleZip.js.map