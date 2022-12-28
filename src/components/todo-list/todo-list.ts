import { type Css, BaseComponent, html, css } from "../base-component/base-component.js";
import { TodoListObservedProp } from "./types.js";

class TodoList extends BaseComponent {
  protected static override readonly observedProps: readonly TodoListObservedProp[] = [TodoListObservedProp.Name];
  protected static override readonly propsSet: Set<string> = new Set(TodoList.observedProps);

  private todoListOwner: HTMLHeadingElement;
  private list: HTMLUListElement;
  private addTodoTextBox: HTMLInputElement;
  private addTodoBtn: HTMLButtonElement;

  static override styles: Css = css`
    h1 {
      color: var(--main-color);
    }
  `;

  static override template: HTMLTemplateElement = html`
    <div>
      <h1></h1>
      <ul></ul>

      <label for="todo-item">Add todo:</label>
      <input type="text" name="todo-item">
      <button type="button">Add</button>
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
    this.addTodoTextBox = this.shadowRoot.querySelector("input");
    this.addTodoBtn = this.shadowRoot.querySelector("button");
  }

  registerEventListeners(): void {
    this.addTodoBtn.addEventListener("click", this.onAddTodo.bind(this));
  }

  async setupProps(): Promise<void> {
    await this.props.addCallbackAndTrigger(TodoListObservedProp.Name, (value: any): Promise<void> => {
      this.todoListOwner.innerText = `${value}'s todo list`;
      return Promise.resolve();
    });
  }

  onAddTodo(): void {
    const todoItem = document.createElement("li");
    todoItem.innerText = this.addTodoTextBox.value;
    this.addTodoTextBox.value = "";
    this.list.appendChild(todoItem);
  }
}

customElements.define("todo-list", TodoList);

declare global {
  interface HTMLElementTagNameMap {
    "todo-list": TodoList
  }
}
