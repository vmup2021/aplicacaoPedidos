/**
 * Mirrors the shape of Spring Data's org.springframework.data.domain.Page<T>
 * as serialized to JSON.
 */
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // current page, 0-indexed
  size: number;
  first: boolean;
  last: boolean;
}
