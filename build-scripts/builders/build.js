// IMPORTANT!: This file must be executed at the root of this project
import { exec } from "child_process";
import util from "util";
import { cleanDirectory } from "../utils/directory-cleaner.js";
import BuildConfigSingleton from "./build-config.js";
import { getAllFilesMatchingRegex } from "../utils/file-finder.js";
import { copyFilesOrDirs } from "../utils/file-copier.js";
import { minify } from "../minifiers/minifier.js";
import { addContentHashToCacheableFiles } from "./cache-breaker-provider.js";

const executeCmd = util.promisify(exec);

async function compile(config) {
  console.info("Compiling typescript files...");
  const { error, stderr } =
    await executeCmd(`node_modules/typescript/bin/tsc --outDir ${config.target} --project ${config.tsConfig}`);

  if (error)
    throw error;

  if (stderr)
    throw stderr;

  console.info("Compilation succeeded");
}

async function copyStaticFiles(config) {
  console.info(`Copying static files into ${config.target}...`);
  const htmlFiles = (await getAllFilesMatchingRegex(config.htmlFiles, /.*\.html$/)).join(" ");
  const cssFiles = (await getAllFilesMatchingRegex(config.cssFiles, /.*\.css$/)).join(" ");

  const { error, stderr } = await executeCmd(`cp -r ${cssFiles} ${htmlFiles} ${config.target}`);
  if (error)
    throw error;

  if (stderr)
    throw stderr;

  console.info("Static files were successfully copied");
}

async function copyOtherFiles(config) {
  console.info(`Copying additional files/directories into ${config.target}...`);
  await copyFilesOrDirs(config.otherFiles, config.target);
  console.info("Successfully copied additional files/directories");
}

const buildConfig = await BuildConfigSingleton.instance.getOrCreate();

await cleanDirectory(buildConfig.target);
await compile(buildConfig);
await copyStaticFiles(buildConfig);
await copyOtherFiles(buildConfig);

if (buildConfig.shouldMinify) {
  console.info("Minifying...");
  await minify(buildConfig.target);
  console.info("Successfully minified output files");

  await addContentHashToCacheableFiles(buildConfig.target);
  console.info("Added content hash to js and css files...");
}
