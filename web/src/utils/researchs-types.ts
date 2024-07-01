export interface IResearch {
  id: number;
  campanhaDeVendaCon: string | null;
  cliente: string;
  conPisoDeVendas: string;
  dataVisita: string;
  labPisoDeVendas: string;
  linhasDeCredito: string;
  merchandising: string;
  observacao: string | null;
  pagamentoVendaPremiada: string | null;
  prazoEntregaCon: string;
  produtoChave: string;
  reposicao: string | null;
  tipoDaPesquisa: string;
  treinamento: string| null;
  uf: string;
  usuarioId: string;
  vendaPremiada: string;
  usuario: {
    nome: string;
    email: string;
  }
}