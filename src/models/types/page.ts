export interface Page<T> {
  content: T[],
  pageNo: number,
  pageSize: number,
  totalElements: number,
  totalPages: number,
  last: boolean,
}