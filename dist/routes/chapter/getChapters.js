"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const getChapters_1 = require("../../controllers/chapter/getChapters");
const Router = express_1.default.Router();
Router.get("/all/:comicName", getChapters_1.AllChapters);
Router.get("/pages/:comicName/:chapter", getChapters_1.ChapterPages);
exports.default = Router;
//# sourceMappingURL=getChapters.js.map