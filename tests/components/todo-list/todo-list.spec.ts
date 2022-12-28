import { expect, fixture } from "@open-wc/testing";
import "../../../src/components/todo-list/todo-list";

describe("todo-list component should", () => {
  it("change its name attribute with value in name-change input when name-change button is clicked", async () => {
    const todoList = await fixture("<todo-list name='Elena'></todo-list>");
    const nameChangeInput: HTMLInputElement = todoList.shadowRoot.querySelector("#name-change input");
    const nameChangeBtn: HTMLButtonElement = todoList.shadowRoot.querySelector("#name-change button");

    const newNameValue = "Elbert";
    nameChangeInput.value = newNameValue;
    nameChangeBtn.click();

    expect(todoList).to.have.attribute("name", newNameValue);
  });
});
