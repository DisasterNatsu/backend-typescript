import path from "path";
import fs from "fs";

export const tempDir = ({ folder }: Folder) => {
  const __dirname = path.resolve();

  const dir = path.resolve(__dirname, folder);

  return { dir };
};
