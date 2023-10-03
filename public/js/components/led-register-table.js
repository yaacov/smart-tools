/* eslint-disable no-restricted-syntax */
import { html } from '../html.js';

class LedRegisterTable extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['rega', 'regb', 'sp'];
  }

  attributeChangedCallback(name) {
    if (name === 'rega' || name === 'regb' || name === 'sp') {
      this.render();
    }
  }

  render() {
    const regA = parseInt(this.getAttribute('rega'), 10);
    const regB = parseInt(this.getAttribute('regb'), 10);
    const SP = parseInt(this.getAttribute('sp'), 10);

    let tableContent = html`
            <style>
                table {
                  padding-left: 16px;
                  font-size: 12px;
                }
                td {
                  padding: 1px 4px;
                  text-align: left;
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
            </style>
            <table>
              <tr>
                <td class="label">RegA</td>
                <td><led-array color="red" width="8" value="${regA}"></led-array></td>
                <td>0x${regA.toString(16).toUpperCase().padStart(2, '0')}</td>
                <td class="decimal hidden-on-small">${regA.toString(10).padStart(3, '0')}</td>
              </tr>
              <tr>
                <td class="label">RegB</td>
                <td><led-array color="red" width="8" value="${regB}"></led-array></td>
                <td>0x${regB.toString(16).toUpperCase().padStart(2, '0')}</td>
                <td class="decimal hidden-on-small">${regB.toString(10).padStart(3, '0')}</td>
              </tr>
              <td class="label">SP</td>
                <td><led-array color="red" width="8" value="${SP}"></led-array></td>
                <td>0x${SP.toString(16).toUpperCase().padStart(2, '0')}</td>
                <td class="decimal hidden-on-small">${SP.toString(10).padStart(3, '0')}</td>
              </tr>
            </table>
        `;

    this.shadowRoot.innerHTML = tableContent;
  }
}

customElements.define('led-register-table', LedRegisterTable);
