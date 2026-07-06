import { UserRole } from './enums';

export interface User {
  id: number;
  nome: string;
  email: string;
  departamento: string;
  perfil: UserRole;
  ativo: boolean;
}

/** Payload used by the "Gestão de Utilizadores" create/edit form. */
export interface UserFormValue {
  nome: string;
  email: string;
  departamento: string;
  perfil: UserRole;
  ativo: boolean;
  password?: string;
}
