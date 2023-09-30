import { html } from '../html.js';

class LedArray extends HTMLElement {
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
    const width = parseInt(this.getAttribute('width') || '8', 10);
    const color = this.getAttribute('color') || 'green';
    const value = parseInt(this.getAttribute('value'), 10) || 0;
    const binaryString = value.toString(2).padStart(width, '0');

    this.shadowRoot.innerHTML = html`
          <style>
            .led-container {
                display: flex;
                align-items: center;
                gap: 5px;
            }
          </style>
          <div class="led-container">
            ${binaryString.split('').map((bit) => `<led-indicator color="${color}" value="${bit === '1'}"></led-indicator>`).join('')}
          </div>
        `;
  }
}

customElements.define('led-array', LedArray);
