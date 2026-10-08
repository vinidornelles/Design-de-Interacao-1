class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header class="site-header">
        <div class="container site-header__inner">
          <p class="brand">
            <span class="brand__mark">◆</span>
            Design de Interação
            <span class="brand__course">IFRS · 2026/2</span>
          </p>

          <site-nav></site-nav>
        </div>
      </header>
    `;
  }
}

class SiteNav extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <nav class="main-nav">
        <ul class="main-nav__list">
          <li><a class="nav-link" href="index.html"><span class="nav-link__index">00</span> Apresentação</a></li>
          <li><a class="nav-link" href="editor.html"><span class="nav-link__index">01</span> Editor de menus</a></li>
          <li><a class="nav-link" href="prova.html"><span class="nav-link__index">02</span> Prova on-line</a></li>
          <li><span class="nav-link nav-link--locked"><span class="nav-link__index">03</span> Trabalho 3 <span class="badge-soon">em breve</span></span></li>
        </ul>
      </nav>
    `;

    var pagina = location.pathname.split('/').pop();
    if (pagina == '') {
      pagina = 'index.html';
    }

    var links = this.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute('href') == pagina) {
        links[i].setAttribute('aria-current', 'page');
      }
    }
  }
}

class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="site-footer">
        <div class="container site-footer__inner">
          <div class="site-footer__meta">
            <strong>Paulo Vinícius Dornelles</strong>
            <span class="site-footer__course">Design de Interação · IFRS · 2026/2</span>
          </div>
          <nav class="site-footer__links">
            <a href="https://github.com/vinidornelles/Design-de-Interacao-1" target="_blank" rel="noopener noreferrer">Repositório no GitHub</a>
            <a href="index.html">Página inicial</a>
          </nav>
        </div>
      </footer>
    `;
  }
}

class CaixaAviso extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          max-width: 720px;
        }

        .caixa {
          margin-top: 24px;
          background: #eceafd;
          border-left: 5px solid #5b5bd6;
          border-radius: 12px;
          padding: 16px 20px;
        }

        .titulo {
          font-weight: 700;
          color: #4441b0;
          margin-bottom: 4px;
        }
      </style>

      <div class="caixa">
        <div class="titulo"><slot name="titulo">Aviso</slot></div>
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('site-header', SiteHeader);
customElements.define('site-nav', SiteNav);
customElements.define('site-footer', SiteFooter);
customElements.define('caixa-aviso', CaixaAviso);
