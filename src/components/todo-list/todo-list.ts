import { TodoListObservedProp } from "./types";
import { Props } from "../../models/props.js";

class TodoList extends HTMLElement {
  private static readonly observedProps: readonly TodoListObservedProp[] = [TodoListObservedProp.Name];
  private static readonly propsSet: Set<string> = new Set(TodoList.observedProps);
  private readonly props: Props = new Props();

  private todoListOwner: HTMLHeadingElement;
  private list: HTMLUListElement;
  private addTodoTextBox: HTMLInputElement;
  private addTodoBtn: HTMLButtonElement;

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
  }

  static html: string =
    `<style>@import "./todo-list.css"</style>
     <div>
       <h1></h1>
       <ul></ul>

       <label for="todo-item">Add todo:</label>
       <input type="text" name="todo-item">
       <button type="button">Add</button>
     </div>`;

  static get observedAttributes(): readonly string[] {
    return TodoList.observedProps;
  }

  connectedCallback(): void {
    this.render();
    this.registerElements();
    this.registerEventListeners();
    this.setupProps();
  }

  attributeChangedCallback(property: string, oldValue: any, newValue: any): void {
    if (oldValue === newValue)
      return;

    if (TodoList.propsSet.has(property))
      this.props.updateProp(property, newValue);
  }

  render(): void {
    this.shadowRoot.innerHTML = TodoList.html;
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

  setupProps(): void {
    this.props.addCallback(TodoListObservedProp.Name, true, (value: any): void => {
      this.todoListOwner.innerText = `${value}'s todo list`;
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
