/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { html } from '../html.js';

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
          }
          td:hover {
            color: #f0f0f0;
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
    const opcodes = {
      LOADA: 0x00,
      LOADB: 0x01,
      STOREA: 0x02,
      STOREB: 0x03,
      ORA: 0x04,
      ORB: 0x05,
      ANDA: 0x06,
      ANDB: 0x07,
      XORA: 0x08,
      XORB: 0x09,
      NOTA: 0x0A,
      NOTB: 0x0B,
      SHLA: 0x0C,
      SHLB: 0x0D,
      SHRA: 0x0E,
      SHRB: 0x0F,
      JUMP: 0x10,
      JZA: 0x11,
      JZB: 0x12,
      ADDA: 0x13,
      ADDB: 0x14,
      END: 0xFF,
    };

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
