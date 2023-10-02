/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
import { html } from '../html.js';

class LedMemoryTable extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._indexesToRender = [];

    this._prevValueArray = null;
    this._prevIndicatorArray = null;

    this._data = JSON.parse(this.getAttribute('data') || '[]');

    this._tableElement = document.createElement('table');
    this.shadowRoot.appendChild(this._tableElement);

    this._style = document.createElement('style');
    this._style.innerHTML = html`
      table {
        border-collapse: collapse;
      }
      td {
        padding: 2px 6px;
        text-align: left;
      }
      .address {
        color: #D3D3D3;
      }
      .label {
        color: #D4AF37;
      }
      .decimal {
        color: #D3D3D3;
      }
    `;
    this.shadowRoot.appendChild(this._style);
  }

  buildArrays(data) {
    return data.reduce((acc, item) => {
      acc[0].push(item.value);
      acc[1].push(item.indicator);
      return acc;
    }, [[], []]);
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['data'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'data' && oldValue !== newValue) {
      const newData = JSON.parse(newValue || '[]');
      this._indexesToRender = this.getIndexesToRender(newData);

      if (this._indexesToRender.length > 0 || this._data.length !== newData.length) {
        [this._prevValueArray, this._prevIndicatorArray] = this.buildArrays(newData);
        this._data = newData;

        this.render();
      }
    }
  }

  getIndexesToRender(newData) {
    const indexesToRender = [];

    if (!this._data) {
      for (let i = 0; i < newData.length; i++) {
        indexesToRender.push(i);
      }
    } else {
      const newLength = newData.length;
      const prevLength = this._data.length;

      for (let i = 0; i < newLength; i++) {
        if (!this._prevIndicatorArray || newData[i].indicator !== this._prevIndicatorArray[i] || newData[i].value !== this._prevValueArray[i]) {
          indexesToRender.push(i);
        }
      }

      // If the new data is shorter, add all remaining indexes from the old data
      if (newLength < prevLength) {
        for (let i = newLength; i < prevLength; i++) {
          indexesToRender.push(i);
        }
      }
    }

    return indexesToRender;
  }

  render() {
    const table = this._tableElement;

    for (const i of this._indexesToRender) {
      const item = this._data[i];
      let row = table.rows[i];

      if (!row) {
        row = table.insertRow();
      }

      row.innerHTML = this.getRowStaticContent(item);
    }
  }

  getRowStaticContent(item) {
    const address = `0x${item.address.toString(16).toUpperCase().padStart(2, '0')}`;
    const valueHex = `0x${item.value.toString(16).toUpperCase().padStart(2, '0')}`;
    const valueDecimal = `${item.value.toString(10).padStart(3, '0')}`;

    return html`
      <td class="address">${address}</td>
      <td><led-array color="red" width="1" value="${item.indicator ? '1' : '0'}"></led-array>
      <td><led-array color="green" width="8" value="${item.value}"></led-array></td>
      <td>${valueHex}</td>
      <td class="label">${item.label || ''}</td>
      ${item.opCode ? `<td>${item.opCode}</td>` : `<td class="decimal">${item.oprand || ''}</td>`}
      <td class="decimal">${valueDecimal}</td>
    `;
  }
}

customElements.define('led-memory-table', LedMemoryTable);
