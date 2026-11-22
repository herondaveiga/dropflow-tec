export const services = [
  {
    slug: 'automacao-de-processos', name: 'Automação de processos', icon: '↻',
    description: 'Transforme tarefas manuais e repetitivas em fluxos acompanháveis, da entrada de uma solicitação à entrega.',
    examples: ['Aprovar propostas e alertar responsáveis', 'Automatizar follow-up, prazos e lembretes', 'Consolidar planilhas e gerar relatórios recorrentes'],
    scope: 'Mapeamos gatilhos, critérios de decisão e exceções. O fluxo pode incluir aprovação humana, histórico de execução e alertas para falhas.'
  },
  {
    slug: 'integracao-de-sistemas', name: 'Integração de sistemas', icon: '↔',
    description: 'Conecte ERP, CRM, WhatsApp, formulários e bases de dados para que a informação circule entre as ferramentas que sua equipe usa.',
    examples: ['Enviar leads do formulário para o CRM', 'Sincronizar clientes e pedidos entre ERP e outros sistemas', 'Receber eventos via webhook e encaminhar atualizações'],
    scope: 'Verificamos disponibilidade de APIs, autenticação e qualidade dos dados. O projeto define o sistema de referência, as regras para duplicatas e o que acontece quando uma atualização falha.'
  },
  {
    slug: 'agentes-de-ia', name: 'Agentes de inteligência artificial', icon: '✦',
    description: 'Implante agentes para atendimento, triagem e qualificação de leads, com regras de operação e passagem para a equipe.',
    examples: ['Responder perguntas com base em conteúdo aprovado', 'Coletar contexto antes de encaminhar um atendimento', 'Classificar solicitações e sugerir o próximo passo'],
    scope: 'Definimos as fontes que o agente pode consultar, os assuntos que exigem atendimento humano e os cenários de teste antes da implantação.'
  },
  {
    slug: 'sistemas-sob-medida', name: 'Sistemas e aplicativos', icon: '▣',
    description: 'Estruture sistemas web, portais internos e aplicativos em torno das regras e dos fluxos da sua operação.',
    examples: ['Portal de solicitações e aprovações', 'Área do cliente com acesso a documentos', 'Interface de operação integrada a um sistema existente'],
    scope: 'Avaliamos usuários, permissões, formatos de acesso e integrações. A primeira versão começa pelos fluxos essenciais, com entregas definidas no diagnóstico.'
  },
  {
    slug: 'dados-e-dashboards', name: 'Dados e dashboards', icon: '▥',
    description: 'Reúna indicadores comerciais e operacionais para acompanhar o que acontece entre o primeiro contato e a entrega.',
    examples: ['Acompanhar leads por origem e etapa', 'Consolidar dados de vendas e atendimento', 'Monitorar prazos, volumes e gargalos'],
    scope: 'Identificamos as fontes, a definição de cada indicador, a frequência de atualização e as pessoas que precisam acessar o painel.'
  },
  {
    slug: 'whatsapp-e-crm', name: 'WhatsApp, CRM e funis', icon: '◎',
    description: 'Organize conversas, distribuição de leads e acompanhamento comercial em um fluxo que a equipe consegue operar.',
    examples: ['Distribuir novos contatos entre responsáveis', 'Organizar etapas e lembretes no funil', 'Integrar conversas a registros e indicadores comerciais'],
    scope: 'O diagnóstico define canais, responsabilidades e regras de encaminhamento. A implantação pode aproveitar o CRM existente ou avaliar o CRMWhats.'
  },
  {
    slug: 'sites-e-portais', name: 'Sites e portais digitais', icon: '◫',
    description: 'Planeje sites, landing pages e portais com uma jornada clara e conexões com o atendimento comercial.',
    examples: ['Landing page com captação no CRM', 'Site institucional com páginas de serviços', 'Portal integrado a formulários e dados internos'],
    scope: 'Definimos conteúdo, navegação, acessibilidade, desempenho e pontos de conversão. Integrações com marketing e mensuração entram conforme o escopo.'
  },
  {
    slug: 'modernizacao-e-sustentacao', name: 'Modernização e sustentação', icon: '◈',
    description: 'Planeje a evolução de sistemas existentes e os cuidados técnicos para manter os fluxos implantados em operação.',
    examples: ['Avaliar uma migração por etapas', 'Definir integrações para manter dados sincronizados', 'Planejar monitoramento, acesso e recuperação'],
    scope: 'Infraestrutura, segurança, backups e suporte são avaliados no contexto do projeto. O escopo depende dos sistemas existentes e da responsabilidade de cada fornecedor.'
  }
];

export const cities = [
  {
    slug: 'timbo', name: 'Timbó', focus: 'Automação de processos',
    description: 'Projetos de automação, integração e IA para empresas em Timbó. Organize solicitações, conecte ferramentas e acompanhe o fluxo comercial.',
    context: 'Se o atendimento começa no WhatsApp e o restante do processo depende de planilhas ou repasses manuais, o primeiro projeto pode conectar esses pontos. Em Timbó, a DropFlow pode avaliar um fluxo completo, do contato recebido ao registro da proposta.',
    scenarios: ['Receber uma solicitação e criar a oportunidade com responsável no CRM.', 'Enviar a proposta para aprovação e agendar o retorno ao cliente.', 'Acompanhar oportunidades paradas e definir quando a equipe deve agir.'],
    services: ['automacao-de-processos', 'whatsapp-e-crm', 'integracao-de-sistemas']
  },
  {
    slug: 'blumenau', name: 'Blumenau', focus: 'Integração de sistemas',
    description: 'Integração de CRM, ERP, formulários e WhatsApp para empresas em Blumenau, com automação comercial e acompanhamento de indicadores.',
    context: 'Em operações que usam ferramentas diferentes para aquisição, atendimento e vendas, o diagnóstico começa descobrindo onde os registros se perdem ou se duplicam. Um projeto em Blumenau pode priorizar a integração entre esses sistemas e uma visão comum do funil.',
    scenarios: ['Registrar a origem de um lead do formulário até o fechamento.', 'Vincular conversas de atendimento a contatos e oportunidades já existentes.', 'Consolidar indicadores de marketing e vendas com uma definição comum.'],
    services: ['integracao-de-sistemas', 'whatsapp-e-crm', 'dados-e-dashboards']
  },
  {
    slug: 'indaial', name: 'Indaial', focus: 'Automação de rotinas operacionais',
    description: 'Automação de rotinas operacionais e integração com ERP para empresas em Indaial, com acompanhamento de solicitações e prazos.',
    context: 'Quando compras, estoque ou atendimento interno dependem de lançamentos manuais em vários lugares, o diagnóstico pode começar por um único fluxo operacional. Em Indaial, o projeto pode partir de solicitações, aprovações e atualizações no ERP.',
    scenarios: ['Receber solicitações internas e registrar quem aprovou cada etapa.', 'Sincronizar o status de um pedido com as equipes que acompanham a entrega.', 'Acompanhar atrasos e exceções em um painel operacional.'],
    services: ['automacao-de-processos', 'integracao-de-sistemas', 'dados-e-dashboards']
  }
];
