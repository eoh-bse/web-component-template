import { readFileSync } from "fs";
import { writeFile, rm } from "fs/promises";
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
  const htmlFileContentMap = htmlFilePaths.map(path => {
    return {
      path,
      content: readFileSync(path, "utf8")
    };
  });

  return htmlFileContentMap;
}

function getAllJsFiles(buildDir) {
  const htmlFilePaths = getAllFilesMatchingRegex(buildDir, /.*\.js$/);
  const htmlFileContentMap = htmlFilePaths.map(path => {
    return {
      oldPath: path,
      content: readFileSync(path, "utf8")
    };
  });

  return htmlFileContentMap;
}

async function addContentHashToCssFiles(buildDir, htmlFiles) {
  const filePaths = getAllFilesMatchingRegex(buildDir, /.*\.css$/);
  const fileNameRegex = /[a-zA-Z0-9-]*\.css$/;
  const extension = ".css";

  for (const path of filePaths) {
    const fileName = getFileNameWithoutExtension(path, fileNameRegex, extension);
    const contentHash = getFileContentHashFromPath(path);
    const newFileName = `${fileName}.${contentHash}${extension}`;
    const newPath = replaceFileName(path, fileNameRegex, newFileName);

    await executeCmd(`mv ${path} ${newPath}`);

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
  return htmlFiles.map(html => writeFile(html.path, html.content, "utf8"));
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
  const htmlFiles = await getAllHtmlFiles(buildDir);
  const jsFiles = await getAllJsFiles(buildDir);

  await addContentHashToCssFiles(buildDir, htmlFiles);
  addContentHashToJsFiles(htmlFiles, jsFiles);

  await writeHtmlFiles(htmlFiles);
  await writeJsFiles(jsFiles);
}

export { addContentHashToCacheableFiles };
