"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUrlEncodedFileName = void 0;
const getUrlEncodedFileName = (fileName) => {
    return fileName.split("/").map(encodeURIComponent).join("/");
};
exports.getUrlEncodedFileName = getUrlEncodedFileName;
//# sourceMappingURL=getUrlEncodedFileName.js.map