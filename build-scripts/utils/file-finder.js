import fs from "fs";
import path from "path";

function getAllFiles(dir) {
  return getAllFilesMatchingRegex(dir, new RegExp(".*"));
}

function getAllFilesMatchingRegex(dir, regex) {
  const files = fs.readdirSync(dir);
  if (files.length == 0)
    return files;

  const fullPathFiles = [];
  const dirs = [];
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      dirs.push(fullPath);
      continue;
    }

    if (regex.test(file)) {
      fullPathFiles.push(fullPath);
    }
  }

  for (const directory of dirs) {
    const filesUnderDir = getAllFilesMatchingRegex(directory, regex);
    for (const file of filesUnderDir)
      fullPathFiles.push(file);
  }

  return fullPathFiles;
}

export { getAllFiles, getAllFilesMatchingRegex };
