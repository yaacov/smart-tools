import { html } from '../html.js';

class LedIndicator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['value'];
  }

  attributeChangedCallback(name) {
    if (name === 'value') {
      this.render();
    }
  }

  render() {
    const value = this.getAttribute('value');
    const color = this.getAttribute('color') || 'red';

    let imagePath;
    if (color === 'red') {
      imagePath = value === 'true' ? 'assets/led-red.svg' : 'assets/led-red-off.svg';
    } else if (color === 'green') {
      imagePath = value === 'true' ? 'assets/led-green.svg' : 'assets/led-green-off.svg';
    }

    this.shadowRoot.innerHTML = html`
          <style>
            :host {
              display: inline-flex; /* Change to inline-flex */
              align-items: center;  /* Vertically align items in the center */
              justify-content: center; /* Horizontally align items in the center */
            }
            img {
              display: block;
              width: 17px;
              height: auto;
            }
          </style>
          <img src="${imagePath}" alt="LED Indicator">
        `;
  }
}

customElements.define('led-indicator', LedIndicator);
