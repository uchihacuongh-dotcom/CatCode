// src/ui/codeEditor.js
// Code editor panel with CodeMirror, JS/Python language switch, collapsible.

export class CodeEditor {
  constructor(rootEl) {
    this.root = rootEl || document.getElementById('code-panel');
    if (!this.root) {
      console.error('CodeEditor: root element #code-panel not found');
      return;
    }

    this.textarea = this.root.querySelector('#code-editor');
    this.outputEl = this.root.querySelector('#code-output');
    this.runBtn = this.root.querySelector('#code-run');
    this.hintBtn = this.root.querySelector('#code-hint');
    this.explainBtn = this.root.querySelector('#code-explain');
    this.langSelect = this.root.querySelector('#code-lang-select');
    this.collapseBtn = this.root.querySelector('#code-collapse');

    if (!this.textarea || !this.outputEl || !this.runBtn) {
      console.error('CodeEditor: missing DOM elements');
      return;
    }

    // Initialize CodeMirror from textarea
    this.cm = window.CodeMirror.fromTextArea(this.textarea, {
      lineNumbers: true,
      theme: 'dracula',
      mode: 'javascript',
      indentUnit: 2,
      tabSize: 2,
      lineWrapping: true,
    });

    this.currentLang = 'js';
    this.runHandler = null;
    this.hintHandler = null;
    this.explainHandler = null;
    this.collapsed = false;
    this.templates = null;

    this._bind();
  }

  _bind() {
    this.runBtn.addEventListener('click', () => {
      if (this.runHandler) {
        this.runHandler(this.getCode(), this.currentLang);
      } else {
        this.printOutput('(chưa gắn chức năng chạy code)', 'dim');
      }
    });

    if (this.hintBtn) {
      this.hintBtn.addEventListener('click', () => {
        if (this.hintHandler) this.hintHandler();
      });
    }

    if (this.explainBtn) {
      this.explainBtn.addEventListener('click', () => {
        if (this.explainHandler) this.explainHandler();
      });
    }

    if (this.langSelect) {
      this.langSelect.addEventListener('change', () => {
        this.setLanguage(this.langSelect.value);
      });
    }

    if (this.collapseBtn) {
      this.collapseBtn.addEventListener('click', () => {
        this.toggleCollapse();
      });
    }
  }

  // --- Public API for main.js / levels ---

  onRun(handler) {
    this.runHandler = handler;
  }

  onHint(handler) {
    this.hintHandler = handler;
  }

  onExplain(handler) {
    this.explainHandler = handler;
  }

  setCode(code) {
    if (this.cm) this.cm.setValue(code ?? '');
  }

  getCode() {
    return this.cm ? this.cm.getValue() : '';
  }

  // templates: { js, python, cpp } - code mẫu cho từng ngôn ngữ của màn hiện tại
  setTemplates(templates) {
    this.templates = templates || null;
  }

  setLanguage(lang) {
    const prev = this.currentLang;
    this.currentLang = lang;
    if (this.langSelect && this.langSelect.value !== lang) this.langSelect.value = lang;
    if (!this.cm) return;
    if (lang === 'python') {
      this.cm.setOption('mode', 'python');
    } else if (lang === 'cpp') {
      this.cm.setOption('mode', 'text/x-c++src');
    } else {
      this.cm.setOption('mode', 'javascript');
    }

    // Đổi sang mẫu của ngôn ngữ mới nếu người học chưa sửa mẫu cũ
    if (this.templates && prev !== lang && this.templates[lang] != null) {
      const cur = this.getCode().trim();
      const prevTpl = this.templates[prev];
      if (cur === '' || (prevTpl != null && cur === prevTpl.trim())) {
        this.setCode(this.templates[lang]);
      }
    }
  }

  clearOutput() {
    if (this.outputEl) this.outputEl.innerHTML = '';
  }

  printOutput(text, type = 'info') {
    if (!this.outputEl) return;
    const line = document.createElement('div');
    line.textContent = text;

    switch (type) {
      case 'error':   line.style.color = '#ff5555'; break;
      case 'success': line.style.color = '#50fa7b'; break;
      case 'hint':    line.style.color = '#bd93f9'; break;
      case 'system':  line.style.color = '#8be9fd'; break;
      case 'dim':     line.style.color = '#6272a4'; break;
      default:        line.style.color = '#f8f8f2';
    }

    this.outputEl.appendChild(line);
    this.outputEl.scrollTop = this.outputEl.scrollHeight;
  }

  toggleCollapse() {
    this.collapsed = !this.collapsed;
    if (this.collapsed) {
      this.root.style.height = '26px';
      this.root.style.maxHeight = '26px';
      this.collapseBtn.textContent = '▲';
    } else {
      this.root.style.height = '45%';
      this.root.style.maxHeight = '45%';
      this.collapseBtn.textContent = '▼';
      if (this.cm) this.cm.refresh();
    }
  }
}
