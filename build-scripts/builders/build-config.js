import { existsSync } from "fs";
import { readFile } from "fs/promises";
import path from "path";
import { getEnvironment } from "./arg-parser.js";

class BuildConfig {
  constructor() {
    this.config = null;
    this.env = getEnvironment();
  }

  static _overrideProperties(to, from) {
    for (const prop in from) {
      if (from[prop] === undefined)
        continue;

      to[prop] = from[prop];
    }
  }

  static _validateConfig(config) {
    if (!config.target)
      throw new Error("target folder has not been set");

    if (!existsSync(path.resolve(config.htmlFiles)))
      throw new Error("path to html files does not exist");

    if (!existsSync(path.resolve(config.cssFiles)))
      throw new Error("path to css files does not exist");
  }

  static _getBuildConfig(defaultConfig, envConfig) {
    let finalConfig = {};
    [defaultConfig, envConfig].forEach(conf => BuildConfig._overrideProperties(finalConfig, conf));

    BuildConfig._validateConfig(finalConfig);

    return finalConfig;
  }

  async getOrCreate() {
    if (this.config === null) {
      const parsedConfig = JSON.parse(await readFile("./build-config.json", { encoding: "UTF-8" }));
      if (this.env === "default") {
        this.config = parsedConfig.default;
        return this.config;
      }

      this.config = BuildConfig._getBuildConfig(parsedConfig.default, parsedConfig[this.env]);
    }

    return this.config;
  }
}

export default class BuildConfigSingleton {
  static instance = new BuildConfig();
}
