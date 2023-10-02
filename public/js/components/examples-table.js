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
          color: #fefefe;
        }
        td:hover {
          color: #c0c0c0;
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
    this.fetchExamplesList();
  }

  async fetchExamplesList() {
    const path = this.getAttribute('path');
    if (!path) {
      console.error('Path attribute is missing');
      return;
    }

    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      const examples = text.trim().split('\n');
      this.renderTable(examples);
    } catch (error) {
      console.error('Error fetching the examples list:', error);
    }
  }

  renderTable(examples) {
    const table = this.shadowRoot.querySelector('table');

    for (let i in examples) {
      const row = document.createElement('tr');
      row.innerHTML = `<td class="example">${examples[i]}</td>`;
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
