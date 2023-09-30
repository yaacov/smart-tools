/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { html } from '../html.js';

class ExampleTable extends HTMLElement {
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
            <th>Examples</th>
          </tr>
        </table>
      `;
  }

  connectedCallback() {
    const table = this.shadowRoot.querySelector('table');
    const examples = [
      'addition.asm',
      'factorial.asm',
      'bitwise_not.asm',
      'divide_by_2.asm',
      'multiply_by_2.asm',
    ];

    for (let i in examples) {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td class="example">${examples[i]}</td>
        `;
      row.addEventListener('click', () => this.handleRowClick(examples[i]));
      table.appendChild(row);
    }
  }

  handleRowClick(example) {
    const event = new CustomEvent('tableClick', {
      detail: { value: example },
    });
    this.dispatchEvent(event);
  }
}

customElements.define('examples-table', ExampleTable);
