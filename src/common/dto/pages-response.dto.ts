export interface PagesMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface PagesResponse<T> {
  data: T[];
  pagination: PagesMeta;
}