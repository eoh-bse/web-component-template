
class Home extends HTMLElement {
  [varName: string]: any;

  name: string;
  static props: string[] = [
    'name'
  ];
  nameSlot: HTMLSpanElement;
  pushButton: HTMLButtonElement;

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.render();
    this.registerElements();
    this.registerEventListeners();
  }

  getHtml() {
    return `
      <div>
        Name: <span>${this.name}</span>
        <button>Push!!</button>
      </div>
    `;
  }

  static get observedAttributes() {
    return this.props;
  }

  attributeChangedCallback(property: string, oldValue: any, newValue: any) {
    if (oldValue === newValue)
      return;

    this[property] = newValue;

    if (property === 'name') {
      this.nameSlot.textContent = newValue;
    }
  }

  connectedCallback() {
  }

  registerElements() {
    this.nameSlot = this.shadowRoot.querySelector('span');
    this.pushButton = this.shadowRoot.querySelector('button');
  }

  registerEventListeners() {
    this.pushButton.addEventListener('click', this.onClick.bind(this));
  }

  onClick(event: MouseEvent) {
    if (this.name === 'Elbert')
      this.setAttribute('name', 'Elena');
    else
      this.setAttribute('name', 'Elbert');
  }

  render() {
    if (!this.isConnected)
      return;

    this.shadowRoot.innerHTML = this.getHtml();
  }
}

customElements.define('home-page', Home);

