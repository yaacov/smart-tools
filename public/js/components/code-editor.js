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
        /* Dark Theme Styles */
        :host([theme="dark"]) .code { color: #abb2bf; }
        :host([theme="dark"]) .comment { color: #98c379; }
        :host([theme="dark"]) .label { color: #d19a66; }
        :host([theme="dark"]) .command { color: #61afef; }
        :host([theme="dark"]) .literal { color: #c678dd; }
        :host([theme="dark"]) #highlighter { color: #56b6c2; }

        :host([theme="dark"]) #container {
          background-color: #181c24;
        }
        
        /* Light Theme Styles */
        :host([theme="light"]) .code { color: #383a42; }
        :host([theme="light"]) .comment { color: #a0a1a7; }
        :host([theme="light"]) .label { color: #e45649; }
        :host([theme="light"]) .command { color: #0184bc; }
        :host([theme="light"]) .literal { color: #c18401; }
        :host([theme="light"]) #highlighter { color: #4078f2; }

        :host([theme="light"]) #container {
          background-color: #fafafa;
        }

        /* Common Styles */
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
          font-size: 14px;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          white-space: pre-wrap;
        }

        #editor {
          background-color: transparent;
          color: transparent;
          caret-color: wheat;
          outline: none;
        }

        #highlighter {
          pointer-events: none;
        }

        pre {
          padding: 10px;
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
      .replace(/(SHRB|JUMP|JZA|JZB|ADDA|ADDB|END|DATA|POPA|PUSHA|CALL|RET|LOADABP|STOREABP)([^:])/gi, '<span class="code">$1</span>$2')
      .replace(/(NOP|LOADA|LOADB|STOREA|STOREB|ORA|ORB|ANDA|ANDB|XORA|XORB|NOTA|NOTB|SHLA|SHLB|SHRA)([^:])/gi, '<span class="code">$1</span>$2')
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
