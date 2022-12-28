import { readFile, writeFile, rm } from "fs/promises";
import { exec } from "child_process";
import util from "util";
import { getAllFilesMatchingRegex } from "../utils/file-finder.js";
import { getFileContentHash, getFileContentHashFromPath } from "../utils/file-content-hash-generator.js";

const executeCmd = util.promisify(exec);

function getFileNameWithoutExtension(path, regex, extension) {
  const fileName = path.match(regex)[0];

  return fileName.replace(extension, "");
}

function replaceFileName(path, regex, newFileName) {
  return path.replace(regex, newFileName);
}

function getAllHtmlFiles(buildDir) {
  const htmlFilePaths = getAllFilesMatchingRegex(buildDir, /.*\.html$/);
  const htmlFileContentMapPromise = htmlFilePaths.map(async path => {
    return {
      path,
      content: await readFile(path, "utf8")
    };
  });

  return Promise.all(htmlFileContentMapPromise);
}

function getAllCssFiles(buildDir) {
  const cssFilePaths = getAllFilesMatchingRegex(buildDir, /.*\.css$/);
  const cssFilePathMap = cssFilePaths.map(path => {
    return {
      oldPath: path
    };
  });

  return Promise.resolve(cssFilePathMap);
}

function getAllJsFiles(buildDir) {
  const jsFilePaths = getAllFilesMatchingRegex(buildDir, /.*\.js$/);
  const jsFileContentMapPromise = jsFilePaths.map(async path => {
    return {
      oldPath: path,
      content: await readFile(path, "utf8")
    };
  });

  return Promise.all(jsFileContentMapPromise);
}

function addContentHashToCssFiles(htmlFiles, cssFiles) {
  const fileNameRegex = /[a-zA-Z0-9-]*\.css$/;
  const extension = ".css";

  for (const cssFile of cssFiles) {
    const fileName = getFileNameWithoutExtension(cssFile.oldPath, fileNameRegex, extension);
    const contentHash = getFileContentHashFromPath(cssFile.oldPath);
    const newFileName = `${fileName}.${contentHash}${extension}`;
    const newPath = replaceFileName(cssFile.oldPath, fileNameRegex, newFileName);
    cssFile.newPath = newPath;

    const oldFileName = `${fileName}${extension}`;
    for (const htmlFile of htmlFiles)
      htmlFile.content = htmlFile.content.replace(oldFileName, newFileName);
  }
}

function addContentHashToJsFiles(htmlFiles, jsFiles) {
  const fileNameRegex = /[a-zA-Z0-9-]*\.js$/;
  const extension = ".js";

  for (const jsFile of jsFiles) {
    const fileName = getFileNameWithoutExtension(jsFile.oldPath, fileNameRegex, extension);
    const contentHash = getFileContentHash(jsFile.content);
    const newFileName = `${fileName}.${contentHash}${extension}`;
    const newPath = replaceFileName(jsFile.oldPath, fileNameRegex, newFileName);
    jsFile.newPath = newPath;

    const oldFileName = `${fileName}${extension}`;
    for (const htmlFile of htmlFiles)
      htmlFile.content = htmlFile.content.replace(oldFileName, newFileName);

    for (const otherJsFile of jsFiles) {
      if (otherJsFile === jsFile)
        continue;

      otherJsFile.content = otherJsFile.content.replace(oldFileName, newFileName);
    }
  }
}

function writeHtmlFiles(htmlFiles) {
  return Promise.all(htmlFiles.map(html => writeFile(html.path, html.content, "utf8")));
}

function writeCssFiles(cssFiles) {
  return Promise.all(cssFiles.map(css => executeCmd(`mv ${css.oldPath} ${css.newPath}`)));
}

function writeJsFiles(jsFiles) {
  return Promise.all(jsFiles.flatMap(js => {
    const tasks = [];
    tasks.push(writeFile(js.newPath, js.content, "utf8"));
    tasks.push(rm(js.oldPath));

    return tasks;
  }));
}

async function addContentHashToCacheableFiles(buildDir) {
  const [htmlFiles, cssFiles, jsFiles] =
    await Promise.all([getAllHtmlFiles(buildDir), getAllCssFiles(buildDir), getAllJsFiles(buildDir)]);

  addContentHashToCssFiles(htmlFiles, cssFiles);
  addContentHashToJsFiles(htmlFiles, jsFiles);

  await Promise.all([writeHtmlFiles(htmlFiles), writeCssFiles(cssFiles), writeJsFiles(jsFiles)]);
}

export { addContentHashToCacheableFiles };
