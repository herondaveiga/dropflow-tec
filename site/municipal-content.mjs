const profiles = [
  {
    name: 'Agropecuária',
    focus: 'Automação de pedidos e entregas',
    context: 'Se a sua empresa recebe pedidos de insumos ou coleta dados de produção fora do escritório, mapeie quem registra cada informação e em que momento ela precisa chegar ao sistema central.',
    scenarios: ['Registrar pedidos de insumos com unidade, quantidade, destino e prazo.', 'Sincronizar disponibilidade com o ERP antes de confirmar a entrega.', 'Alertar a equipe quando houver divergência entre coleta, estoque e faturamento.'],
    services: ['automacao-de-processos', 'integracao-de-sistemas', 'dados-e-dashboards'],
    preparation: 'Separe um pedido que saiu no prazo e outro que precisou de correção. Compare os dados disponíveis no campo, no estoque e no faturamento.',
    measure: 'Meça o tempo entre o registro de um pedido e a confirmação da entrega e conte quantos registros precisam de ajuste manual.'
  },
  {
    name: 'Indústria',
    focus: 'Integração de sistemas para operações industriais',
    context: 'Se produção, compras e expedição consultam planilhas diferentes, comece por um evento que todas as equipes precisam enxergar, como a liberação de um pedido ou sua mudança de etapa.',
    scenarios: ['Atualizar o status do pedido a partir do evento registrado no ERP.', 'Encaminhar bloqueios de qualidade ou falta de insumos à equipe responsável.', 'Acompanhar o tempo de parada e as ordens em atraso por etapa.'],
    services: ['integracao-de-sistemas', 'automacao-de-processos', 'dados-e-dashboards'],
    preparation: 'Escolha uma ordem que passou por compras, produção e expedição e anote os momentos em que cada equipe tomou conhecimento da mudança.',
    measure: 'Meça quanto tempo leva para uma mudança de status chegar à equipe seguinte e quantas ordens ficam sem atualização.'
  },
  {
    name: 'Serviços',
    focus: 'Automação de atendimento e vendas',
    context: 'Se solicitações chegam de canais diferentes, acompanhe uma conversa completa desde sua origem até a proposta ou o atendimento concluído. Observe onde a equipe precisa repetir dados ou perde o prazo de retorno.',
    scenarios: ['Transformar mensagens e formulários em oportunidades no CRM.', 'Distribuir conversas com prazo, histórico e responsável.', 'Encaminhar exceções a uma pessoa quando a triagem automática não tiver informação suficiente.'],
    services: ['whatsapp-e-crm', 'agentes-de-ia', 'integracao-de-sistemas'],
    preparation: 'Separe uma conversa atendida no prazo e outra que perdeu o retorno. Identifique a origem, o responsável e o ponto em que o acompanhamento parou.',
    measure: 'Meça o tempo até o primeiro retorno, a quantidade de contatos sem responsável e a proporção de solicitações encaminhadas corretamente.'
  }
];

const integer = new Intl.NumberFormat('pt-BR');
const decimal = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });

export function municipalContent(row, states) {
  const [slug, name, uf, ibge, region, population, ...shares] = row;
  const available = shares.map((value, index) => ({ value, profile: profiles[index] }))
    .filter(({ value }) => Number.isFinite(value)).sort((first, second) => second.value - first.value);
  const profile = available[0]?.profile ?? profiles[2];
  const secondary = available[1];
  return {
    ...profile, slug, name, uf, state: states[uf], ibge, region,
    description: `${profile.focus} para empresas em ${name}/${uf.toUpperCase()}. Veja um exemplo de implantação e como solicitar um diagnóstico remoto da DropFlow.`,
    population: population === null ? null : integer.format(population),
    secondaryScenario: secondary && secondary.value >= 15 ? secondary.profile.scenarios[0] : null,
    economicShares: available.map(({ value, profile: sector }) => [sector.name, decimal.format(value) + '%'])
  };
}
