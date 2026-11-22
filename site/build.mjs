import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cities, services } from './content.mjs';

const origin = 'https://dropflow.tec.br';
const contact = 'https://wa.me/5547997676672';
const pages = new Map();
const servicePath = (service) => '/servicos/' + service.slug + '/';
const cityPath = (city) => '/cidades/' + city.slug + '/';
const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const org = { '@type': 'Organization', '@id': origin + '/#organizacao', name: 'DropFlow', url: origin };
const cityLink = (city) => '<a href="' + cityPath(city) + '">' + city.name + '</a>';
const list = (items) => '<ul class="points">' + items.map((item) => '<li>' + item + '</li>').join('') + '</ul>';

const serviceCards = (items) => '<div class="cards">' + items.map((item) => `
  <article class="card"><span class="icon" aria-hidden="true">${item.icon}</span>
  <h3><a href="${servicePath(item)}">${item.name}</a></h3><p>${item.description}</p>
  <a class="detail" aria-label="Ver escopo de ${item.name}" href="${servicePath(item)}">Ver escopo</a></article>`).join('') + '</div>';

const cityCards = (items) => '<div class="cards city-cards">' + items.map((item) => `
  <article class="card"><p class="tag">Santa Catarina</p><h3>${cityLink(item)}</h3>
  <p>${item.description}</p></article>`).join('') + '</div>';

const closing = `<section class="closing"><div><h2>Qual processo precisa funcionar melhor?</h2>
  <p>Conte quais ferramentas sua equipe usa e onde o trabalho fica parado.</p></div>
  <a class="button" href="/contato/">Pedir diagnóstico</a></section>`;

function addPage(path, title, description, body, parents = [], schema = []) {
  const canonical = origin + path;
  const crumbs = path === '/' ? [] : [['Início', '/'], ...parents, [title, path]];
  const breadcrumbs = crumbs.length ? '<nav class="crumbs" aria-label="Caminho da página">' +
    crumbs.map(([label, url], index) => index === crumbs.length - 1
      ? '<span aria-current="page">' + escape(label) + '</span>'
      : '<a href="' + url + '">' + escape(label) + '</a>').join('<span aria-hidden="true">/</span>') + '</nav>' : '';
  const graph = [org, ...schema];
  if (crumbs.length) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map(([name, url], index) => ({
        '@type': 'ListItem', position: index + 1, name, item: origin + url
      }))
    });
  }
  pages.set(path, `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escape(title)} | DropFlow</title>
  <meta name="description" content="${escape(description)}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:locale" content="pt_BR"><meta property="og:type" content="website">
  <meta property="og:title" content="${escape(title)} | DropFlow">
  <meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${canonical}">
  <link rel="icon" href="/icon.svg" type="image/svg+xml"><link rel="stylesheet" href="/styles.css">
  <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replaceAll('<', '\\u003c')}</script>
</head>
<body>
  <a class="skip" href="#conteudo">Pular para o conteúdo</a>
  <header class="header"><div class="wrap nav">
    <a class="brand" href="/"><span class="mark" aria-hidden="true">↗</span>Drop<span>Flow</span></a>
    <nav aria-label="Navegação principal"><a href="/servicos/">Serviços</a><a href="/cidades/">Cidades</a><a href="/#metodo">Como trabalhamos</a></nav>
    <a class="button button-small" href="/contato/">Fale com a equipe</a>
  </div></header>
  <main id="conteudo" class="wrap">${breadcrumbs}${body}</main>
  <footer class="footer"><div class="wrap footer-row"><a class="brand" href="/"><span class="mark" aria-hidden="true">↗</span>Drop<span>Flow</span></a>
    <nav aria-label="Links do rodapé"><a href="/servicos/">Serviços</a><a href="/cidades/">Áreas atendidas</a><a href="/contato/">Contato</a><a href="https://dropflow.com.br/">DropFlow institucional</a></nav></div></footer>
</body></html>`);
}

const intro = (title, description) => `<section class="intro"><h1>${title}</h1><p class="lead">${description}</p></section>`;

addPage('/', 'Automação, integração de sistemas e IA para empresas',
  'A DropFlow conecta sistemas, automatiza processos e implanta agentes de IA para empresas. Conheça os serviços e solicite um diagnóstico.',
  `<section class="hero">
    <div><p class="eyebrow"><span></span> Tecnologia para empresas</p>
    <h1>Uma operação<br>mais <em>conectada.</em></h1>
    <p class="lead">Automatize processos, integre seus sistemas e implante IA onde ela ajuda sua equipe a trabalhar melhor.</p>
    <div class="actions"><a class="button" href="/contato/">Pedir diagnóstico</a><a class="button secondary" href="/servicos/">Explorar serviços</a></div></div>
    <figure class="workflow"><figcaption><span aria-hidden="true">●</span> Exemplo de fluxo comercial</figcaption>
      <ol><li><span class="step-icon" aria-hidden="true">◎</span><div><strong>Novo contato</strong><small>Formulário ou WhatsApp</small></div></li>
      <li><span class="step-icon" aria-hidden="true">↻</span><div><strong>Triagem e encaminhamento</strong><small>Regras de atendimento ou agente de IA</small></div></li>
      <li><span class="step-icon" aria-hidden="true">▥</span><div><strong>Oportunidade registrada</strong><small>CRM, responsável e acompanhamento</small></div></li></ol>
    </figure>
  </section>
  <section class="section"><div class="section-head"><h2>O que podemos implantar</h2><p>Comece pelo processo que mais toma tempo ou dificulta acompanhar os resultados.</p></div>${serviceCards(services)}</section>
  <section class="section method" id="metodo"><div class="section-head"><h2>Do diagnóstico à operação</h2></div>
    <ol class="method-list"><li><h3>Entender o fluxo</h3><p>Mapear pessoas, ferramentas e pontos de retrabalho.</p></li>
    <li><h3>Implantar por etapas</h3><p>Começar pelo fluxo prioritário, testar exceções e validar a entrega com a equipe.</p></li>
    <li><h3>Acompanhar o uso</h3><p>Observar os resultados da primeira versão e avaliar as próximas melhorias.</p></li></ol></section>
  <section class="section"><div class="section-head"><h2>Atendimento no Vale do Itajaí</h2><a href="/cidades/">Explorar áreas atendidas</a></div>${cityCards(cities)}</section>
  ${closing}`);

