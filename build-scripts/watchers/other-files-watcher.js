import { exec } from "child_process";
import { mkdir } from "fs/promises";
import util from "util";
import path from "path";
import { watchDir } from "./dir-watcher.js";
import BuildConfigSingleton from "../builders/build-config.js";

const executeCmd = util.promisify(exec);

const buildConfig = await BuildConfigSingleton.instance.getOrCreate();

async function onAdd(filePath) {
  console.info(`${filePath} has been added`);
  try {
    const targetDir = path.join(buildConfig.target, path.dirname(filePath));
    await mkdir(targetDir, { recursive: true });
    await executeCmd(`cp ${filePath} ${targetDir}`);
  } catch (ex) {
    console.error(`Failed to add ${filePath}`);
    console.error(ex);
  }
}

function onChange(filePath) {
  console.info(`${filePath} has been updated`);
  const targetDir = path.join(buildConfig.target, path.dirname(filePath));
  return executeCmd(`cp ${filePath} ${targetDir}`);
}

watchDir(buildConfig.otherFiles, onAdd, onChange);
