// express.d.ts

import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      admin?: string;
      chapterImages?: any[];
      coverImage?: string;
    }
  }
}
