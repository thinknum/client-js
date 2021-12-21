import {IChartQueryPreset} from "./charts";
import {IQuerySort, QueryFormat} from "./common";
import {ICompanyWithEntities} from "./datasetCompaniesEntities";
import {QueryOption, QueryRow} from "./datasetQueries";
import {DatasetField, IDatasetPreset, IFunctionsMetadata} from "./datasets";
import {IStockOverlayData} from "./stock";

export interface IDatasetListResponse {
  datasets: IDataset[];
}

export interface IDataset {
  id: string;
  display_name: string;
  summary: string | null;
  priority: number;
  companies_count: number | null;
  private_companies_count: number | null;
  public_companies_count: number | null;
  blog_url: string | null;
  state: string;
}

export interface IDatasetMetadataResponse {
  chart_presets: IChartQueryPreset[];
  dataset_fields: DatasetField[];
  display_name: string;
  functions: IFunctionsMetadata;
  id: string;
  presets: IDatasetPreset[];
  state: string;
  status: number;
  summary: string;
  truncate_limit: number;
  unique_fields: string[][];
}

export interface ITickersResponse {
  tickers: {[ticker: string]: ICompanyWithEntities};
  queries: {[query: string]: ICompanyWithEntities[]};
}

export interface ICreateQueryResponse {
  id: string;
  state: "running" | "complete";
  total: number;
  formats: QueryFormat[];
  message?: string;
}

export interface IFetchQueryResponse {
  id: string;
  state: "complete" | "running";
  total: number;
  count: number;
  start: number;
  options: QueryOption[];
  last_date_updated: string | undefined;
}

export interface ITableFetchQueryResponse extends IFetchQueryResponse {
  fields: DatasetField[];
  rows: QueryRow[];
  group_fields: DatasetField[];
  sort_fields: IQuerySort[];
}

export interface IStockOverlayFetchResponse {
  count: number;
  results: IStockOverlayData;
}
