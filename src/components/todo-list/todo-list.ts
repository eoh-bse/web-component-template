import { type Css, BaseComponent, html, css } from "../base-component/base-component.js";
import { TodoListObservedProp } from "./types.js";

class TodoList extends BaseComponent {
  protected static override readonly observedProps: readonly TodoListObservedProp[] = [TodoListObservedProp.Name];

  private todoListOwner: HTMLHeadingElement;
  private list: HTMLUListElement;
  private addTodoInput: HTMLInputElement;
  private addTodoBtn: HTMLButtonElement;
  private nameChangeInput: HTMLInputElement;
  private nameChangeBtn: HTMLButtonElement;

  static override styles: Css = css`
    h1 {
      color: var(--main-color);
    }
  `;

  static override template: HTMLTemplateElement = html`
    <h1></h1>
    <ul></ul>

    <div id="add-todo">
      <label for="todo-item">Add todo:</label>
      <input type="text" name="todo-item">
      <button type="button">Add</button>
    </div>

    <div id="name-change">
      <label for="name-change">Change Name:</label>
      <input type="text" name="name-change">
      <button type="button">Change Name</button>
    </div>
  `;

  protected override async onRender(): Promise<void> {
    this.registerElements();
    this.registerEventListeners();
    await this.setupProps();
  }

  registerElements(): void {
    this.todoListOwner = this.shadowRoot.querySelector("h1");
    this.list = this.shadowRoot.querySelector("ul");
    this.addTodoInput = this.shadowRoot.querySelector("#add-todo input");
    this.addTodoBtn = this.shadowRoot.querySelector("#add-todo button");
    this.nameChangeInput = this.shadowRoot.querySelector("#name-change input");
    this.nameChangeBtn = this.shadowRoot.querySelector("#name-change button");
  }

  registerEventListeners(): void {
    this.addTodoBtn.addEventListener("click", this.onAddTodo.bind(this));
    this.nameChangeBtn.addEventListener("click", this.onNameChange.bind(this));
  }

  async setupProps(): Promise<void> {
    await this.state.addUpdateHookAndTrigger(TodoListObservedProp.Name, (value: any): Promise<void> => {
      this.todoListOwner.innerText = `${value}'s todo list`;
      return Promise.resolve();
    });
  }

  onAddTodo(): void {
    const todoItem = document.createElement("li");
    todoItem.innerText = this.addTodoInput.value;
    this.addTodoInput.value = "";
    this.list.appendChild(todoItem);
  }

  onNameChange(): void {
    this.setAttribute(TodoListObservedProp.Name, this.nameChangeInput.value);
    this.nameChangeInput.value = "";
  }
}

customElements.define("todo-list", TodoList);

declare global {
  interface HTMLElementTagNameMap {
    "todo-list": TodoList
  }
}
