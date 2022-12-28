import { parseArgs } from "node:util";

const { values: { env } } = parseArgs({
  options: {
    env: {
      type: "string",
      short: "e"
    }
  }
});

function getEnvironment() {
  if (env)
    return env.toLowerCase();

  return "default";
}

export { getEnvironment };
