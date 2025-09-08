let paisesFiltrados = [...countries];//todos
let paginaAtual = 1;
const container = document.querySelector('.mostra-paises');
const selectRegiao = document.getElementById('regiao');
const inputTamPagina = document.getElementById('tam-pagina');
const btnVoltar = document.getElementById('volta-pag');
const btnAvancar = document.getElementById('avanca-pag');
const contadorPag = document.getElementById('contador-pag');
const totalSpan = document.getElementById('total-paises-centro');
const inputBusca = document.getElementById('nome-pais');//busca

let tamanhoPagina = Number(inputTamPagina.value);

//mapa das regioes
const mapaRegioes = {
  'america-norte': 'NA',
  'america-sul': 'SA',
  'europa': 'EU',
  'asia': 'AS',
  'oceania': 'OC',
  'africa': 'AF',
  'outros': 'OUTROS',
};

function mostrarPaises(listaPaises) {//essa funcao cria a parte onde vai ficar os países atraves do array de objetos listapaises

  container.innerHTML = '';//limpa lista atual

  listaPaises.forEach(pais => {
    const divPais = document.createElement('div');
    divPais.classList.add('pais');

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('info-pais');

    const nome = document.createElement('p');
    nome.textContent = `Nome: ${pais.name} (${pais.code})`;

    const capital = document.createElement('p');
    capital.textContent = `Capital: ${pais.capital}`;

    const regiao = document.createElement('p');
    regiao.textContent = `Região: ${pais.region}`;

    const moeda = document.createElement('p');
    moeda.textContent = `${pais.currency.symbol || ''} - Moeda: ${pais.currency.name} (${pais.currency.code})`;

    const idioma = document.createElement('p');
    idioma.textContent = `Idioma: ${pais.language.name} (${pais.language.code})`;

    infoDiv.append(nome, capital, regiao, moeda, idioma);

    const divImg = document.createElement('div');
    divImg.classList.add('bandeira-pais');

    const img = document.createElement('img');
    img.src = `flags/${pais.code}.png`;
    img.alt = `Bandeira de ${pais.name}`;
    img.classList.add('img-bandeira');


    const isBloco = container.classList.contains('bloco');
    img.style.width = isBloco ? '64px' : '128px';//if else pra saber se a img da bandeira vai diminuir ou nao

    divImg.appendChild(img);

    divPais.append(infoDiv, divImg);
    container.appendChild(divPais);
  });
}

function mostrarPagina() {
  const totalPaises = paisesFiltrados.length;
  const totalPaginas = Math.ceil(totalPaises / tamanhoPagina);

  if (paginaAtual > totalPaginas) paginaAtual = totalPaginas;
  if (paginaAtual < 1) paginaAtual = 1;

  const inicio = (paginaAtual - 1) * tamanhoPagina;
  const fim = inicio + tamanhoPagina;

  const paisesParaMostrar = paisesFiltrados.slice(inicio, fim);

  mostrarPaises(paisesParaMostrar);

  contadorPag.textContent = `Página ${paginaAtual} de ${totalPaginas || 1}`;
  btnVoltar.disabled = paginaAtual === 1;
  btnAvancar.disabled = paginaAtual === totalPaginas || totalPaginas === 0;

  totalSpan.textContent = `Total de países encontrados: ${totalPaises} país(es)`;
}

function aplicarFiltro() {
  const valorSelecionado = selectRegiao.value.toLowerCase();
  const busca = inputBusca.value.trim().toLowerCase();

  paisesFiltrados = countries.filter(pais => {
    const codigoRegiaoSelecionada = mapaRegioes[valorSelecionado] || 'OUTROS';

    const codigoRegiaoPais = (pais.region || '').substring(0, 2).toUpperCase();//pega as iniciais pra estar de acordo com o map

    const regioesConhecidas = Object.values(mapaRegioes).filter(c => c !== 'OUTROS');

    const paisEhOutros = !codigoRegiaoPais || !regioesConhecidas.includes(codigoRegiaoPais); // se retorna null ou se nao ta no mapa, retorna true

    // filtra pela regiao
    let regiaoValida;
    if (valorSelecionado === 'todas') {
      regiaoValida = true;
    } 

    else if (codigoRegiaoSelecionada === 'OUTROS') {
      regiaoValida = paisEhOutros;
    } 

    else {
      regiaoValida = codigoRegiaoPais === codigoRegiaoSelecionada;
    }

    //filtra pelo nome do pais
    const nomeValido = pais.name.toLowerCase().includes(busca);

    return regiaoValida && nomeValido;
  });

  paginaAtual = 1;
  mostrarPagina();
}


document.addEventListener('DOMContentLoaded', () => {
  aplicarFiltro();

  selectRegiao.addEventListener('change', aplicarFiltro);//quando os selects ou input mudam, aplicam o filtro
  inputBusca.addEventListener('input', aplicarFiltro);

  inputTamPagina.addEventListener('change', () => {
    let val = Number(inputTamPagina.value);
    if (isNaN(val) || val < 1) val = 1;
    if (val > 249) val = 249;
    tamanhoPagina = val;
    aplicarFiltro();
  });

  btnVoltar.addEventListener('click', () => {
    if (paginaAtual > 1) {
      paginaAtual--;
      mostrarPagina();
    }
  });

  const btnLista = document.querySelector('.botao-lista');
  const btnBloco = document.querySelector('.botao-bloco');

  btnLista.addEventListener('click', () => {
    container.classList.add('lista');
    container.classList.remove('bloco');
    mostrarPagina();//atualiza as bandeiras para 128px
  });

  btnBloco.addEventListener('click', () => {
    container.classList.add('bloco');
    container.classList.remove('lista');
    mostrarPagina();//atualiza as bandeiras para 64px
  });


  btnAvancar.addEventListener('click', () => {
    const totalPaginas = Math.ceil(paisesFiltrados.length / tamanhoPagina);
    if (paginaAtual < totalPaginas) {
      paginaAtual++;
      mostrarPagina();
    }
  });
});
