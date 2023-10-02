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
          .backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            display: none;
            z-index: 5;
          }
          .modal {
            position: fixed;
            top: 10%;
            left: 50%;
            transform: translate(-50%, -0%);
            width: 800px;
            height: 400px;
            background-color: #232323;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            display: none;
            z-index: 10;

            font-size: 17px;
            font-weight: normal;
          }
          .modal.open + .backdrop {
            display: block;
          }
          .header {
            padding: 10px;
            font-weight: bold;
          }
          .header.info { color: #2196F3; }
          .header.warning { color: #FFC107; }
          .header.error { color: #F44336; }
          .content {
            padding: 10px;
          }
          .close {
            position: absolute;
            top: 10px;
            right: 10px;
            color: #fffefe;
            cursor: pointer;
          }
        </style>
        <div class="modal" id="modal">
          <div class="header" id="header">
            <span class="close" id="close">Close</span>
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
    this.closeElement = this.shadowRoot.getElementById('close');
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
