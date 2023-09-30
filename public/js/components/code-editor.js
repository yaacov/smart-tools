/* eslint-disable class-methods-use-this */
import { html } from '../html.js';

class CodeEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.render();
  }

  connectedCallback() {
    this.highlightText();
  }

  get code() {
    const text = this.editor.innerText;

    return text;
  }

  set code(text) {
    this.editor.innerText = text;

    this.highlightText();
  }

  render() {
    this.shadowRoot.innerHTML = html`
      <style>
        :host([theme="light"]) .code { color: #008800; }
        :host([theme="light"]) .comment { color: #888888; }
        :host([theme="light"]) .label { color: #000088; }
        :host([theme="light"]) .literal { color: #880000; }
        :host([theme="light"]) #container {
          background-color: #f0f0f0;
        }

        /* Dark theme */
        :host([theme="dark"]) .code { color: #00aa00; }
        :host([theme="dark"]) .comment { color: #888888; }
        :host([theme="dark"]) .label { color: #D4AF37; }
        :host([theme="dark"]) .literal { color: #ff8080; }
        :host([theme="dark"]) #container {
          background-color: #1f2128;
        }

        /* New theme */
        :host([theme="new"]) .comment { color: #66b366; }
        :host([theme="new"]) .label { color: #ccc966; }
        :host([theme="new"]) .command { color: #fffdfd; }
        :host([theme="new"]) .literal { color: #ffffcc; }

        :host([theme="new"]) #container {
          background-color: #1c1f24;
        }

        #container {
          position: relative;
          width: 100%;
          height: 100%;
        }

        #editor,
        #highlighter {
          position: absolute;
          top: 0;
          left: 0;
          font-family: monospace;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
        }

        #editor {
          background-color: transparent;
          color: transparent;
          caret-color: wheat;
          caret-width: 2px;
          outline: none;
        }

        #highlighter {
          pointer-events: none;
        }

        pre {
          margin: 10px;
        }
      </style>

      <div id="container">
        <pre id="editor" contenteditable="true" spellcheck="false"></pre>
        <pre id="highlighter"></pre>
      </div>
    `;

    this.editor = this.shadowRoot.querySelector('#editor');
    this.highlighter = this.shadowRoot.querySelector('#highlighter');

    this.editor.addEventListener('keydown', this.handleTabKey.bind(this));
    this.editor.addEventListener('paste', this.handlePaste.bind(this));

    this.editor.addEventListener('input', () => {
      this.highlightText();
    });
  }

  handleTabKey(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      const spaces = '    ';

      document.execCommand('insertText', false, spaces);
    }
  }

  handlePaste(event) {
    event.preventDefault();

    const pastedText = (event.clipboardData || window.clipboardData).getData('text');
    const formattedText = pastedText.replace(/\n/g, '<br>');

    document.execCommand('insertHTML', false, formattedText);
  }

  highlightText() {
    const text = this.editor.innerHTML;
    const highlightedText = text
      .replace(/(LOADA|LOADB|STOREA|STOREB|ORA|ORB|ANDA|ANDB|XORA|XORB|NOTA|NOTB|SHLA|SHLB|SHRA|SHRB|JUMP|JZA|JZB|ADDA|ADDB|END|DATA)/g, '<span class="code">$1</span>')
      .replace(/(0x[\da-fA-F]{2})/g, '<span class="literal">$1</span>')
      .replace(/(^|<br>)(\s*\w+:)/g, '$1<span class="label">$2</span>')
      .replace(/(;.*?)(<br>|$)/gm, (_, p1, p2) => {
        const strippedComment = p1.replace(/<\/?[^>]+(>|$)/g, '');
        return `<span class="comment">${strippedComment}</span>${p2}`;
      });

    this.highlighter.innerHTML = highlightedText;
  }
}

customElements.define('code-editor', CodeEditor);
