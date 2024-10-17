"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postChapter_1 = require("../../controllers/chapter/postChapter");
const adminAuth_1 = require("../../middlewares/authMiddleware/adminAuth");
const chapterUpload_1 = require("../../middlewares/backBlaze/chapterUpload.");
const handleZip_1 = require("../../middlewares/new-chapter/handleZip");
const multerZipUpload_1 = __importDefault(require("../../middlewares/new-chapter/multerZipUpload"));
const router = express_1.default.Router();
router.post("/add-new", adminAuth_1.AdminAuthMiddleware, multerZipUpload_1.default, handleZip_1.UnZip, chapterUpload_1.chapterUploadToBackBlaze, postChapter_1.PostChapter);
exports.default = router;
//# sourceMappingURL=postChapter.js.map