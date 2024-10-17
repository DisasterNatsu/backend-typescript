"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chapterUploadToBackBlaze = void 0;
const fs_1 = __importDefault(require("fs"));
const tempDir_1 = require("../../helpers/tempDir");
const backBlazeAuthorize_1 = require("../../helpers/backBlazeAuthorize");
const uploadToBackblaze_1 = require("../../helpers/uploadToBackblaze");
const chapterUploadToBackBlaze = async (req, res, next) => {
    // Define the directory
    const { dir } = (0, tempDir_1.tempDir)({ folder: "chapterTemp" });
    // Try-catch block to handle errors
    try {
        // Check if the file exists in the request
        // Read files from the directory
        const files = fs_1.default.readdirSync(dir);
        if (files.length === 0) {
            return res
                .status(400)
                .json({ message: "No files found in the directory" });
        }
        // Get the Backblaze credentials from environment variables
        const applicationKey = process.env.BACKBLAZE_MASTER_APPLICATION_KEY_ID;
        const applicationID = process.env.BACKBLAZE_MASTER_APPLICATION_ID;
        const bucketID = process.env.BACKBLAZE_BUCKET_ID;
        // Authorize Backblaze and get the API URL and auth token
        const result = await (0, backBlazeAuthorize_1.backblazeAuthorize)({
            applicationKey: applicationKey,
            applicationID: applicationID,
        });
        // Use type assertion to inform TypeScript about the actual type
        const { apiUrl, authToken } = result;
        // Define allowed MIME types
        const mimeTypes = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
        const fileId = await (0, uploadToBackblaze_1.uploadToBackBlaze)({
            targetDir: "chapterTemp",
            bucketId: bucketID,
            apiUrl,
            authorizationToken: authToken,
        });
        req.chapterImages = fileId;
        // Clean up temp directory asynchronously
        await fs_1.default.rmSync(dir, { recursive: true, force: true });
        next();
    }
    catch (error) {
        // In case of an error, remove the temporary directory
        fs_1.default.rmSync(dir, { recursive: true });
        console.error(error);
        return res.status(500).json({
            error,
            message: "Something went wrong with the Backblaze upload",
        });
    }
};
exports.chapterUploadToBackBlaze = chapterUploadToBackBlaze;
//# sourceMappingURL=chapterUpload..js.map