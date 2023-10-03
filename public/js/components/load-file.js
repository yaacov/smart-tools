/* eslint-disable no-underscore-dangle */
import { html } from '../html.js';

class LoadFileComponent extends HTMLElement {
  constructor() {
    super();

    // Create private properties
    this._text = '';
    this._filename = '';

    // Attach shadow DOM to the element
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this.render();
  }

  render() {
    this._shadowRoot.innerHTML = html`
            <style>
                /* Dark Theme Button Styles */
                button {
                    background-color: #444C5C;
                    border: 2px solid #7289da;
                    color: #ffffff;
                    width: 100%;
                    padding: 10px 20px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 16px;
                    margin: 4px 2px;
                    cursor: pointer;
                    border-radius: 5px;
                    transition: background-color 0.3s ease, border-color 0.3s ease;
                }

                button:hover {
                    background-color: #7289da;
                    border-color: #ffffff;
                }

                /* Dark Theme Text Input Styles */
                input {
                    display: none;
                }

            </style>
            <input type="file" id="fileInput">
            <button id="uploadBtn">Load</button>
        `;

    const fileInput = this._shadowRoot.querySelector('#fileInput');

    this._shadowRoot.querySelector('#uploadBtn').addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          this._fileName = fileInput.files[0].name;
          this._text = event.target.result;

          // Dispatch custom event when upload is finished
          this.dispatchEvent(new CustomEvent('uploadFinished', {
            detail: { text: this._text, filename: this._fileName },
          }));
        };
        reader.readAsText(file);
      }
    });
  }

  get filename() {
    return this._filename;
  }

  get text() {
    return this._text;
  }
}

window.customElements.define('load-file-component', LoadFileComponent);
