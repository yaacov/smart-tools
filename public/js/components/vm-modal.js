import { html } from '../html.js';

class VmModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isOpen = false;
    this.type = 'info';
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = html`
        <style>
          /* Dark Theme Styles */
          :host([theme="dark"]) .backdrop { background-color: rgba(0,0,0,0.5); }
          :host([theme="dark"]) .modal {
              background-color: #232323;
              box-shadow: 0 5px 15px rgba(0,0,0,0.3);
          }
          :host([theme="dark"]) .header.info { color: #56b6c2; }
          :host([theme="dark"]) .header.warning { color: #e5c07b; }
          :host([theme="dark"]) .header.error { color: #e06c75; }
          :host([theme="dark"]) .close-button { color: #abb2bf; }

          /* Light Theme Styles */
          :host([theme="light"]) .backdrop { background-color: rgba(0,0,0,0.2); }
          :host([theme="light"]) .modal {
              background-color: #ffffff;
              box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          }
          :host([theme="light"]) .header.info { color: #0184bc; }
          :host([theme="light"]) .header.warning { color: #ffb400; }
          :host([theme="light"]) .header.error { color: #ff4747; }
          :host([theme="light"]) .close-button { color: #383a42; }

          /* Common Styles */
          .backdrop {
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              z-index: 5;
              display: none;
              position: fixed;
          }
          .modal {
              top: 10%;
              left: 50%;
              transform: translate(-50%, -0%);
              width: 800px;
              height: 400px;
              border-radius: 10px;
              display: none;
              z-index: 10;
              font-weight: normal;
              position: fixed;
          }
          .close-button {
              position: absolute;
              top: 10px;
              right: 10px;
              cursor: pointer;
          }
          .modal.open + .backdrop {
            display: block;
          }
          .header {
            padding: 10px;
            font-weight: bold;
          }
          .content {
            padding: 10px;
          }
        </style>
        <div class="modal" id="modal">
          <div class="header" id="header">
            <span class="close-button" id="close-button">Close</span>
            <slot name="header"></slot>
          </div>
          <div class="content">
            <slot name="content"></slot>
          </div>
        </div>
        <div class="backdrop" id="backdrop"></div>
      `;

    this.modalElement = this.shadowRoot.getElementById('modal');
    this.headerElement = this.shadowRoot.getElementById('header');
    this.closeElement = this.shadowRoot.getElementById('close-button');
    this.backdropElement = this.shadowRoot.getElementById('backdrop');

    this.closeElement.addEventListener('click', () => this.close());
  }

  updateHeaderClass() {
    this.headerElement.className = `header ${this.type}`;
  }

  open(header, content, type = 'info') {
    const headerSlot = this.shadowRoot.querySelector('slot[name="header"]');
    const contentSlot = this.shadowRoot.querySelector('slot[name="content"]');

    // Create nodes for header and content
    const headerNode = document.createElement('span');
    headerNode.innerHTML = header;
    const contentNode = document.createElement('div');
    contentNode.innerHTML = content;

    // Clear any existing nodes in the slots
    headerSlot.innerHTML = '';
    contentSlot.innerHTML = '';

    // Append the new nodes to the slots
    headerSlot.appendChild(headerNode);
    contentSlot.appendChild(contentNode);

    // Update type if provided
    this.type = type;
    this.updateHeaderClass();

    this.modalElement.classList.add('open');
    this.modalElement.style.display = 'block';
    this.backdropElement.style.display = 'block';

    this.isOpen = true;
  }

  close() {
    this.modalElement.classList.remove('open');
    this.modalElement.style.display = 'none';
    this.backdropElement.style.display = 'none';

    this.isOpen = false;
  }
}

customElements.define('vm-modal', VmModal);
