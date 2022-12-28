import { html } from "../../../src/components/base-component/html";
import { expect } from "../../helpers/expect";

describe("html template literal tag should", () => {
  it("create HTMLTemplateElement with the given html", () => {
    const template = html`<div></div>`;

    expect(template).dom.to.equal("<template></template>");
    expect(template.content.firstElementChild).dom.to.equal("<div></div>");
  });

  it("throw error when interpolating values are given", () => {
    const value = "value";
    // @ts-expect-error
    expect(() => html`<div>${value}</div>`).to.throw(Error, "Interpolating values into HTML is not allowed");
  });
});
