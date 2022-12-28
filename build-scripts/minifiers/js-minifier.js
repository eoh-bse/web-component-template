import { minify } from "terser";

const options = {
  ecma: 2016,
  module: true,
  compress: {
    drop_console: true,
    module: true
  },
  mangle: {
    module: true
  },
  format: {
    comments: false,
    ecma: 2016,
    indent_level: 2
  }
};

async function minifyJs(jsContent) {
  const output = await minify(jsContent, options);
  return output.code;
}

export { minifyJs };
