import { exec } from "child_process";
import util from "util";
import path from "path";
import { watchDir } from "./dir-watcher.js";
import BuildConfigSingleton from "../builders/build-config.js";

const executeCmd = util.promisify(exec);

const buildConfig = await BuildConfigSingleton.instance.getOrCreate();

function onAdd(filePath) {
  console.info(`${filePath} has been added`);
  return executeCmd(`cp ${filePath} ${path.join(buildConfig.target, path.dirname(filePath))}`);
}

function onChange(filePath) {
  console.info(`${filePath} has been updated`);
  return executeCmd(`cp ${filePath} ${path.join(buildConfig.target, path.dirname(filePath))}`);
}

watchDir(buildConfig.otherFiles, onAdd, onChange);
