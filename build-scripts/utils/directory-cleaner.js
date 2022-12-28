import { rm, mkdir } from "fs/promises";

export async function cleanDirectory(dirPath) {
  await rm(dirPath, {
    recursive: true,
    force: true
  });

  await mkdir(dirPath);
}

