import { spawn } from "child_process";
import { getAllFilesMatchingRegex } from "../utils/file-finder.js";
import { cleanDirectory } from "../utils/directory-cleaner.js";
import BuildConfigSingleton from "../builders/build-config.js";

function ensureCompilationCompletion(tsOutDir) {
  let tsCompilationDone = false;
  while (!tsCompilationDone) {
    const jsFiles = getAllFilesMatchingRegex(tsOutDir, /.*\.js$/);
    tsCompilationDone = jsFiles.length > 0;
  }
}

const buildConfig = await BuildConfigSingleton.instance.getOrCreate();

await cleanDirectory(buildConfig.target);

spawn(
  "node_modules/typescript/bin/tsc",
  ["--watch", `--outDir ${buildConfig.target}`],
  {
    shell: true,
    stdio: "inherit"
  }
);

spawn("node ./build-scripts/watchers/html-file-watcher.js", {
  shell: true,
  stdio: "inherit"
});
spawn("node ./build-scripts/watchers/css-file-watcher.js", {
  shell: true,
  stdio: "inherit"
});

console.log("Ensuring typescript compilation is finished...");
ensureCompilationCompletion(buildConfig.target);

spawn(`npx web-dev-server --root-dir ${buildConfig.target} --watch --open`, {
  shell: true,
  stdio: "inherit"
});

