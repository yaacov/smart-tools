import { html } from '../html.js';

class HexValue extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.connectedCallback = this.connectedCallback.bind(this);
  }

  connectedCallback() {
    const value = this.getAttribute('value');
    const hexString = `0x${parseInt(value, 16).toString(16).padStart(2, '0').toUpperCase()}`;

    this.shadowRoot.innerHTML = html`
        <style>
          span {
            cursor: pointer;
          }
          span:hover {
            color: #f0f0f0;
          }
        </style>
        <span>${hexString}</span>
      `;

    this.shadowRoot.querySelector('span').addEventListener('click', (event) => {
      event.stopPropagation();

      this.dispatchEvent(new CustomEvent('hexclick', {
        detail: { value },
      }));
    });
  }
}

customElements.define('hex-value', HexValue);
