"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseParamsChapter = exports.ParseParams = void 0;
const ParseParams = (param) => {
    const paramArray = param.split("-");
    const id = Number(paramArray[0]);
    const comicName = paramArray.splice(1, paramArray.length - 1).join(" ");
    const capitalizedComicName = comicName.replace(/\b\w/g, (char) => char.toUpperCase());
    return {
        id: id,
        title: capitalizedComicName,
    };
};
exports.ParseParams = ParseParams;
const ParseParamsChapter = (param) => {
    const paramArray = param.split("-");
    const chapterID = Number(paramArray[0]);
    const chapterNumber = Number(paramArray[paramArray.length - 1]);
    return { chapterID, chapterNumber };
};
exports.ParseParamsChapter = ParseParamsChapter;
//# sourceMappingURL=urlParser.js.map