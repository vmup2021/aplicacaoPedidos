export interface AuditLog {
  id: number;
  data: string; // ISO date-time
  utilizadorId: number;
  utilizadorNome: string;
  acao: string;
  entidade: string;
  detalhes: string;
}

export interface AuditLogFilters {
  utilizadorId?: number | 'TODOS';
  acao?: string | 'TODOS';
  dataInicio?: string;
  dataFim?: string;
  pesquisa?: string;
  page?: number;
  size?: number;
}
