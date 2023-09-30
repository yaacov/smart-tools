/* eslint-disable no-underscore-dangle */
import { html } from '../html.js';

class LedSwitchArray extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._value = 0;
    this._width = parseInt(this.getAttribute('width') || '8', 10);
    this.handleSwitchChange = this.handleSwitchChange.bind(this);
  }

  connectedCallback() {
    this.render();
  }

  get value() {
    return parseInt(this._value, 10);
  }

  set value(newValue) {
    this.setAttribute('value', newValue.toString());

    const valueChangeEvent = new CustomEvent('valueChange', {
      detail: { value: newValue },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(valueChangeEvent);
  }

  static get observedAttributes() {
    return ['value'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'value' && oldValue !== newValue) {
      this._value = parseInt(newValue, 10);
      this.render();
    }
  }

  handleSwitchChange(event, index) {
    event.stopPropagation();

    const bitValue = event.detail.value === 'true' ? 1 : 0;
    const bitMask = 1 << index;
    if (bitValue) {
      this._value |= bitMask;
    } else {
      this._value &= ~bitMask;
    }
    this.setAttribute('value', this._value);

    const valueChangeEvent = new CustomEvent('valueChange', {
      detail: { value: this._value },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(valueChangeEvent);
  }

  render() {
    const binaryString = this._value.toString(2).padStart(this._width, '0');

    this.shadowRoot.innerHTML = html`
        <style>
          .led-array {
            display: flex;
            gap: 5px;
            padding-top: 20px;
          }
        </style>
        <div class="led-array">
          ${binaryString.split('').map((bit, index) => `
            <led-switch layout="vertical" value="${bit === '1'}" id="switch-${7 - index}"></led-switch>
          `).join('')}
        </div>
    `;

    binaryString.split('').forEach((_, index) => {
      this.shadowRoot.querySelector(`#switch-${index}`).addEventListener('valueChange', (event) => this.handleSwitchChange(event, index));
    });
  }
}

customElements.define('led-switch-array', LedSwitchArray);
