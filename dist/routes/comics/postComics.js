"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminAuth_1 = require("middlewares/authMiddleware/adminAuth");
const postComic_1 = require("../../controllers/comics/postComic");
const multerComicCover_1 = require("../../middlewares/new-comic/multerComicCover");
const coverUpload_1 = require("../../middlewares/backBlaze/coverUpload");
const router = express_1.default.Router();
router.post("/add-new", adminAuth_1.AdminAuthMiddleware, multerComicCover_1.UploadComicCover, coverUpload_1.CoverUploadToBackBlaze, postComic_1.postComic);
exports.default = router;
//# sourceMappingURL=postComics.js.map