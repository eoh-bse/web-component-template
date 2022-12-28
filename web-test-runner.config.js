import { esbuildPlugin } from "@web/dev-server-esbuild";
import { playwrightLauncher } from "@web/test-runner-playwright";

export default {
  files: ["**/*.spec.ts", "**/*.test.ts"],
  plugins: [
    esbuildPlugin({
      ts: true,
      tsconfig: "tests/tsconfig.json"
    })
  ],
  browsers: [
    playwrightLauncher({ product: "chromium" }),
    // playwrightLauncher({ product: "webkit" }), // not supported in Fedora yet
    playwrightLauncher({ product: "firefox" })
  ],
  nodeResolve: true,
  debug: false,
  coverageConfig: {
    include: ["src/**/*.ts"]
  }
};
