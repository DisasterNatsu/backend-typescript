import { PostChapter } from "controllers/chapter/postChapter";
import express from "express";
import { AdminAuthMiddleware } from "middlewares/authMiddleware/adminAuth";
import { UnZip } from "middlewares/new-chapter/handleZip";
import ZipUpload from "middlewares/new-chapter/multerZipUpload";

const router = express.Router();

router.post("/add-new", AdminAuthMiddleware, ZipUpload, UnZip, PostChapter);

export default router;
