export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

export interface IQuerySort {
  column: string;
  order: SortOrder;
}

export interface IQueryPagination {
  start: number;
  limit: number;
}

export enum HTTPStatus {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
}

export enum QueryFormat {
  TABLE = "application/vnd.thinknum.table+json",
  MAP = "application/vnd.thinknum.map+json",
  CHART = "application/vnd.thinknum.chart+json",
}
