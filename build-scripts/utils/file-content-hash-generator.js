import { createHash } from "crypto";
import { readFileSync } from "fs";

function getFileContentHash(fileContent) {
  const hash = createHash("md5");
  hash.update(fileContent);

  return hash.digest("hex");
}

function getFileContentHashFromPath(filePath) {
  const fileContent = readFileSync(filePath, "utf8");
  return getFileContentHash(fileContent);
}

export { getFileContentHash, getFileContentHashFromPath };
