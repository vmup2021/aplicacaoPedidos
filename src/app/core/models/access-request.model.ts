import { RequestState } from './enums';

export interface RequestHistoryEntry {
  id: number;
  estado: RequestState;
  responsavelId: number;
  responsavelNome: string;
  data: string; // ISO date-time
  justificativa: string;
}

export interface AccessRequest {
  id: number;
  aplicacaoId: number;
  aplicacaoNome: string;
  colaboradorId: number;
  colaboradorNome: string;
  justificacaoPedido: string;
  estado: RequestState;
  dataPedido: string; // ISO date-time
  atualizadoEm: string; // ISO date-time
  decisorId?: number;
  decisorNome?: string;
  justificativaDecisao?: string;
  historico: RequestHistoryEntry[];
}

export interface NewAccessRequestPayload {
  aplicacaoId: number;
  justificativa: string;
}

export interface DecisionPayload {
  decisao: RequestState.APROVADO | RequestState.REJEITADO;
  justificativaDecisao: string;
}

export interface RequestFilters {
  estado?: RequestState | 'TODOS';
  aplicacaoId?: number | 'TODOS';
  colaboradorId?: number | 'TODOS';
  pesquisa?: string;
  page?: number;
  size?: number;
}

export interface DashboardSummary {
  pedidosAtivos: number;
  limitePedidosAtivos: number;
  pendentes: number;
  aprovados: number;
  rejeitados: number;
}
