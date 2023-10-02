import { html } from '../html.js';

class LedSwitch extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.handleClick = this.handleClick.bind(this);
  }

  connectedCallback() {
    this.render();
  }

  get value() {
    return parseInt(this.getAttribute('value'), 10);
  }

  set value(newValue) {
    this.setAttribute('value', newValue.toString());

    const valueChangeEvent = new CustomEvent('valueChange', {
      detail: { value: newValue },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(valueChangeEvent);

    // Implement an auto reset
    const autoReset = this.getAttribute('autoreset');
    if (autoReset === 'true') {
      setTimeout(() => { this.setAttribute('value', false); this.render(); }, 700);
    }
  }

  static get observedAttributes() {
    return ['value', 'label'];
  }

  attributeChangedCallback(name) {
    if (name === 'value' || name === 'label') {
      this.render();
    }
  }

  handleClick(event) {
    event.stopPropagation();

    const newValue = this.getAttribute('value') === 'true' ? 'false' : 'true';
    this.setAttribute('value', newValue);

    const valueChangeEvent = new CustomEvent('valueChange', {
      detail: { value: newValue },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(valueChangeEvent);

    // Implement an auto reset
    const autoReset = this.getAttribute('autoreset');
    if (autoReset === 'true') {
      setTimeout(() => { this.setAttribute('value', false); this.render(); }, 700);
    }
  }

  render() {
    const value = this.getAttribute('value');
    const label = this.getAttribute('label');
    const color = this.getAttribute('color') || 'red';
    const layout = this.getAttribute('layout') || 'horizontal';

    let ledImagePath; let
      switchImagePath;
    if (color === 'red') {
      ledImagePath = value === 'true' ? 'assets/led-red.svg' : 'assets/led-red-off.svg';
    } else if (color === 'green') {
      ledImagePath = value === 'true' ? 'assets/led-green.svg' : 'assets/led-green-off.svg';
    }
    switchImagePath = value === 'true' ? 'assets/switch-on.svg' : 'assets/switch-off.svg';

    this.shadowRoot.innerHTML = html`
        <style>
          :host {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex-direction: ${layout === 'vertical' ? 'column' : 'row'};
            height: 60px;
          } 
          img {
            display: block;
            cursor: pointer;
          }
          .led {
            width: 17px;
            height: auto;
          }
          .switch {
            padding-top: ${layout === 'vertical' ? '15px' : '0'};
            padding-left: ${layout === 'vertical' ? '0' : '5px'};
            width: auto;
            height: 60px;
          }
          .label {
            padding-left: 10px;
          }
        </style>
        <img class="led" src="${ledImagePath}" alt="LED Indicator" id="led">
        <img class="switch" src="${switchImagePath}" alt="Switch" id="switch">
        ${label ? `<Spen class="label">${label}<Spen>` : ''}
      `;

    // Bind the handleClick method to the switch image elements
    this.shadowRoot.querySelector('#switch').addEventListener('click', this.handleClick);
    this.shadowRoot.querySelector('#led').addEventListener('click', this.handleClick);
  }
}

customElements.define('led-switch', LedSwitch);
