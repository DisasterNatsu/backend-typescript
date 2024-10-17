"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToBackBlaze = void 0;
const tempDir_1 = require("./tempDir");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const getUrlEncodedFileName_1 = require("./getUrlEncodedFileName");
const axios_1 = __importDefault(require("axios"));
const backBlazeGetUploadUrl_1 = require("./backBlazeGetUploadUrl");
const sha1 = (fileData) => {
    const hash = crypto_1.default.createHash("sha1");
    // @ts-ignore
    hash.update(fileData); // Directly use the Buffer
    return hash.digest("hex");
};
const uploadToBackBlaze = async ({ mime, targetDir, bucketId, apiUrl, authorizationToken, }) => {
    // Declare directory
    const { dir } = (0, tempDir_1.tempDir)({ folder: targetDir });
    // Get the files from the directory
    const filesArray = fs_1.default.readdirSync(dir);
    const uploadPromises = filesArray.map(async (file) => {
        const filePath = path_1.default.join(dir, file);
        try {
            // Get upload URL for every file
            const urlRes = await (0, backBlazeGetUploadUrl_1.getUploadUrl)({
                apiUrl,
                authorizationToken,
                bucketId,
            });
            const { uploadUrlToken, uploadUrl } = urlRes;
            // Read file data
            const data = fs_1.default.readFileSync(filePath);
            const urlEncodedFileName = (0, getUrlEncodedFileName_1.getUrlEncodedFileName)(file);
            // Prepare headers
            const headers = {
                Authorization: uploadUrlToken,
                "Content-Type": mime || "b2/x-auto",
                "Content-Length": data.length,
                "X-Bz-File-Name": urlEncodedFileName,
                "X-Bz-Content-Sha1": sha1(data),
            };
            // Upload file
            const backBlazeRes = await axios_1.default.post(uploadUrl, data, { headers });
            return backBlazeRes.data.fileId; // Return file ID on successful upload
        }
        catch (error) {
            console.error(`Error uploading file ${file}:`, error);
            throw error; // Rethrow the error for better error handling up the stack
        }
    });
    // Wait for all uploads to complete
    try {
        const ids = await Promise.all(uploadPromises);
        return ids;
    }
    catch (error) {
        console.error("Error uploading files:", error);
        throw new Error("Upload failed for one or more files.");
    }
};
exports.uploadToBackBlaze = uploadToBackBlaze;
//# sourceMappingURL=uploadToBackblaze.js.map