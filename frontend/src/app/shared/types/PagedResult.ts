export type PagedResult<T> = {
  items: T[];
  totalCount: number;
  limit: number;
  offset: number;
  currentPage: number;
  totalPages: number;
};
