// IMPORTANT!: This file must be executed at the root of this project
"use strict";

import { exec } from "child_process";
import { rm, mkdir } from "fs/promises";
import util from "util";

import BuildConfigSingleton from "./build-config.js";
import { getAllFilesMatchingRegex } from "../utils/file-finder.js";
import { minify } from "../minifiers/minifier.js";

const executeCmd = util.promisify(exec);

function clean(config) {
  return rm(config.target, {
    recursive: true,
    force: true
  });
}

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

const buildConfig = await BuildConfigSingleton.instance.getOrCreate();

await clean(buildConfig);
await compile(buildConfig);
await copyStaticFiles(buildConfig);

if (buildConfig.shouldMinify) {
  console.info("Minifying...");
  await minify(buildConfig.target);
  console.info("Successfully minified output files");
}
