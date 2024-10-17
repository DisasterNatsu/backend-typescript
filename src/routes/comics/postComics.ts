import express from "express";
import { AdminAuthMiddleware } from "../../middlewares/authMiddleware/adminAuth";
import { postComic } from "../../controllers/comics/postComic";
import { UploadComicCover } from "../../middlewares/new-comic/multerComicCover";
import { CoverUploadToBackBlaze } from "../../middlewares/backBlaze/coverUpload";

const router = express.Router();

router.post(
  "/add-new",
  AdminAuthMiddleware,
  UploadComicCover,
  CoverUploadToBackBlaze,
  postComic
);

export default router;
