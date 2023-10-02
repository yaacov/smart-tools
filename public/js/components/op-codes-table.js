/* eslint-disable guard-for-in */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-restricted-syntax */
import { html } from '../html.js';
import opcodes from '../src/opcodes.mjs';

class OpCodesTable extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = html`
        <style>
          table {
            border-collapse: collapse;
            width: 100%;
          }
          th, td {
            border: 0;
            text-align: left;
            padding: 4px;
          }
          td {
            cursor: pointer;
            color: #fefefe;
          }
          td:hover {
            color: #c0c0c0;
          }
        </style>
        <table>
          <tr>
            <th>Opcode</th>
            <th>Hex Value</th>
          </tr>
        </table>
      `;
  }

  connectedCallback() {
    const table = this.shadowRoot.querySelector('table');

    for (let opcode in opcodes) {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td class="opcode">${opcode}</td>
          <td class="hex">0x${opcodes[opcode].toString(16).padStart(2, '0').toUpperCase()}</td>
        `;
      row.addEventListener('click', () => this.handleRowClick(opcodes[opcode]));
      table.appendChild(row);
    }
  }

  handleRowClick(hexValue) {
    const event = new CustomEvent('tableClick', {
      detail: { value: hexValue },
    });
    this.dispatchEvent(event);
  }
}

customElements.define('op-codes-table', OpCodesTable);
