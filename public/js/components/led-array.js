/* eslint-disable no-underscore-dangle */
class LedArray extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._value = null;
    this._ledIndicators = [];
    this._width = parseInt(this.getAttribute('width') || '8', 10);
    this._color = this.getAttribute('color') || 'green';
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['value'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'value' && oldValue !== newValue) {
      this._value = newValue;
      this.render();
    }
  }

  render() {
    const value = parseInt(this._value, 10) || 0;
    const binaryString = value.toString(2).padStart(this._width, '0');

    // Create the led-container if it doesn't exist
    let ledContainer = this.shadowRoot.querySelector('.led-container');
    if (!ledContainer) {
      ledContainer = document.createElement('div');
      ledContainer.className = 'led-container';
      this.shadowRoot.appendChild(ledContainer);
      ledContainer.style.display = 'flex';
      ledContainer.style.alignItems = 'center';
      ledContainer.style.gap = '5px';
    }

    // Update or create led-indicator elements
    binaryString.split('').forEach((bit, index) => {
      let ledIndicator = this._ledIndicators[index];
      if (!ledIndicator) {
        ledIndicator = document.createElement('led-indicator');
        this._ledIndicators[index] = ledIndicator;

        ledContainer.appendChild(ledIndicator);
        ledIndicator.setAttribute('color', this._color);
      }
      ledIndicator.setAttribute('value', bit === '1');
    });
  }
}

customElements.define('led-array', LedArray);
