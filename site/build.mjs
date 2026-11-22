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
const featuredSolutions = [
  ['automacao-de-processos', 'operacao.webp'],
  ['integracao-de-sistemas', 'sistemas.webp'],
  ['agentes-de-ia', 'atendimento.webp'],
  ['sistemas-sob-medida', null]
];

const featuredCards = '<div class="featured-grid">' + featuredSolutions.map(([slug, photo]) => {
  const service = services.find((item) => item.slug === slug);
  return `<a class="featured-card" href="${servicePath(service)}">
    <div><span class="icon" aria-hidden="true">${service.icon}</span><h3>${service.name}</h3><p>${service.description}</p><span class="detail">Ver serviço</span></div>${photo ? `
    <img src="/images/${photo}" width="850" height="500" alt="" loading="lazy">` : ''}
  </a>`;
}).join('') + '</div>';

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
<body${path === '/' ? ' class="home"' : ''}>
  <a class="skip" href="#conteudo">Pular para o conteúdo</a>
  <header class="header"><div class="wrap nav">
    <a class="brand" href="/"><span class="mark" aria-hidden="true">↗</span>Drop<span>Flow</span></a>
    <nav aria-label="Navegação principal"><a href="/servicos/">Serviços</a><a href="/cidades/">Cidades</a><a href="/#metodo">Como trabalhamos</a></nav>
    <a class="button button-small" href="/contato/">Fale com a equipe</a>
  </div></header>
  <main id="conteudo"${path === '/' ? '' : ' class="wrap"'}>${breadcrumbs}${body}</main>
  <footer class="footer"><div class="wrap footer-row"><a class="brand" href="/"><span class="mark" aria-hidden="true">↗</span>Drop<span>Flow</span></a>
    <nav aria-label="Links do rodapé"><a href="/servicos/">Serviços</a><a href="/cidades/">Áreas atendidas</a><a href="/contato/">Contato</a><a href="https://dropflow.com.br/">DropFlow institucional</a></nav></div></footer>
