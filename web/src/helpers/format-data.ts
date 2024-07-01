import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';
import { IResearch } from '@/utils/researchs-types';
import { formatReal } from './format-currency';

const formatBoolean = (value: string | boolean | undefined | null) => (value === true || value === 'true' ? 'Sim' : 'Não');
const parseJsonField = (field: string) => JSON.parse(field).map((item: any) => `${item.name} (${item.amount}x ${formatReal.format(item.price)})`).join(', ');
const parseJsonFieldProductKey = (field: string) => JSON.parse(field).map((item: any) => `${item.name} (${formatReal.format(item.price)})`).join(', ');

export const formatJson = (data: IResearch[]) => {
  return data.map(item => ({
    Data_da_visita: format(new Date(item.dataVisita), "dd' de 'MMM' de 'yyyy", { locale: ptBR }),
    Cliente: item.cliente,
    UF: item.uf,
    Tipo_da_pesquisa: item.tipoDaPesquisa === "revenda" ? "Revenda" : "Prospecção",
    Vendedor: item.usuario.nome,
    Houve_treinamento: formatBoolean(item.treinamento),
    Informado_sobre_Venda_Premiada: formatBoolean(item.vendaPremiada),
    Houve_pagamento: formatBoolean(item.pagamentoVendaPremiada),
    Apresentado_material_de_merchandising: formatBoolean(item.merchandising),
    Houve_reposicao: formatBoolean(item.reposicao),
    Informado_sobre_linhas_de_credito: formatBoolean(item.linhasDeCredito),
    Observacao: item.observacao ? item.observacao : 'Não',
    Laboremus_no_piso_de_vendas: parseJsonField(item.labPisoDeVendas),
    Concorrentes_no_piso_de_vendas: parseJsonField(item.conPisoDeVendas),
    Produto_chave: parseJsonFieldProductKey(item.produtoChave),
  })).sort((a, b) => a.UF.localeCompare(b.UF) || new Date(a.Data_da_visita).getTime() - new Date(b.Data_da_visita).getTime() || a.Cliente.localeCompare(b.Cliente));
};