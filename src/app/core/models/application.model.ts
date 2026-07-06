export interface Application {
  id: number;
  codigo: string;
  nome: string;
  descricao: string;
  ativa: boolean;
}

export interface ApplicationFormValue {
  codigo: string;
  nome: string;
  descricao: string;
  ativa: boolean;
}
