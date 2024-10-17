"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUploadUrl = void 0;
const axios_1 = __importDefault(require("axios"));
const getUploadUrl = async ({ apiUrl, authorizationToken, bucketId, }) => {
    // the headers
    const headers = {
        Authorization: authorizationToken,
        "Content-Type": "application/json",
    };
    // body of the post request
    const data = {
        bucketId: bucketId,
    };
    const newApiUrl = apiUrl + "/b2api/v3/b2_get_upload_url";
    try {
        const response = await axios_1.default.post(newApiUrl, data, {
            headers,
        });
        const resData = await response.data;
        // auth token for upload
        const uploadUrlToken = resData.authorizationToken;
        //upload Url
        const uploadUrl = resData.uploadUrl;
        // return the required
        return { uploadUrlToken, uploadUrl };
    }
    catch (error) {
        console.error("Error getting upload URL:", error.response ? error.response.data : error.message);
        throw error;
    }
};
exports.getUploadUrl = getUploadUrl;
//# sourceMappingURL=backBlazeGetUploadUrl.js.map