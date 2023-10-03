import { html } from '../html.js';

/* eslint-disable no-underscore-dangle */
class SaveFileComponent extends HTMLElement {
  constructor() {
    super();

    this._filename = 'example.asm';

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
                    background-color: #2c2f33;
                    border: 2px solid #444C5C;
                    color: #ffffff;
                    margin-bottom: 10px;
                    padding: 10px;
                    border-radius: 5px;
                    font-size: 16px;
                    width: 100%;
                    box-sizing: border-box;
                    transition: border-color 0.3s ease;
                }
                input:focus {
                    border-color: #7289da;
                    outline: none; /* Removes the default browser outline */
                }
                input::placeholder {
                    color: #a0a0a0;
                }
            </style>
            <input type="text" id="filenameInput" placeholder="File name...">
            <button id="saveBtn">Save</button>
        `;

    this._shadowRoot.querySelector('#saveBtn').addEventListener('click', () => {
      this.save();
    });

    // Update the _filename property when the input value changes
    this._shadowRoot.querySelector('#filenameInput').addEventListener('input', (event) => {
      this._filename = event.target.value;
    });
  }

  save() {
    // Ensure editorIdSelector attribute is available
    const editorIdSelector = this.getAttribute('editorIdSelector') || '#code-editor';
    const editorElement = document.querySelector(editorIdSelector);
    if (!editorElement) {
      console.error('No element found with selector:', editorIdSelector);
      return;
    }
    const textToSave = editorElement.code;

    // Save the text
    const blob = new Blob([textToSave], { type: 'text/plain' });
    const a = document.createElement('a');

    a.href = URL.createObjectURL(blob);
    a.download = this._filename;

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  }

  get filename() {
    return this._filename;
  }

  set filename(val) {
    this._filename = val;

    // Reflect the property change to the input field
    const input = this._shadowRoot.querySelector('#filenameInput');
    if (input) {
      input.value = val;
    }
  }
}

window.customElements.define('save-file-component', SaveFileComponent);
