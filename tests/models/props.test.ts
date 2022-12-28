import { chai, expect } from "@open-wc/testing";
import chaiPromiseRejectionPlugin from "../helpers/chai-promise-rejection-plugin";
import { Props } from "../../src/models/props";

chai.use(chaiPromiseRejectionPlugin);

function buildAddCallbackError(propName: string): string {
  return `Callback for prop "${propName}" could not be added because prop "${propName}" does not exist`;
}

describe("Props.getProp should", () => {
  it("return undefined given prop that does not exist", () => {
    const props = new Props();
    const propValue = props.getProp("some-prop");

    expect(propValue).to.be.undefined;
  });

  it("return correct value given a prop that exists", async () => {
    const props = new Props();
    const prop = "name", expectedValue = "David";
    await props.updateProp(prop, expectedValue);

    const retrievedValue = props.getProp(prop);

    expect(retrievedValue).to.equal(expectedValue);
  });
});

describe("Props.updateProp should", () => {
  it("update the existing prop value given a new value", async () => {
    const props = new Props();
    const prop = "name", oldValue = "David", newValue = "Alexis";
    await props.updateProp(prop, oldValue);
    await props.updateProp(prop, newValue);

    const retrievedValue = props.getProp(prop);

    expect(retrievedValue).to.equal(newValue);
  });

  it("execute all the registered callbacks when the given new value is different from the current value", async () => {
    const props = new Props();
    const prop = "name", oldValue = "David", newValue = "Alexis";
    await props.updateProp(prop, oldValue);

    let counter0 = 0;
    let counter1 = 10;
    props.addCallback(prop, (): Promise<void> => {
      counter0++;
      return Promise.resolve();
    });
    props.addCallback(prop, (): Promise<void> => {
      counter1++;
      return Promise.resolve();
    });

    await props.updateProp(prop, newValue);

    expect(counter0).to.equal(1);
    expect(counter1).to.equal(11);
  });

  it("not execute any registered callbacks when the given new value is the same as the current value", async () => {
    const props = new Props();
    const prop = "name", oldValue = "David";
    await props.updateProp(prop, oldValue);

    let counter0 = 0;
    props.addCallback(prop, (): Promise<void> => {
      counter0++;
      return Promise.resolve();
    });

    await props.updateProp(prop, oldValue);

    expect(counter0).to.equal(0);
  });
});

describe("Props.addCallback should", () => {
  it("throw error when the given prop does not exist", () => {
    const props = new Props();
    const prop = "name";

    expect(() => props.addCallback(prop, (): Promise<void> => Promise.resolve()))
      .to
      .throw(Error, buildAddCallbackError(prop));
  });
});

describe("Props.addCallbackAndTrigger should", () => {
  it("throw error when the given prop does not exist", async () => {
    const props = new Props();
    const prop = "name";

    await expect(props.addCallbackAndTrigger(prop, (): Promise<void> => Promise.resolve()))
      .to
      .be
      .rejectedWith(new Error(buildAddCallbackError(prop)));
  });

  it("execute the given callback right after adding it", async () => {
    const props = new Props();
    const prop = "name", value = "David";
    props.updateProp(prop, value);

    let counter = 0;
    await props.addCallbackAndTrigger(prop, (): Promise<void> => {
      counter++;
      return Promise.resolve();
    });

    expect(counter).to.equal(1);
  });
});
