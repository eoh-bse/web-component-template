import type { Menu } from "./types";

export default class NavBar extends HTMLElement {
  private readonly menus: readonly Menu[] = [
    {
      name: "Home",
      path: "/"
    },
    {
      name: "About",
      path: "/about.html"
    }
  ];

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
  }

  private static html: string =
    `<style>@import "./nav-bar.css"</style>
     <nav></nav>`;

  connectedCallback(): void {
    this.render();
    this.createMenu();
  }

  render(): void {
    this.shadowRoot.innerHTML = NavBar.html;
  }

  createMenu(): void {
    const navBar = this.shadowRoot.querySelector("nav");
    const menu = document.createElement("ul");
    this.menus.forEach(item => {
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
