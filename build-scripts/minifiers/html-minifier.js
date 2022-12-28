import { minify } from "html-minifier-terser";

const options = {
  collapseWhitespace: true,
  collapseInlineTagWhitespace: true,
  html5: true,
  minifyCSS: true,
  minifyJS: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true
};

function minifyHtml(htmlContent) {
  return minify(htmlContent, options);
}

export { minifyHtml };
