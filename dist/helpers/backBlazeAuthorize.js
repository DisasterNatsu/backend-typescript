"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.backblazeAuthorize = void 0;
const axios_1 = __importDefault(require("axios"));
const backblazeAuthorize = async ({ applicationKey, applicationID, }) => {
    // create a base64 string
    let base64 = Buffer.from(applicationKey + ":" + applicationID).toString("base64");
    const authTokenB2 = "Basic " + base64;
    try {
        const Authorize = await axios_1.default.get("https://api.backblazeb2.com/b2api/v3/b2_authorize_account", {
            headers: {
                Authorization: authTokenB2,
            },
        });
        const res = await Authorize.data;
        // get the api url from response
        const apiUrl = res.apiInfo.storageApi.apiUrl;
        // get auth token
        const authorizationToken = res.authorizationToken;
        return {
            apiUrl,
            authToken: authorizationToken,
        };
    }
    catch (error) {
        console.error(error);
    }
};
exports.backblazeAuthorize = backblazeAuthorize;
//# sourceMappingURL=backBlazeAuthorize.js.map