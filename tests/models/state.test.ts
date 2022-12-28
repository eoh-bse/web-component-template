import { expect } from "../helpers/expect";
import { State } from "../../src/models/state";

function buildAddCallbackError(stateKey: string): string {
  return `Update hook for "${stateKey}" in the state could not be added because "${stateKey}" does not exist`;
}

describe("State.get should", () => {
  it("return undefined given key that does not exist", () => {
    const state = new State();
    const value = state.get("some-key");

    expect(value).to.be.undefined;
  });

  it("return correct value given a key that exists", async () => {
    const state = new State();
    const key = "name", expectedValue = "David";
    await state.update(key, expectedValue);

    const retrievedValue = state.get(key);

    expect(retrievedValue).to.equal(expectedValue);
  });
});

describe("State.update should", () => {
  it("update the existing state value given a new value", async () => {
    const state = new State();
    const key = "name", oldValue = "David", newValue = "Alexis";
    await state.update(key, oldValue);
    await state.update(key, newValue);

    const retrievedValue = state.get(key);

    expect(retrievedValue).to.equal(newValue);
  });

  it("execute all the registered update hooks when the given new value is different from the current value", async () => {
    const state = new State();
    const key = "name", oldValue = "David", newValue = "Alexis";
    await state.update(key, oldValue);

    let counter0 = 0;
    let counter1 = 10;
    state.addUpdateHook(key, (): Promise<void> => {
      counter0++;
      return Promise.resolve();
    });
    state.addUpdateHook(key, (): Promise<void> => {
      counter1++;
      return Promise.resolve();
    });

    await state.update(key, newValue);

    expect(counter0).to.equal(1);
    expect(counter1).to.equal(11);
  });

  it("not execute any registered hooks when the given new value is the same as the current value", async () => {
    const state = new State();
    const key = "name", oldValue = "David";
    await state.update(key, oldValue);

    let counter0 = 0;
    state.addUpdateHook(key, (): Promise<void> => {
      counter0++;
      return Promise.resolve();
    });

    await state.update(key, oldValue);

    expect(counter0).to.equal(0);
  });
});

describe("State.addUpdateHook should", () => {
  it("throw error when the given key does not exist", () => {
    const state = new State();
    const key = "name";

    expect(() => state.addUpdateHook(key, (): Promise<void> => Promise.resolve()))
      .to
      .throw(Error, buildAddCallbackError(key));
  });
});

describe("State.addUpdateHookAndTrigger should", () => {
  it("throw error when the given key does not exist", async () => {
    const state = new State();
    const key = "name";

    await expect(state.addUpdateHookAndTrigger(key, (): Promise<void> => Promise.resolve()))
      .to
      .be
      .rejectedWith(new Error(buildAddCallbackError(key)));
  });

  it("execute the given update hook right after adding it", async () => {
    const state = new State();
    const key = "name", value = "David";
    state.update(key, value);

    let counter = 0;
    await state.addUpdateHookAndTrigger(key, (): Promise<void> => {
      counter++;
      return Promise.resolve();
    });

    expect(counter).to.equal(1);
  });
});
