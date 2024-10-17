"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoverUploadToBackBlaze = void 0;
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
const backBlazeAuthorize_1 = require("../../helpers/backBlazeAuthorize");
const tempDir_1 = require("../../helpers/tempDir");
const uploadToBackblaze_1 = require("../../helpers/uploadToBackblaze");
const readdirAsync = (0, util_1.promisify)(fs_1.default.readdir);
const CoverUploadToBackBlaze = async (req, res, next) => {
    // define the dir
    const { dir } = (0, tempDir_1.tempDir)({ folder: "temp" });
    // try catch block
    try {
        // getting header token
        const applicationKey = process.env.BACKBLAZE_MASTER_APPLICATION_KEY_ID;
        const applicationID = process.env.BACKBLAZE_MASTER_APPLICATION_ID;
        // authorize backblaze and get the api url and authtoken
        const result = await (0, backBlazeAuthorize_1.backblazeAuthorize)({
            applicationKey: applicationKey,
            applicationID: applicationID,
        });
        // // Use type assertion to inform TypeScript about the actual type
        const { apiUrl, authToken } = result;
        // bucketid
        const bucketID = process.env.BACKBLAZE_BUCKET_ID;
        // declare mimetype
        const fileId = await (0, uploadToBackblaze_1.uploadToBackBlaze)({
            targetDir: "temp",
            bucketId: bucketID,
            apiUrl: apiUrl,
            authorizationToken: authToken,
        });
        req.coverImage = fileId[0];
        fs_1.default.rmdirSync(dir, { recursive: true });
        next();
    }
    catch (error) {
        // remove images
        fs_1.default.rmdirSync(dir, { recursive: true });
        console.log(error);
        return res.status(500).json({
            error,
            message: "Something wrong with the backblaze upload",
        });
    }
};
exports.CoverUploadToBackBlaze = CoverUploadToBackBlaze;
//# sourceMappingURL=coverUpload.js.map