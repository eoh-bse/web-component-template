import { TodoListProps, type TodoListObservedProps } from "./types.js";

class TodoList extends HTMLElement {
  private static readonly observedProps: readonly TodoListObservedProps[] = ["name"];
  private static readonly propsSet: Set<string> = new Set(TodoList.observedProps);
  private readonly props: TodoListProps = new TodoListProps();

  private todoListOwner: HTMLHeadingElement;
  private list: HTMLUListElement;
  private addTodoTextBox: HTMLInputElement;
  private addTodoBtn: HTMLButtonElement;

  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this.render();
    this.registerElements();
    this.registerEventListeners();
    this.setupProps();
  }

  static getHtml(): string {
    return `
      <style>@import "./todo-list.css"</style>
      <div>
        <h1></h1>
        <ul></ul>

        <label for="todo-item">Add todo:</label>
        <input type="text" name="todo-item">
        <button type="button">Add</button>
      </div>
    `.trim();
  }

  static get observedAttributes(): readonly string[] {
    return TodoList.observedProps;
  }

  attributeChangedCallback(property: string, oldValue: any, newValue: any): void {
    if (oldValue === newValue)
      return;

    if (TodoList.propsSet.has(property))
      this.props.updateProp(property, newValue);
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

  onAddTodo(): void {
    const todoItem = document.createElement("li");
    todoItem.innerText = this.addTodoTextBox.value;
    this.addTodoTextBox.value = "";
    this.list.appendChild(todoItem);
  }

  render(): void {
    if (!this.isConnected)
      return;

    this.shadowRoot.innerHTML = TodoList.getHtml();
  }

  setupProps(): void {
    this.props.addCallback("name", (value: any): void => {
      this.todoListOwner.innerText = `${value}'s todo list`;
    });
  }
}

customElements.define('todo-list', TodoList);
