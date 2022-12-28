type Css = string;

function css(strings: TemplateStringsArray): Css {
  if (strings.length > 1)
    throw new Error("Interpolating values into CSS is not allowed");

  return strings[0];
}

const adoptedStyleSheetsSupported =
  window.ShadowRoot && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;

function applyStyles(shadowRoot: ShadowRoot, cssString: Css): void {
  if (adoptedStyleSheetsSupported) {
    const newStyleSheet = new CSSStyleSheet();
    newStyleSheet.replaceSync(cssString);
    shadowRoot.adoptedStyleSheets = [newStyleSheet];

    return;
  }

  const style = document.createElement("style");
  style.textContent = cssString;
  shadowRoot.appendChild(style);
}

export type { Css };
export { css, applyStyles };
