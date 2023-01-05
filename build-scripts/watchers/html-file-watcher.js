import { exec } from "child_process";
import util from "util";
import { watchDir } from "./dir-watcher.js";
import BuildConfigSingleton from "../builders/build-config.js";

const executeCmd = util.promisify(exec);

const buildConfig = await BuildConfigSingleton.instance.getOrCreate();

function onAdd(filePath) {
  if (filePath.endsWith(".html")) {
    console.info(`${filePath} has been added`);
    return executeCmd(`cp ${filePath} ${buildConfig.target}`);
  }
}

function onChange(filePath) {
  if (filePath.endsWith(".html")) {
    console.info(`${filePath} has been updated`);
    return executeCmd(`cp ${filePath} ${buildConfig.target}`);
  }
}

watchDir(buildConfig.htmlFiles, onAdd, onChange);
