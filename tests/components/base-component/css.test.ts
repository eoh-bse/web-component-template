import { css, applyStyles } from "../../../src/components/base-component/css";
import { expect } from "../../helpers/expect";

describe("css template literal tag should", () => {
  it("return the given css string", () => {
    const cssString = css`
      h1 {
        color: black;
      }
    `;

    const expectedCssString = `
      h1 {
        color: black;
      }
    `;

    expect(cssString).to.equal(expectedCssString);
  });

  it("throw error when given interpolating values", () => {
    const color = "black";
    // @ts-expect-error
    expect(() => css`h1 { color: ${color}`).to.throw(Error, "Interpolating values into CSS is not allowed");
  });
});

describe("applyStyles should", () => {
  it("add given styles to 'adoptedStyleSheets' in the given shadow root if 'adoptedStyleSheets' is supported", () => {
    const cssString = css`
      div {
        color: black;
      }
    `;

    const element = document.createElement("div");
    element.attachShadow({ mode: "open" });
    element.shadowRoot.innerHTML = "<div></div>";

    applyStyles(element.shadowRoot, cssString);

    expect(element.shadowRoot.adoptedStyleSheets).to.have.length(1);
    expect(element.shadowRoot.innerHTML).to.not.contain("<style>");
  });
});
