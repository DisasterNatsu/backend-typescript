"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoverUploadToBackBlaze = void 0;
const backblaze_b2_1 = __importDefault(require("backblaze-b2"));
const path_1 = __importDefault(require("path"));
const CoverUploadToBackBlaze = async (images) => {
    const __dirname = path_1.default.resolve(); // getting the path
    // create a temporary directory to store the zip file for further prossesing
    let dir = path_1.default.join(__dirname, "temp");
    // initialize b2
    const b2 = new backblaze_b2_1.default({
        applicationKeyId: process.env.BACKBLAZE_MASTER_APPLICATION_KEY_ID,
        applicationKey: process.env.BACKBLAZE_MASTER_APPLICATION_ID,
    });
    // parse the stingified array of imageIds
    const fileIds = JSON.parse(images);
    try {
    }
    catch (error) {
        return new Error("Something happened while deleting");
    }
};
exports.CoverUploadToBackBlaze = CoverUploadToBackBlaze;
//# sourceMappingURL=deleteUploadedImages.js.map