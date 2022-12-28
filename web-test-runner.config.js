import { esbuildPlugin } from "@web/dev-server-esbuild";

export default {
  files: ["**/*.spec.ts", "**/*.test.ts"],
  plugins: [
    esbuildPlugin({
      ts: true,
      tsconfig: "tests/tsconfig.json"
    })
  ],
  nodeResolve: true,
  debug: false
};