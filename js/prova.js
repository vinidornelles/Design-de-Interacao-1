var prova = {
  titulo: 'Prova de Desenvolvimento Web',
  questoes: [
    {
      pergunta: 'Qual linguagem é usada para criar a estrutura de uma página web?',
      alternativas: [
        'HTML',
        'CSS',
        'Python'
      ],
      correta: 0
    },
    {
      pergunta: 'Qual linguagem é usada para mudar as cores e o visual da página?',
      alternativas: [
        'JavaScript',
        'CSS',
        'HTML'
      ],
      correta: 1
    },
    {
      pergunta: 'Qual linguagem faz a página responder aos cliques do usuário?',
      alternativas: [
        'HTML',
        'CSS',
        'JavaScript'
      ],
      correta: 2
    },
    {
      pergunta: 'Qual destes programas é um navegador de internet?',
      alternativas: [
        'Google Chrome',
        'Microsoft Word',
        'Bloco de Notas'
      ],
      correta: 0
    }
  ]
};

class MinhaProva extends HTMLElement {
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
          scroll-margin-top: 110px;
        }

        * {
          box-sizing: border-box;
        }

        .prova {
          margin-top: 24px;
          background: #ffffff;
          border: 1px solid #d6d6e2;
          border-radius: 22px;
          padding: 24px;
        }

        h2 {
          margin: 0 0 20px;
          font-size: 1.5rem;
        }

        fieldset {
          border: 0;
          padding: 0;
          margin: 0 0 24px;
          min-width: 0;
        }

        legend {
          padding: 0;
          font-weight: 600;
        }

        .alternativa {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 8px;
          padding: 0 14px;
          border: 1px solid #d6d6e2;
          border-radius: 12px;
        }

        .alternativa:hover {
          background: #eceafd;
        }

        input {
          width: 18px;
          height: 18px;
          margin: 0;
          flex-shrink: 0;
          accent-color: #5b5bd6;
        }

        label {
          flex: 1;
          padding: 12px 0;
          cursor: pointer;
        }

        input:checked + label {
          font-weight: 600;
          color: #4441b0;
        }

        button {
          font: inherit;
          font-weight: 600;
          color: #ffffff;
          background: #1b2340;
          border: 0;
          border-radius: 999px;
          padding: 12px 28px;
          cursor: pointer;
        }

        button:hover {
          background: #5b5bd6;
        }

        p {
          margin: 4px 0;
        }

        .erro {
          min-height: 1.5em;
          margin-bottom: 12px;
          font-weight: 600;
          color: #b3261e;
        }

        .nota {
          font-size: 1.4rem;
        }

        .correcao {
          margin: 16px 0;
          padding: 12px 16px;
          border-left: 5px solid;
          border-radius: 8px;
        }

        .correcao h3 {
          margin: 0 0 6px;
          font-size: 1rem;
        }

        .certa {
          background: #e4f7ef;
          border-color: #29b087;
        }

        .errada {
          background: #fbe9e6;
          border-color: #e2583e;
        }

        @media (max-width: 480px) {
          .prova {
            padding: 16px;
          }

          button {
            width: 100%;
          }
        }
      </style>

      <div class="prova"></div>
    `;

    this.caixa = this.shadowRoot.querySelector('.prova');
    this.mostrarProva();
  }

  mostrarProva() {
    var html = `<h2>${prova.titulo}</h2><form>`;

    for (var q = 0; q < prova.questoes.length; q++) {
      var questao = prova.questoes[q];

      html += `<fieldset><legend>${q + 1}. ${questao.pergunta}</legend>`;

      for (var a = 0; a < questao.alternativas.length; a++) {
        var id = 'q' + q + 'a' + a;

        html += `
          <div class="alternativa">
            <input type="radio" name="q${q}" id="${id}" value="${a}">
            <label for="${id}">${questao.alternativas[a]}</label>
          </div>
        `;
      }

      html += '</fieldset>';
    }

    html += `
        <p class="erro" role="alert"></p>
        <button type="submit">Corrigir prova</button>
      </form>
    `;

    this.caixa.innerHTML = html;

    this.caixa.querySelector('form').addEventListener('submit', (evento) => {
      evento.preventDefault();
      this.corrigir();
    });
  }

  corrigir() {
    var acertos = 0;
    var html = '';

    for (var q = 0; q < prova.questoes.length; q++) {
      var questao = prova.questoes[q];
      var marcada = this.caixa.querySelector('input[name="q' + q + '"]:checked');

      if (marcada == null) {
        this.caixa.querySelector('.erro').textContent = 'Falta responder a questão ' + (q + 1) + '.';
        this.caixa.querySelector('input[name="q' + q + '"]').focus();
        return;
      }

      var resposta = Number(marcada.value);
      var classe = 'errada';
      var situacao = 'Errou';

      if (resposta == questao.correta) {
        acertos++;
        classe = 'certa';
        situacao = 'Acertou';
      }

      html += `
        <div class="correcao ${classe}">
          <h3>${q + 1}. ${questao.pergunta}</h3>
          <p><strong>${situacao}.</strong> Você respondeu: ${questao.alternativas[resposta]}</p>
          <p>Resposta correta: ${questao.alternativas[questao.correta]}</p>
        </div>
      `;
    }

    var nota = (acertos / prova.questoes.length) * 10;

    this.caixa.innerHTML = `
      <h2>Resultado</h2>
      <p class="nota">Nota: <strong>${nota.toFixed(1)}</strong></p>
      <p>Você acertou ${acertos} de ${prova.questoes.length} questões.</p>
      ${html}
      <button type="button">Responder novamente</button>
    `;

    this.caixa.querySelector('button').addEventListener('click', () => {
      this.mostrarProva();
      this.scrollIntoView();
    });

    this.scrollIntoView();
  }
}

customElements.define('minha-prova', MinhaProva);
