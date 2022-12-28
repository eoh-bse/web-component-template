import CleanCss from "clean-css";

const options = {
  returnPromise: true
};

const cssMinifier = new CleanCss(options);

async function minifyCss(cssContent) {
  const output = await cssMinifier.minify(cssContent);
  return output.styles;
}

export { minifyCss };
