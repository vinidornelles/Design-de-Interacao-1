var MAX_ITENS = 8;
var MIN_ITENS = 1;
var MAX_CARACTERES_ITEM = 24;
var MAX_TAMANHO_IMAGEM_MB = 2;

var itens = ['Início', 'Sobre', 'Contato'];
var imagemDataUrl = null;

var itemListEl, itemCountEl, addItemBtn, itemsErrorEl;
var imageInput, imageErrorEl, removeImageBtn, posTop, posSide;
var menuBgColor, itemBgColor, textColor, borderColor;
var fontSize, fontSizeValue;
var borderWidth, borderWidthValue, borderRadius, borderRadiusValue;
var itemPadding, itemPaddingValue, itemGap, itemGapValue;
var menuJustify, previewStage, form;

document.addEventListener('DOMContentLoaded', function () {
  buscarElementos();
  desenharListaItens();
  desenharPreVisualizacao();
  ligarEventos();
});

function buscarElementos() {
  itemListEl = document.getElementById('itemList');
  itemCountEl = document.getElementById('itemCount');
  addItemBtn = document.getElementById('addItemBtn');
  itemsErrorEl = document.getElementById('itemsError');

  imageInput = document.getElementById('imageInput');
  imageErrorEl = document.getElementById('imageError');
  removeImageBtn = document.getElementById('removeImageBtn');
  posTop = document.getElementById('posTop');
  posSide = document.getElementById('posSide');

  menuBgColor = document.getElementById('menuBgColor');
  itemBgColor = document.getElementById('itemBgColor');
  textColor = document.getElementById('textColor');
  borderColor = document.getElementById('borderColor');

  fontSize = document.getElementById('fontSize');
  fontSizeValue = document.getElementById('fontSizeValue');

  borderWidth = document.getElementById('borderWidth');
  borderWidthValue = document.getElementById('borderWidthValue');
  borderRadius = document.getElementById('borderRadius');
  borderRadiusValue = document.getElementById('borderRadiusValue');

  itemPadding = document.getElementById('itemPadding');
  itemPaddingValue = document.getElementById('itemPaddingValue');
  itemGap = document.getElementById('itemGap');
  itemGapValue = document.getElementById('itemGapValue');
  menuJustify = document.getElementById('menuJustify');

  previewStage = document.getElementById('previewStage');
  form = document.getElementById('menuEditorForm');
}

function desenharListaItens() {
  itemListEl.innerHTML = '';

  itens.forEach(function (texto, indice) {
    var linha = document.createElement('div');
    linha.className = 'item-row';

    var numero = document.createElement('span');
    numero.className = 'item-row__index';
    numero.textContent = String(indice + 1).padStart(2, '0');

    var idCampo = 'text-item-' + indice;

    var rotulo = document.createElement('label');
    rotulo.className = 'sr-only';
    rotulo.setAttribute('for', idCampo);
    rotulo.textContent = 'Texto do item ' + (indice + 1);

    var campoTexto = document.createElement('input');
    campoTexto.type = 'text';
    campoTexto.id = idCampo;
    campoTexto.value = texto;
    campoTexto.maxLength = MAX_CARACTERES_ITEM;
    campoTexto.addEventListener('input', function () {
      itens[indice] = campoTexto.value;
      desenharPreVisualizacao();
    });

    var botaoRemover = document.createElement('button');
    botaoRemover.type = 'button';
    botaoRemover.className = 'item-row__remove';
    botaoRemover.setAttribute('aria-label', 'Remover item ' + (indice + 1));
    botaoRemover.textContent = '\u00D7';
    botaoRemover.disabled = itens.length <= MIN_ITENS;
    botaoRemover.addEventListener('click', function () {
      itens.splice(indice, 1);
      desenharListaItens();
      desenharPreVisualizacao();
    });

    linha.appendChild(numero);
    linha.appendChild(rotulo);
    linha.appendChild(campoTexto);
    linha.appendChild(botaoRemover);
    itemListEl.appendChild(linha);
  });

  itemCountEl.textContent = String(itens.length);
  addItemBtn.disabled = itens.length >= MAX_ITENS;
  itemsErrorEl.textContent = itens.length >= MAX_ITENS
    ? 'Número máximo de itens atingido.'
    : '';
}

function adicionarItem() {
  if (itens.length >= MAX_ITENS) {
    return;
  }
  itens.push('Novo item');
  desenharListaItens();
  desenharPreVisualizacao();
}

