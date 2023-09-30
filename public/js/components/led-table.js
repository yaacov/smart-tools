/* eslint-disable no-restricted-syntax */
import { html } from '../html.js';

class LedTable extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.handleClick = this.handleClick.bind(this);
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['data'];
  }

  attributeChangedCallback(name) {
    if (name === 'data') {
      this.render();
    }
  }

  handleClick(event, value) {
    event.stopPropagation();

    const addressClickEvent = new CustomEvent('tableClick', {
      detail: { value },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(addressClickEvent);
  }

  render() {
    const data = JSON.parse(this.getAttribute('data') || '[]');
    let tableContent = `
            <style>
              table {
                border-collapse: collapse;
              }
              td {
                padding: 2px 6px;
                text-align: left;
                font-weight: bold;
              }
              .address {
                cursor: pointer;
              }
              .address:hover {
                color: #f0f0f0;
              }
              .label {
                color: #D4AF37;
              }
              .decimal {
                color: #D3D3D3;
              }
            </style>
            <table>
        `;

    for (const item of data) {
      const address = `0x${item.address.toString(16).toUpperCase().padStart(2, '0')}`;
      const value = `0x${item.value.toString(16).toUpperCase().padStart(2, '0')}`;
      const valueDecimal = `${item.value.toString(10).padStart(3, '0')}`;

      tableContent += html`
        <tr>
          <td class="address" id="address-${item.address}">${address}</td>
          <td><led-array color="red" width="1" value="${item.indicator ? '1' : '0'}"></led-array></td>
          <td><led-array color="green" width="8" value="${item.value}"></led-array></td>
          <td>${value}</td>
          <td class="label">${item.label || ''}</td>
          ${item.opCode ? `<td>${item.opCode}</td>` : `<td class="decimal">${item.oprand || ''}</td>`}
          <td class="decimal">${valueDecimal}</td>
        </tr>
        `;
    }

    tableContent += '</table>';
    this.shadowRoot.innerHTML = tableContent;

    for (const item of data) {
      this.shadowRoot.querySelector(`#address-${item.address}`).addEventListener('click', (event) => this.handleClick(event, item.address));
    }
  }
}

customElements.define('led-table', LedTable);
