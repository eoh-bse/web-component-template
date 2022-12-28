import { Props } from "../../models/props.js";

export type Css = string;

export function html(strings: TemplateStringsArray): HTMLTemplateElement {
  if (strings.length > 1)
    throw new Error("Interpolating values into HTML is not allowed");

  const template = document.createElement("template");
  template.innerHTML = strings[0];

  return template;
}

export function css(strings: TemplateStringsArray): Css {
  if (strings.length > 1)
    throw new Error("Interpolating values into CSS is not allowed");

  return strings[0];
}

const adoptedStyleSheetsSupported =
  window.ShadowRoot && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;

function applyStyles(shadowRoot: ShadowRoot, cssString: Css): void {
  if (adoptedStyleSheetsSupported) {
    const newStyleSheet = new CSSStyleSheet();
    newStyleSheet.replaceSync(cssString);
    shadowRoot.adoptedStyleSheets = [newStyleSheet];

    return;
  }

  const style = document.createElement("style");
  style.textContent = cssString;
  shadowRoot.appendChild(style);
}

export abstract class BaseComponent extends HTMLElement {
  private readonly _currentClass: any = this.constructor;

  protected static observedProps: readonly string[];
  protected static propsSet: Set<string>;

  protected readonly props: Props = new Props();

  static styles: Css;
  static template: HTMLTemplateElement;

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes(): readonly string[] {
    return this.observedProps;
  }

  attributeChangedCallback(property: string, oldValue: any, newValue: any): void {
    if (oldValue === newValue)
      return;

    if (this._currentClass.propsSet.has(property))
      this.props.updateProp(property, newValue);
  }

  async connectedCallback(): Promise<void> {
    this.render();
    await this.onRender();
  }

  render(): void {
    applyStyles(this.shadowRoot, this._currentClass.styles);
    this.shadowRoot.appendChild(this._currentClass.template.content.firstElementChild.cloneNode(true));
  }

  protected abstract onRender(): Promise<void>;
}
