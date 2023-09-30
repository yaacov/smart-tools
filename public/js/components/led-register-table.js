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
    return ['rega', 'regb'];
  }

  attributeChangedCallback(name) {
    if (name === 'rega' || name === 'regb') {
      this.render();
    }
  }

  render() {
    const regA = parseInt(this.getAttribute('rega'), 10);
    const regB = parseInt(this.getAttribute('regb'), 10);

    let tableContent = html`
            <style>
                table {
                  padding-left: 85px;
                }
                td {
                  padding: 2px 6px;
                  text-align: left;
                  font-weight: bold;
                }
                .label {
                  color: #D4AF37;
                }
                .decimal {
                  color: #D3D3D3;
                }
            </style>
            <table>
              <tr>
                <td><led-array color="red" width="8" value="${regA}"></led-array></td>
                <td>0x${regA.toString(16).toUpperCase().padStart(2, '0')}</td>
                <td class="decimal">${regA.toString(10).padStart(3, '0')}</td>
                <td class="label">Reg-A</td>
              </tr>
              <tr>
                <td><led-array color="red" width="8" value="${regB}"></led-array></td>
                <td>0x${regB.toString(16).toUpperCase().padStart(2, '0')}</td>
                <td class="decimal">${regB.toString(10).padStart(3, '0')}</td>
                <td class="label">Reg-A</td>
              </tr>
            </table>
        `;

    this.shadowRoot.innerHTML = tableContent;
  }
}

customElements.define('led-register-table', LedRegisterTable);
