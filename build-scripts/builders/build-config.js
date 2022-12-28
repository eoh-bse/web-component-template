import { existsSync } from "fs";
import path from "path";

const defaultConfig = {
  shouldMinify: false
}

class BuildConfig {
  constructor() {
    this.config = null;
  }

  _overrideProperties(to, from) {
    for (const prop in from) {
      if (from[prop] === undefined)
        continue;

      to[prop] = from[prop];
    }
  }

  _validateConfig(config) {
    if (!config.target)
      throw "target folder has not been set";

    if (!existsSync(path.resolve(config.htmlFiles)))
      throw `path to html files does not exist`;

    if (!existsSync(path.resolve(config.cssFiles)))
      throw `path to css files does not exist`;
  }

  _getBuildConfig(parsedConfig) {
    let finalConfig = {};
    [defaultConfig, parsedConfig].forEach(conf => this._overrideProperties(finalConfig, conf));

    this._validateConfig(finalConfig);

    return finalConfig;
  }

  async getOrCreate() {
    if (this.config === null) {
      const parsedConfig = (await import("../../build-config.json", {
        assert: {
          type: "json"
        }
      })).default;

      this.config = this._getBuildConfig(parsedConfig);
    }

    return this.config;
  }
}

export default class BuildConfigSingleton {
  static instance = new BuildConfig();
}
