/**
 * Global API response types
 * These types match the backend response format
 */

export interface BackendResponse<T> {
  IsSuccess: boolean;
  Data: T;
  Error?: string;
}

export interface BackendPagination {
  Page: number;
  Size: number;
  TotalPages: number;
  TotalRecords: number;
}

export interface BackendPaginatedResponse<T> {
  Records: T[];
  Pagination: BackendPagination;
}

/**
 * Frontend response format (transformed from backend)
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface Pagination {
  page: number;
  size: number;
  totalPages: number;
  totalRecords: number;
}

export interface PaginatedResponse<T> {
  records: T[];
  pagination: Pagination;
}
