import { html } from '../html.js';

class LedSwitch extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.handleClick = this.handleClick.bind(this);
  }

  loadImages() {
    this.images = {
      ledRedOn: new Image(),
      ledRedOff: new Image(),
      ledGreenOn: new Image(),
      ledGreenOff: new Image(),
      switchOn: new Image(),
      switchOff: new Image(),
    };

    this.images.ledRedOn.src = 'assets/led-red.svg';
    this.images.ledRedOff.src = 'assets/led-red-off.svg';
    this.images.ledGreenOn.src = 'assets/led-green.svg';
    this.images.ledGreenOff.src = 'assets/led-green-off.svg';
    this.images.switchOn.src = 'assets/switch-on.svg';
    this.images.switchOff.src = 'assets/switch-off.svg';
  }

  initializeElements() {
    const layout = this.getAttribute('layout') || 'horizontal';
    const flexDirection = layout === 'vertical' ? 'column' : 'row';
    const label = this.getAttribute('label');

    this.shadowRoot.innerHTML = html`
      <style>
        :host {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-direction: ${flexDirection};
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
          width: auto;
          height: 60px;
          padding-top: ${layout === 'vertical' ? '15px' : '0'};
          padding-left: ${layout === 'vertical' ? '0' : '5px'};
        }
        .label {
          padding-left: 10px;
        }
      </style>
      <img class="led" src="${this.images.ledRedOn.src}" alt="LED Indicator" id="led">
      <img class="switch" src="${this.images.switchOn.src}" alt="Switch" id="switch">
      ${label ? `<Spen class="label">${label}<Spen>` : ''}    `;

    this.ledElement = this.shadowRoot.querySelector('#led');
    this.switchElement = this.shadowRoot.querySelector('#switch');
    this.labelElement = this.shadowRoot.querySelector('#label');

    this.switchElement.addEventListener('click', this.handleClick);
    this.ledElement.addEventListener('click', this.handleClick);
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
    return ['value'];
  }

  attributeChangedCallback(name) {
    if (name === 'value' && this?.images !== undefined) {
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

  connectedCallback() {
    this.loadImages();
    this.initializeElements();
    this.render();
  }

  render() {
    const value = this.getAttribute('value');
    const color = this.getAttribute('color') || 'red';

    let ledImage;
    let switchImage;
    if (color === 'red') {
      ledImage = value === 'true' ? this.images.ledRedOn : this.images.ledRedOff;
    } else if (color === 'green') {
      ledImage = value === 'true' ? this.images.ledGreenOn : this.images.ledGreenOff;
    }
    switchImage = value === 'true' ? this.images.switchOn : this.images.switchOff;

    this.ledElement.src = ledImage.src;
    this.switchElement.src = switchImage.src;
  }
}

customElements.define('led-switch', LedSwitch);