addPage('/servicos/', 'Serviços de tecnologia para empresas',
  'Veja o escopo dos serviços da DropFlow em automação, integrações, inteligência artificial, software, dados e operação comercial.',
  intro('Serviços de tecnologia para empresas', 'Explore soluções para simplificar rotinas, conectar ferramentas e organizar as informações que a equipe usa para decidir.') +
  serviceCards(services) + closing);

for (const service of services) {
  const related = services.filter((candidate) => candidate !== service).slice(0, 3);
  addPage(servicePath(service), service.name, service.description,
    intro(service.name, service.description) + `<section class="section split"><div><h2>O que pode entrar no projeto</h2>${list(service.examples)}</div>
    <div class="panel"><h2>O que avaliamos no diagnóstico</h2><p>${service.scope}</p></div></section>
    <section class="section"><h2>Serviços relacionados</h2>${serviceCards(related)}</section>` + closing,
    [['Serviços', '/servicos/']], [{ '@type': 'Service', name: service.name, description: service.description, provider: { '@id': org['@id'] } }]);
}

for (const [path, title, description, parents] of [
  ['/cidades/', 'Áreas atendidas pela DropFlow', 'Conheça as soluções de automação, integração de sistemas e IA da DropFlow em Timbó, Blumenau e Indaial.', []],
  ['/cidades/sc/', 'Tecnologia para empresas em Santa Catarina', 'Conheça as soluções da DropFlow para empresas em Santa Catarina e veja as aplicações em Timbó, Blumenau e Indaial.', [['Cidades', '/cidades/']]]
]) {
  const content = path === '/cidades/'
    ? '<section class="panel region"><h2>Santa Catarina</h2><p>Veja como automação, integração e IA podem se aplicar à sua operação no Vale do Itajaí.</p><a href="/cidades/sc/">Explorar cidades de Santa Catarina</a></section>'
    : '<section class="panel region"><h2>Como funciona o atendimento</h2><p>O diagnóstico pode começar on-line. Durante o planejamento, a equipe avalia volumes, sistemas envolvidos e etapas de implantação.</p></section>';
  addPage(path, title, description, intro(title, description) + content +
    '<section class="section"><h2>Escolha sua cidade</h2>' + cityCards(cities) + '</section>' + closing, parents,
    [{ '@type': 'CollectionPage', name: title, mainEntity: { '@type': 'ItemList', itemListElement: cities.map((city, index) => ({
      '@type': 'ListItem', position: index + 1, name: city.name, url: origin + cityPath(city)
    })) } }]);
}

for (const city of cities) {
  const title = city.focus + ' em ' + city.name;
  const localServices = city.services.map((slug) => services.find((service) => service.slug === slug));
  addPage(cityPath(city), title, city.description, intro(title, city.description) +
    `<section class="section split"><div><h2>Por onde começar em ${city.name}</h2><p>${city.context}</p></div>
    <div class="panel"><h2>Exemplos de aplicação</h2>${list(city.scenarios)}</div></section>
    <section class="section"><h2>Soluções para empresas em ${city.name}</h2>${serviceCards(localServices)}</section>
    <section class="section"><h2>Atendimento em outras cidades</h2>${cityCards(cities.filter((item) => item !== city))}</section>` + closing,
    [['Cidades', '/cidades/'], ['Santa Catarina', '/cidades/sc/']],
    [{ '@type': 'Service', name: title, provider: { '@id': org['@id'] },
      areaServed: { '@type': 'City', name: city.name, containedInPlace: { '@type': 'State', name: 'Santa Catarina' } } }]);
}

addPage('/contato/', 'Contato e diagnóstico',
  'Fale com a equipe da DropFlow sobre automação, integração de sistemas, inteligência artificial e projetos de tecnologia.',
  intro('Vamos conversar sobre seu projeto', 'Para começar, conte o que a sua equipe faz hoje, quais ferramentas usa e onde precisa ganhar tempo ou visibilidade.') +
  `<section class="section split"><div class="panel"><h2>WhatsApp</h2><p>(47) 99767-6672</p>
  <a class="button" href="${contact}">Abrir conversa</a></div>
  <div class="panel"><h2>E-mail</h2><p><a href="mailto:contato@dropflow.com.br">contato@dropflow.com.br</a></p></div></section>`);

async function write(relativePath, content) {
  const file = fileURLToPath(new URL('../website/' + relativePath, import.meta.url));
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, content + '\n', 'utf8');
}

for (const [path, html] of pages) {
  await write(path.slice(1) + 'index.html', html);
}
await write('robots.txt', 'User-agent: *\nAllow: /\n\nSitemap: ' + origin + '/sitemap.xml');
await write('sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  [...pages.keys()].map((path) => '  <url><loc>' + origin + path + '</loc></url>').join('\n') + '\n</urlset>');
console.log(pages.size + ' páginas estáticas geradas.');
