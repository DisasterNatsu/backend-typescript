interface User {
  username: string;
  // Add other user properties as needed
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

interface UploadUrlResult {
  uploadUrlToken: string;
  uploadUrl: string;
}

interface BackblazeAuthorizeResult {
  apiUrl: string;
  authToken: string;
}

interface Folder {
  folder: string;
}

interface uploadToBackBlazeProps {
  mime?: string;
  targetDir: string;
  bucketId: string;
  apiUrl: string;
  authorizationToken: string;
}

interface UploadOptions {
  authToken: string;
  url: string;
  mime: string;
  data: Buffer;
  contentLength?: number | undefined;
  fileName: string;
}

interface BackBlazeResponse {
  accountId: string;
  action: string;
  bucketId: string;
  contentLength: number;
  contentMd5: string;
  contentSha1: string;
  contentType: string;
  fileId: string;
  fileInfo: object;
  fileName: string;
  fileRetention: {
    isClientAuthorizedToRead: boolean;
    value: { mode: string | null; retainUntilTimestamp: string | null };
  };
  legalHold: { isClientAuthorizedToRead: boolean; value: null };
  serverSideEncryption: { algorithm: any | null; mode: any | null };
  uploadTimestamp: number;
}

interface Chapter {
  chapterID: BigInt | number; // Ensure this matches your actual data type
  ComicTitle: string | null;
  comicID: string;
  ChapterNumber: string;
  ChapterName: string | null;
  pages: string;
  chapterDate: Date | null;
}

interface RawChapter {
  chapterID: number;
  ComicTitle: string;
  comicID: string;
  ChapterNumber: string;
  ChapterName: string;
  chapterDate: Date; // Use Date if the field is of type DateTime
}

interface TransformedChapter {
  chapterID: number;
  ChapterNumber: string;
  ChapterName: string;
  chapterDate: string; // ISO Date String
}

interface TransformedComic {
  ComicTitle: string;
  comicID: string;
  CoverImage: string;
  chapters: TransformedChapter[];
}

interface Covers {
  id: string;
  CoverImage: string;
}

interface CoverAddedComic {
  ComicTitle: string;
  comicID: string;
  CoverImage: string;
  chapters: TransformedChapter[];
}

interface ResetPasswordTokenRes {
  email?: string;
  password?: string;
  iat?: number;
  exp?: number;
  success?: boolean;
  message?: string;
}

declare module "file-type" {
  export function fromFile(
    path: string
  ): Promise<{ ext: string; mime: string } | null>;
}
