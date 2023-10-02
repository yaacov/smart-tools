import { html } from '../html.js';

class CardComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const heightValue = parseInt(this.getAttribute('height') || '1', 10);
    const gapValue = this.parentElement.getAttribute('gap') || '10px';
    const cardHeight = this.parentElement.getAttribute('height') || '180px';
    const calculatedHeight = `calc(${heightValue} * ${cardHeight} + (${heightValue - 1} * ${gapValue}))`;
    const helpLinkHref = this.getAttribute('href');
    const helpLinkLabel = this.getAttribute('hreflabel');

    this.shadowRoot.innerHTML = html`
        <style>
          .card {
            box-sizing: border-box;
            border: 1px solid #ccc;
            border-radius: 5px;
            height: ${calculatedHeight};
          }
          .card-header {
            padding: 10px;
            border-bottom: 1px solid #ccc;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
          }
          .card-body {
            padding: 10px;
          }
          .help-link {
            text-decoration: none;
            color: #fffefe;
          }
        </style>
        <div class="card">
          <div class="card-header">
            ${this.getAttribute('title')}
            ${helpLinkHref ? html`<a href="${helpLinkHref}" class="help-link" target="_blank">${helpLinkLabel || 'Help'}</a>` : ''}
          </div>
          <div class="card-body">
            <slot></slot>
          </div>
        </div>
      `;
  }
}

customElements.define('card-component', CardComponent);