</body></html>`);
}

const intro = (title, description) => `<section class="intro"><h1>${title}</h1><p class="lead">${description}</p></section>`;

addPage('/', 'Automação, integração de sistemas e IA para empresas',
  'A DropFlow conecta sistemas, automatiza processos e implanta agentes de IA para empresas. Conheça os serviços e solicite um diagnóstico.',
  `<section class="hero">
    <div class="wrap hero-content">
      <div>
        <h1>Automação e integração <em>para empresas.</em></h1>
        <p class="lead">Pare de redigitar dados, procurar conversas e cobrar o próximo passo. Conectamos ERP, CRM e WhatsApp para sua equipe acompanhar o trabalho do primeiro contato à entrega.</p>
        <div class="actions"><a class="button" href="/contato/">Pedir diagnóstico</a><a class="button secondary" href="#solucoes">Ver o que podemos resolver</a></div>
        <p class="contact-note">A primeira conversa serve para entender seu processo e identificar por onde começar.</p>
      </div>
      <div class="hero-media"><img class="hero-photo" src="/images/infraestrutura.webp" width="1600" alt="" fetchpriority="high"></div>
    </div>
  </section>
  <div class="wrap">
  <section class="section" aria-labelledby="gargalos">
    <div class="section-head"><h2 id="gargalos">Onde sua equipe perde tempo hoje?</h2></div>
    <div class="cards problem-cards">
      <article class="card"><h3>O lead chega e fica sem retorno</h3><p>Organize quem assume cada conversa, onde ela fica registrada e quando cobrar o próximo passo.</p><a href="/servicos/whatsapp-e-crm/">Organizar atendimento e vendas</a></article>
      <article class="card"><h3>O mesmo dado é digitado duas vezes</h3><p>Defina qual sistema é a fonte da informação e sincronize os dados que outras equipes precisam usar.</p><a href="/servicos/integracao-de-sistemas/">Conectar sistemas</a></article>
      <article class="card"><h3>Toda semana alguém monta o mesmo relatório</h3><p>Reúna as fontes e acompanhe indicadores sem depender de uma nova exportação a cada reunião.</p><a href="/servicos/dados-e-dashboards/">Organizar dados e indicadores</a></article>
    </div>
  </section>
  <section class="section home-solutions" id="solucoes"><div class="section-head"><h2>Soluções para sua operação</h2><a href="/servicos/">Ver todos os serviços</a></div>
    ${featuredCards}
    <ul class="service-list">${services.filter((service) => !featuredSolutions.some(([slug]) => slug === service.slug)).map((service) =>
      `<li><a href="${servicePath(service)}">${service.name}</a></li>`).join('')}</ul>
  </section>
  <section class="section split" aria-labelledby="exemplo">
    <div><h2 id="exemplo">Do WhatsApp à próxima ação no CRM</h2><p>Imagine um orçamento que chega pelo WhatsApp, é repassado por mensagem e acaba numa planilha. Quem recebeu sabe do pedido, mas o restante da equipe pode perder o prazo sem perceber.</p><p>Este exemplo mostra como a DropFlow pode estruturar esse fluxo. A implantação depende do volume, das regras e das ferramentas do seu time.</p><a href="/servicos/whatsapp-e-crm/">Conhecer a solução de WhatsApp e CRM</a></div>
    <div class="panel"><h3>Como o fluxo pode funcionar</h3><ol class="points"><li>O contato é identificado e a oportunidade é registrada no CRM.</li><li>A solicitação é encaminhada com histórico e responsável.</li><li>Se o prazo passar, a equipe recebe um aviso para retomar o atendimento.</li></ol></div>
  </section>
  <section class="section method" id="metodo"><div class="section-head"><h2>Do diagnóstico à operação</h2></div>
    <ol class="method-list"><li><h3>Escolher o gargalo</h3><p>Mapeamos como o trabalho acontece hoje e definimos uma primeira entrega com sua equipe.</p></li>
    <li><h3>Testar antes de ampliar</h3><p>Validamos o fluxo com cenários reais, incluindo o que fazer quando uma integração falha ou o atendimento exige alguém da equipe.</p></li>
    <li><h3>Acompanhar o uso</h3><p>Combinamos o que observar depois da implantação, como tempo de resposta, retrabalho ou solicitações fora do prazo.</p></li></ol></section>
  <section class="section split" aria-labelledby="tecnologia"><div><h2 id="tecnologia">Tecnologia que se encaixa no seu fluxo</h2><p>O diagnóstico identifica quais conexões são viáveis e o que precisa de desenvolvimento sob medida.</p></div>
    <div class="panel"><ul class="points"><li><strong>APIs e webhooks</strong> para trocar dados entre ERP, CRM e outras ferramentas.</li><li><strong>n8n</strong> para automatizar rotinas e encaminhar exceções.</li><li><strong>Agentes de IA</strong> para triagem e atendimento com passagem para uma pessoa.</li></ul></div></section>
  <section class="section"><div class="section-head"><h2>Atendimento no Vale do Itajaí</h2><a href="/cidades/">Explorar áreas atendidas</a></div>${cityCards(cities)}</section>
  <section class="section faq" aria-labelledby="duvidas"><h2 id="duvidas">Perguntas frequentes</h2>
    <div><details><summary>Preciso trocar os sistemas que já uso?</summary><p>O diagnóstico começa pelas ferramentas atuais. Se elas disponibilizarem APIs ou outra forma segura de integração, podemos conectá-las ao fluxo.</p></details>
    <details><summary>Posso começar automatizando um único processo?</summary><p>Sim. Podemos começar por uma rotina prioritária, testar exceções com a equipe e usar o resultado para planejar as próximas etapas.</p></details>
    <details><summary>Quanto custa e quanto tempo leva?</summary><p>O escopo depende dos sistemas envolvidos, do volume e das regras do processo. No diagnóstico, levantamos esses pontos para estimar a primeira etapa e o que ela inclui.</p></details>
    <details><summary>E se o agente de IA não souber responder?</summary><p>O projeto define quais fontes o agente pode consultar e em que situações ele deve encaminhar a conversa para a equipe.</p></details>
    <details><summary>O que devo levar para o diagnóstico?</summary><p>Descreva o processo, quem participa dele e quais sistemas são usados. Exemplos de atrasos ou retrabalho ajudam a definir o primeiro passo.</p></details></div>
  </section>
  <section class="closing"><div><h2>Qual processo você quer resolver primeiro?</h2><p>Conte onde a rotina trava e quais sistemas sua equipe usa. Esse é o ponto de partida para o diagnóstico.</p></div><a class="button" href="/contato/">Conversar com a DropFlow</a></section></div>`);

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
