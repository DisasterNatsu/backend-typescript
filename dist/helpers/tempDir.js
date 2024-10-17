"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tempDir = void 0;
const path_1 = __importDefault(require("path"));
const tempDir = ({ folder }) => {
    const __dirname = path_1.default.resolve();
    const dir = path_1.default.resolve(__dirname, folder);
    return { dir };
};
exports.tempDir = tempDir;
//# sourceMappingURL=tempDir.js.map