/**
 * Mirrors the enums exposed by the Spring Boot backend (JPA @Enumerated(EnumType.STRING)).
 * Keep these string values identical to the Java enum constant names.
 */

export enum RequestState {
  PENDENTE = 'PENDENTE',
  APROVADO = 'APROVADO',
  REJEITADO = 'REJEITADO',
}

export enum UserRole {
  COLABORADOR = 'COLABORADOR',
  APROVADOR = 'APROVADOR',
}

export const REQUEST_STATE_LABEL: Record<RequestState, string> = {
  [RequestState.PENDENTE]: 'Pendente',
  [RequestState.APROVADO]: 'Aprovado',
  [RequestState.REJEITADO]: 'Rejeitado',
};

export const ROLE_LABEL: Record<UserRole, string> = {
  [UserRole.COLABORADOR]: 'Colaborador',
  [UserRole.APROVADOR]: 'Aprovador',
};
