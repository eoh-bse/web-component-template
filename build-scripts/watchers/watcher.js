import { spawn } from "child_process";
import BuildConfigSingleton from "../builders/build-config.js";

const buildConfig = await BuildConfigSingleton.instance.getOrCreate();

spawn("node ./build-scripts/watchers/html-file-watcher.js", { shell: true });
spawn("node ./build-scripts/watchers/css-file-watcher.js", {
  shell: true,
  stdio: "inherit"
});
spawn(
  "node_modules/typescript/bin/tsc",
  ["--watch", `--outDir ${buildConfig.target}`],
  {
    shell: true,
    stdio: "inherit"
  }
);

spawn(`npx web-dev-server --root-dir ${buildConfig.target} --watch --open`, {
  shell: true,
  stdio: "inherit"
});
