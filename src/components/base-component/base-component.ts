import { html } from "./html.js";
import { type Css, css, applyStyles } from "./css.js";
import { State } from "../../models/state.js";

abstract class BaseComponent extends HTMLElement {
  private readonly _currentClass: any = this.constructor;

  protected static observedProps: readonly string[];

  protected readonly state: State = new State();

  static styles: Css;
  static template: HTMLTemplateElement;

  constructor() {
    super();

    this.onCreate();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes(): readonly string[] {
    return this.observedProps;
  }

  attributeChangedCallback(property: string, oldValue: any, newValue: any): void {
    if (oldValue === newValue)
      return;

    this.state.update(property, newValue);
  }

  async connectedCallback(): Promise<void> {
    await this.beforeRender();
    this.render();
    await this.onRender();
  }

  render(): void {
    applyStyles(this.shadowRoot, this._currentClass.styles);
    this.shadowRoot.appendChild(this._currentClass.template.content.cloneNode(true));
  }

  /* Overridable lifecycle methods */

  protected onCreate(): void {
  }

  protected beforeRender(): Promise<void> {
    return Promise.resolve();
  }

  protected onRender(): Promise<void> {
    return Promise.resolve();
  }
}

export type { Css };
export { html, css, BaseComponent };
