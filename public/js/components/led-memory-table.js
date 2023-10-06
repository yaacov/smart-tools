/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
import { html } from '../html.js';

class LedMemoryTable extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this._memorySize = parseInt(this.getAttribute('memorysize'), 10);
    this._memory = new Array(this._memorySize).fill(0);
    this._memoryMap = [];
    this._labels = {};
    this._pc = 0;
    this._sp = 0;
    this._prevMemory = null;
    this._rowElements = [];

    this._tableElement = document.createElement('table');
    this.shadowRoot.appendChild(this._tableElement);

    this._style = document.createElement('style');
    this._style.innerHTML = html`
        table {
          border-collapse: collapse;
          font-size: 12px;
        }
        td {
          padding: 1px 4px;
          text-align: left;
        }
        .address {
          color: #D3D3D3;
          cursor: pointer;
        }
        .address:hover {
          color: #b3b3b3;
        }
        .label {
          color: #D4AF37;
        }
        .decimal {
          color: #D3D3D3;
        }
        .hidden-on-small {
          display: none;
        }
        @media (min-width: 850px) {
        .hidden-on-small {
              display: table-cell;
        }
      }
    `;
    this.shadowRoot.appendChild(this._style);
  }

  connectedCallback() {
    this.initializeTable();
  }

  initializeTable() {
    const table = this._tableElement;
    for (let i = 0; i < this._memorySize; i++) {
      const row = table.insertRow();
      this._rowElements.push(row);
      this.renderRow(i, row);
    }
  }

  set pc(value) {
    if (Number.isInteger(value) && value >= 0 && value !== this._pc) {
      const prevValue = this._pc;
      this._pc = value;

      this.updatePcSpCell(prevValue);
      this.updatePcSpCell(value);
    }
  }

  get pc() {
    return this._pc;
  }

  set sp(value) {
    if (Number.isInteger(value) && value >= 0 && value !== this._sp) {
      const prevValue = this._sp;
      this._sp = value;

      this.updatePcSpCell(prevValue);
      this.updatePcSpCell(value);
    }
  }

  get sp() {
    return this._sp;
  }

  set memory(value) {
    if (Array.isArray(value) && value.length === this._memorySize) {
      this._prevMemory = this._memory.slice();
      this._memory = value.slice();
      this.updateRowsForMemoryChange();
    } else {
      throw new Error('Invalid memory value. It should be an array with the same size as memorySize.');
    }
  }

  get memory() {
    return this._memory;
  }

  updateRowsForMemoryChange() {
    for (let i = 0; i < this._memorySize; i++) {
      if (this._memory[i] !== this._prevMemory[i]) {
        this.updateMemoryCell(i);
      }
    }
  }

  set memoryMap(value) {
    if (Array.isArray(value)) {
      this._memoryMap = structuredClone(value);
      this.updateTable();
    }
  }

  get memoryMap() {
    return this._memoryMap;
  }

  set labels(value) {
    this._labels = structuredClone(value);
    this.updateTable();
  }

  get labels() {
    return this._labels;
  }

  updateTable() {
    for (let i = 0; i < this._memorySize; i++) {
      const row = this._rowElements[i];
      this.renderRow(i, row);
    }
  }

  renderRow(index, row) {
    const value = this._memory[index];
    const { type, asmOpcode, asmOperand } = this._memoryMap[index] || {};
    const label = this._labels[index.toString()] || undefined;

    // Create address, valueHex, and valueDecimal strings
    const address = this.formatAddress(index);
    const valueHex = this.formatHex(value);
    const valueDecimal = this.formatDecimal(value);

    // Determine the value for the led-array in the first column
    const ledValue = (this._pc === index || this._sp === index) ? '1' : '0';

    // Check if row elements already exist, otherwise create and append them
    let { cells } = row;
    if (cells.length === 0) {
      if (cells.length === 0) {
        for (let i = 0; i < 7; i++) {
          row.insertCell();
        }

        cells[1].innerHTML = '<led-array color="red" width="1" value="0"></led-array>';
        cells[2].innerHTML = '<led-array color="green" width="8" value="0"></led-array>';
      }
      cells = row.cells;
    }

    cells[0].className = 'address';
    cells[0].textContent = address;
    cells[0].addEventListener('click', () => this.handleRowClick(index));

    cells[1].firstChild.setAttribute('color', 'red');
    cells[1].firstChild.setAttribute('value', ledValue);

    cells[2].firstChild.setAttribute('color', 'green');
    cells[2].firstChild.setAttribute('value', value.toString());

    cells[3].textContent = valueHex;

    cells[4].className = 'decimal hidden-on-small';
    cells[4].textContent = valueDecimal;

    cells[5].className = 'label hidden-on-small';
    cells[5].textContent = label;

    if (asmOpcode) {
      cells[6].className = 'hidden-on-small';
      cells[6].textContent = asmOpcode;
    } else {
      cells[6].className = 'decimal hidden-on-small';
      cells[6].textContent = asmOperand || (type ? valueHex : '');
    }
  }

  updatePcSpCell(index) {
    const row = this._rowElements[index];

    const ledValue = (this._pc === index || this._sp === index) ? '1' : '0';
    const cell = row.cells[1];
    cell.firstChild.setAttribute('value', ledValue);
  }

  updateMemoryCell(index) {
    const row = this._rowElements[index];

    const value = this._memory[index];
    const valueHex = this.formatHex(value);
    const valueDecimal = this.formatDecimal(value);

    row.cells[2].firstChild.setAttribute('value', value.toString());

    row.cells[3].textContent = valueHex;

    row.cells[4].className = 'decimal hidden-on-small';
    row.cells[4].textContent = valueDecimal;
  }

  formatAddress(i) {
    return `0x${i.toString(16).toUpperCase().padStart(2, '0')}`;
  }

  formatHex(value) {
    return `0x${value.toString(16).toUpperCase().padStart(2, '0')}`;
  }

  formatDecimal(value) {
    return `${value.toString(10).padStart(3, '0')}`;
  }

  handleRowClick(value) {
    const event = new CustomEvent('tableClick', {
      detail: { value },
    });
    this.dispatchEvent(event);
  }
}

customElements.define('led-memory-table', LedMemoryTable);
