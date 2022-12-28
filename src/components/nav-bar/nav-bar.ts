import { type Css, BaseComponent, html, css } from "../base-component/base-component.js";
import type { Menu } from "./types";

class NavBar extends BaseComponent {
  private readonly _menus: readonly Menu[] = [
    {
      name: "Home",
      path: "/"
    },
    {
      name: "About",
      path: "/about.html"
    }
  ];

  static override styles: Css = css`
    ul {
      list-style-type: none;
      margin: 0;
      padding: 0;
      overflow: hidden;
      background-color: var(--background);
    }

    li {
      float: left;
    }

    li a {
      display: block;
      color: white;
      padding: 1rem;
      text-align: center;
      text-decoration: none;
    }

    li a:hover {
      background-color: var(--background-hover);
      transition: 0.3s;
    }
  `;

  static override template: HTMLTemplateElement = html`<nav></nav>`;

  protected override onRender(): Promise<void> {
    this.createMenu();
    return Promise.resolve();
  }

  createMenu(): void {
    const navBar = this.shadowRoot.querySelector("nav");
    const menu = document.createElement("ul");
    this._menus.forEach(item => {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.innerText = item.name;
      link.href = item.path;

      li.appendChild(link);
      menu.appendChild(li);
    });

    navBar.appendChild(menu);
  }
}

customElements.define("nav-bar", NavBar);

declare global {
  interface HTMLElementTagNameMap {
    "nav-bar": NavBar
  }
}
