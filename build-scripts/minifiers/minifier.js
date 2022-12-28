import fs from "fs/promises";

import { getAllFiles } from "../utils/file-finder.js";
import { minifyHtml } from "./html-minifier.js";
import { minifyCss } from "./css-minifier.js";
import { minifyJs } from "./js-minifier.js";

const emptyFileContent = "export {};";

async function minify(buildFolder) {
  const allFiles = getAllFiles(buildFolder);
  const getFileContents = allFiles.map(async file => {
    const content = await fs.readFile(file, { encoding: "utf-8" });
    return {
      path: file,
      data: content
    };
  });

  const fileContents = await Promise.all(getFileContents);
  return Promise.all(fileContents.map(async content => {
    const trimmedContent = content.data.trim();
    if (trimmedContent === emptyFileContent)
      return fs.rm(content.path);

    let minifiedContent = trimmedContent;
    if (content.path.endsWith(".js"))
      minifiedContent = await minifyJs(trimmedContent);
    else if (content.path.endsWith(".html"))
      minifiedContent = await minifyHtml(trimmedContent);
    else if (content.path.endsWith(".css"))
      minifiedContent = await minifyCss(trimmedContent);

    return fs.writeFile(content.path, minifiedContent);
  }));
}

export { minify };
