import { exec } from "child_process";
import util from "util";

const executeCmd = util.promisify(exec);

function copyFilesOrDirs(filesOrDirs, target) {
  if (!filesOrDirs || filesOrDirs.length === 0)
    return;

  return Promise.all(filesOrDirs.map(file => executeCmd(`cp -r -f ${file} ${target}`)));
}

export { copyFilesOrDirs };
