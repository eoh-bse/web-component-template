import { expect, fixture } from "@open-wc/testing";
import "../../../src/components/nav-bar/nav-bar";

describe("nav-bar component should", () => {
  it("render correctly", async () => {
    const navBar = await fixture("<nav-bar></nav-bar>");
    await expect(navBar).shadowDom.to.equalSnapshot();
  });
});