function selecionarImagem() {
  var arquivo = imageInput.files && imageInput.files[0];
  imageErrorEl.textContent = '';

  if (!arquivo) {
    return;
  }

  if (arquivo.type.indexOf('image/') !== 0) {
    imageErrorEl.textContent = 'Selecione um arquivo de imagem válido.';
    imageInput.value = '';
    return;
  }

  if (arquivo.size > MAX_TAMANHO_IMAGEM_MB * 1024 * 1024) {
    imageErrorEl.textContent = 'A imagem deve ter no máximo ' + MAX_TAMANHO_IMAGEM_MB + 'MB.';
    imageInput.value = '';
    return;
  }

  var leitor = new FileReader();
  leitor.onload = function () {
    imagemDataUrl = leitor.result;
    removeImageBtn.disabled = false;
    desenharPreVisualizacao();
  };
  leitor.onerror = function () {
    imageErrorEl.textContent = 'Não foi possível carregar a imagem.';
  };
  leitor.readAsDataURL(arquivo);
}

function removerImagem() {
  imagemDataUrl = null;
  imageInput.value = '';
  removeImageBtn.disabled = true;
  imageErrorEl.textContent = '';
  desenharPreVisualizacao();
}

function atualizarValoresExibidos() {
  fontSizeValue.textContent = fontSize.value + 'px';
  borderWidthValue.textContent = borderWidth.value + 'px';
  borderRadiusValue.textContent = borderRadius.value + 'px';
  itemPaddingValue.textContent = itemPadding.value + 'px';
  itemGapValue.textContent = itemGap.value + 'px';
}

function desenharPreVisualizacao() {
  atualizarValoresExibidos();
  previewStage.innerHTML = '';

  var mostrarAoLado = Boolean(imagemDataUrl) && posSide.checked;
  previewStage.className = 'preview-stage' + (mostrarAoLado ? ' preview-stage--side' : '');

  if (imagemDataUrl) {
    var img = document.createElement('img');
    img.src = imagemDataUrl;
    img.alt = 'Imagem enviada para o menu';
    img.className = 'preview-image';
    previewStage.appendChild(img);
  }

  if (itens.length === 0) {
    var vazio = document.createElement('p');
    vazio.className = 'preview-empty';
    vazio.textContent = 'Adicione ao menos um item para ver o menu.';
    previewStage.appendChild(vazio);
    return;
  }

  var nav = document.createElement('nav');
  nav.className = 'generated-menu';
  nav.style.setProperty('--menu-bg', menuBgColor.value);
  nav.style.setProperty('--menu-radius', borderRadius.value + 'px');
  nav.style.setProperty('--menu-gap', itemGap.value + 'px');
  nav.style.setProperty('--menu-justify', menuJustify.value);

  var lista = document.createElement('ul');
  lista.className = 'generated-menu__list';

  var paddingV = parseInt(itemPadding.value, 10);
  var paddingH = Math.round(paddingV * 1.6);
  var raioItem = Math.max(0, parseInt(borderRadius.value, 10) - 2);

  itens.forEach(function (texto) {
    var li = document.createElement('li');
    var item = document.createElement('span');
    item.className = 'generated-menu__item';
    item.textContent = texto.trim() !== '' ? texto : '(vazio)';
    item.style.setProperty('--item-bg', itemBgColor.value);
    item.style.setProperty('--item-color', textColor.value);
    item.style.setProperty('--item-font-size', fontSize.value + 'px');
    item.style.setProperty('--item-padding', paddingV + 'px ' + paddingH + 'px');
    item.style.setProperty('--item-radius', raioItem + 'px');
    item.style.setProperty('--item-border-width', borderWidth.value + 'px');
    item.style.setProperty('--item-border-color', borderColor.value);
    li.appendChild(item);
    lista.appendChild(li);
  });

  nav.appendChild(lista);
  previewStage.appendChild(nav);
}

function ligarEventos() {
  addItemBtn.addEventListener('click', adicionarItem);
  imageInput.addEventListener('change', selecionarImagem);
  removeImageBtn.addEventListener('click', removerImagem);

  var camposAoVivo = [
    menuBgColor, itemBgColor, textColor, borderColor,
    fontSize,
    borderWidth, borderRadius,
    itemPadding, itemGap, menuJustify,
    posTop, posSide
  ];

  camposAoVivo.forEach(function (campo) {
    campo.addEventListener('input', desenharPreVisualizacao);
    campo.addEventListener('change', desenharPreVisualizacao);
  });

  form.addEventListener('submit', function (evento) {
    evento.preventDefault();
  });
}