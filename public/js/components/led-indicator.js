import { html } from '../html.js';

class LedIndicator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  loadImages() {
    this.images = {
      redOn: new Image(),
      redOff: new Image(),
      greenOn: new Image(),
      greenOff: new Image(),
    };

    this.images.redOn.src = 'assets/led-red.svg';
    this.images.redOff.src = 'assets/led-red-off.svg';
    this.images.greenOn.src = 'assets/led-green.svg';
    this.images.greenOff.src = 'assets/led-green-off.svg';
  }

  initializeElements() {
    this.shadowRoot.innerHTML = html`
      <style>
        :host {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        img {
          display: block;
          width: 17px;
          height: auto;
        }
      </style>
      <img alt="LED Indicator">
    `;
    this.imgElement = this.shadowRoot.querySelector('img');
  }

  connectedCallback() {
    this.loadImages();
    this.initializeElements();
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

    let image;
    if (color === 'red') {
      image = value === 'true' ? this.images.redOn : this.images.redOff;
    } else if (color === 'green') {
      image = value === 'true' ? this.images.greenOn : this.images.greenOff;
    }

    this.imgElement.src = image.src;
  }
}

customElements.define('led-indicator', LedIndicator);
