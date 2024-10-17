"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const getComics_1 = require("../../controllers/comics/getComics");
const Router = express_1.default.Router();
Router.get("/top-eight", getComics_1.GetTopEight);
Router.get("/all", getComics_1.AllComics);
Router.get("/comic-with-chapter", getComics_1.GetLatestEight);
Router.get("/get-random-five", getComics_1.GetFiveRandomComics);
exports.default = Router;
//# sourceMappingURL=getComics.js.map