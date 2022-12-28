import type { Menu } from "./types";

class NavBar extends HTMLElement {
  private readonly menus: readonly Menu[] = [
    {
      name: "Home",
      path: "/"
    },
    {
      name: "About",
      path: "/about"
    }
  ];

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.render();
    this.createMenu();
  }

  static getHtml(): string {
    return `
      <div>
      </div>
    `.trim();
  }

  createMenu(): void {
    const wrapper = this.shadowRoot.querySelector("div");
    const menu = document.createElement("ui");
    this.menus.forEach(item => {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.innerText = item.name;
      link.href = item.path;

      li.appendChild(link);
      menu.appendChild(li);
    });

    wrapper.appendChild(menu);
  }

  render(): void {
    if (!this.isConnected)
      return;

    this.shadowRoot.innerHTML = NavBar.getHtml();
  }
}

customElements.define('nav-bar', NavBar);
