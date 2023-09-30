import { html } from '../html.js';

class CardContainerComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    // Set default attributes if they're not provided
    if (!this.hasAttribute('gap')) {
      this.setAttribute('gap', '10px');
    }
    if (!this.hasAttribute('height')) {
      this.setAttribute('height', '200px');
    }
    if (!this.hasAttribute('columns')) {
      this.setAttribute('columns', '8');
    }
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = html`
        <style>
          /* Styles for the card container component */
          .card-container {
            display: grid;
            grid-template-columns: repeat( ${this.getAttribute('columns')}, 1fr);
            gap: var(--card-gap, ${this.getAttribute('gap')});
          }
        </style>
        <div class="card-container">
          <slot></slot>
        </div>
      `;

    // Manage children cards grid-row and column based on their props
    const cards = this.querySelectorAll('card-component');
    cards.forEach((card) => {
      const width = card.getAttribute('width') || 1;
      const height = card.getAttribute('height') || 1;
      card.style.gridColumn = `span ${width}`;
      card.style.gridRow = `span ${height}`;
    });
  }
}

customElements.define('card-container', CardContainerComponent);
