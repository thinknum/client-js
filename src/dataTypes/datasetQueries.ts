import {IQuerySort, SortOrder} from "./common";
import {IScreenerQuery} from "./screenerQuery";

export type QueryValue = string | number | boolean;

export type QueryRow = QueryValue[];

export enum QueryFunctionName {
  NEARBY = "nearby",
  NEAREST = "nearest",
  SALES = "sales",
  LOCALDATA = "localdata",
  FILL_TIME_SERIES = "filltimeseries",
  CHANGE_OVER_TIME = "changeovertime",
  HEATMAP = "heatmap",
  GENDER_DECODER = "genderdecoder",
  CHURN = "churn",
  STORES_DUPLICATE = "identifyduplicate",
  LISTING_CHANGE = "listingchange",
}

export interface IQueryFunction {
  function: QueryFunctionName;
  parameters: QueryFunctionParameters;
}

/* Shared
-------------------------------------------------------------------------*/

export enum MapAreaLevel {
  STATE = "state",
  COUNTY = "county",
  COUNTRY = "country",
  CBSA = "cbsa",
  POSTAL = "postal",
}

/* Localdata
-------------------------------------------------------------------------*/

export type QueryLocaldataMeasureArea = MapAreaLevel;

export enum QueryLocaldataMeasureType {
  "Macro" = "macro",
  "Weather" = "weather",
  "ESG" = "esg",
}

export interface IQueryLocaldataFunctionParameters {
  country: string[];
  measure_type: QueryLocaldataMeasureType;
  measure: string;
  dimensions: {
    [key: string]: string | string[];
  };
}

export interface IQueryLocaldataFunction {
  function: QueryFunctionName.LOCALDATA;
  parameters: IQueryLocaldataFunctionParameters;
}

/* Heatmap
-------------------------------------------------------------------------*/

export type QueryHeatmapArea = MapAreaLevel;

export interface IQueryHeatmapFunctionParameters {
  geo: QueryHeatmapArea;
}

export interface IQueryHeatmapFunction {
  function: QueryFunctionName.HEATMAP;
  parameters: IQueryHeatmapFunctionParameters;
}

/* Stores duplicate
-------------------------------------------------------------------------*/

export interface IQueryStoresDuplicateFunctionParameters {
  similarity: {
    name: string;
    threshold: number;
  };
  distance: number;
}

export interface IQueryStoresDuplicateFunction {
  function: QueryFunctionName.STORES_DUPLICATE;
  parameters: IQueryStoresDuplicateFunctionParameters;
}

/* Gender Decoder
-------------------------------------------------------------------------*/

export interface IQueryGenderDecoderFunctionParameters {
  masculine_words: string[];
  feminine_words: string[];
}

export interface IQueryGenderDecoderFunction {
  function: QueryFunctionName.GENDER_DECODER;
  parameters: IQueryGenderDecoderFunctionParameters;
}

/* Listing Change
-------------------------------------------------------------------------*/

export interface IQueryListingChangeFunctionParameters {}

export interface IQueryListingChangeFunction {
  function: QueryFunctionName.LISTING_CHANGE;
  parameters: IQueryListingChangeFunctionParameters;
}

/* Churn
-------------------------------------------------------------------------*/

export interface IQueryChurnFunctionParameters {}

export interface IQueryChurnFunction {
  function: QueryFunctionName.CHURN;
  parameters: IQueryChurnFunctionParameters;
}

/* Nearby/Nearest
-------------------------------------------------------------------------*/

export enum NearlikeFunctionDatasetType {
  DATASET = "dataset",
  UPLOAD = "upload",
}

/* Nearby
-------------------------------------------------------------------------*/

export interface IQueryNearbyFunctionParameters {
  dataset_type: NearlikeFunctionDatasetType;
  dataset: "store" | undefined;
  tickers: string[];
  entities: string[];
  distance: number;
  is_include_closed: boolean;
}

export interface IQueryNearbyFunction {
  function: QueryFunctionName.NEARBY;
  parameters: IQueryNearbyFunctionParameters;
}

/* Nearest
-------------------------------------------------------------------------*/

export interface IQueryNearestFunctionParameters {
  dataset_type: NearlikeFunctionDatasetType;
  dataset: "store" | string;
  tickers: string[];
  entities: string[];
  ranks: number[];
  is_include_closed: boolean;
}

export interface IQueryNearestFunction {
  function: QueryFunctionName.NEAREST;
  parameters: IQueryNearestFunctionParameters;
}

/* Sales
-------------------------------------------------------------------------*/

export interface IQuerySalesFunctionParameters {
  lookahead_day_count: number;
  start_date?: string;
  end_date?: string;
}

export interface IQuerySalesFunction {
  function: QueryFunctionName.SALES;
  parameters: IQuerySalesFunctionParameters;
}

/* Fill time series
-------------------------------------------------------------------------*/

export interface IQueryFillTimeSeriesFunctionParameters {
  partition_by: string[];
}

export interface IQueryFillTimeSeriesFunction {
  function: QueryFunctionName.FILL_TIME_SERIES;
  parameters: IQueryFillTimeSeriesFunctionParameters;
}

/* Change over time
-------------------------------------------------------------------------*/

export interface IQueryChangeOverTimeFunctionParameters {
  relative: boolean;
  frequency: number;
}

export interface IQueryChangeOverTimeFunction {
  function: QueryFunctionName.CHANGE_OVER_TIME;
  parameters: IQueryChangeOverTimeFunctionParameters;
}

/* Union types
-------------------------------------------------------------------------*/

export type QueryFunctionParameters =
  | IQueryLocaldataFunctionParameters
  | IQueryHeatmapFunctionParameters
  | IQueryStoresDuplicateFunctionParameters
  | IQueryGenderDecoderFunctionParameters
  | IQueryNearbyFunctionParameters
  | IQueryNearestFunctionParameters
  | IQuerySalesFunctionParameters
  | IQueryFillTimeSeriesFunctionParameters
  | IQueryChangeOverTimeFunctionParameters
  | IQueryChurnFunctionParameters;

export type QueryFunction =
  | IQueryLocaldataFunction
  | IQueryHeatmapFunction
  | IQueryStoresDuplicateFunction
  | IQueryGenderDecoderFunction
  | IQueryNearestFunction
  | IQueryNearbyFunction
  | IQuerySalesFunction
  | IQueryFillTimeSeriesFunction
  | IQueryChangeOverTimeFunction
  | IQueryChurnFunction;

export enum DateFilterType {
  EQUALS = "=",
  NOT_EQUALS = "!=",
  GREATER_THAN = ">",
  LESS_THAN = "<",
  BETWEEN = "[]",
  GREATER_THAN_OR_EQUAL = ">=",
  LESS_THAN_OR_EQUAL = "<=",
  IS_BLANK = "{}",
}

export enum DefaultFilterType {
  EQUALS = "=",
  NOT_EQUALS = "!=",
  GREATER_THAN = ">",
  LESS_THAN = "<",
  GREATER_THAN_OR_EQUAL = ">=",
  LESS_THAN_OR_EQUAL = "<=",
  IS_BLANK = "{}",
}

export enum StringFilterType {
  EQUALS = "=",
  NOT_EQUALS = "!=",
  STARTS_WITH = "=...",
  ENDS_WITH = "...=",
  CONTAINS = "...",
  CONTAINS_WORD = "(...)",
  NOT_CONTAINS = "!...",
  I_EQUALS = "i=",
  I_NOT_EQUALS = "i!=",
  I_STARTS_WITH = "i=...",
  I_ENDS_WITH = "i...=",
  I_CONTAINS = "i...",
  I_CONTAINS_WORD = "i(...)",
  I_NOT_CONTAINS = "i!...",
  IS_BLANK = "{}",
}

export type FilterType = DefaultFilterType | StringFilterType | DateFilterType;

export type FilterValue = Array<string | number | boolean | undefined>;

export type FilterStringValue = Array<string>;

export interface IQuerySimpleFilter {
  column: string;
  type: FilterType;
  value: FilterValue;
}

export enum ComplexFilterMatch {
  ALL = "all",
  ANY = "any",
}

export interface IQueryComplexFilter {
  match: ComplexFilterMatch;
  conditions: IQueryFilter[];
}

export type IQueryFilter = IQuerySimpleFilter | IQueryComplexFilter;

export function isQuerySimpleFilter(filter: any): filter is IQuerySimpleFilter {
  return filter.column !== undefined;
}

export function isQueryComplexFilter(filter: any): filter is IQueryComplexFilter {
  return filter.match !== undefined;
}

export enum QueryGroupPartition {
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
  QUARTER = "quarter",
  YEAR = "year",
  YEARQUARTER = "yearquarter",
  YEARMONTH = "yearmonth",
  YEARMONTHDAY = "yearmonthday",
  YEARWEEK = "yearweek",
  YEARDAY = "yearday",
}

export interface IQueryGroup {
  column: string;
  partition?: QueryGroupPartition;
  include_partials?: boolean;
}

export enum QueryAggregationType {
  COUNT = "count",
  DISTINCT_COUNT = "distinctcount",
  AVERAGE = "average",
  MEDIAN = "median",
  SUM = "sum",
  MIN = "min",
  MAX = "max",
  CUMSUM = "cumsum",
  CUMAVG = "cumavg",
  CUMCOUNT = "cumcount",
  CUM_DISTINCT_COUNT = "cumdistinctcount",
}

export interface IQueryAggregation {
  column: string;
  type: QueryAggregationType;
}

export type QuerySortOrder = SortOrder;

export type QueryEntity =
  | string[]
  | IQueryFilter[]
  | IQueryGroup[]
  | IQueryAggregation[]
  | IQuerySort[]
  | QueryFunction[];

export interface IQuery {
  tickers?: string[];
  screener?: IScreenerQuery;
  filters?: IQueryFilter[];
  groups?: IQueryGroup[];
  aggregations?: IQueryAggregation[];
  sorts?: IQuerySort[];
  functions?: QueryFunction[];
  [key: string]: QueryEntity | IScreenerQuery | undefined;
}

export enum QueryDatasetId {
  STORE = "store",
}

export enum QueryOption {
  TIME_SERIES = "timeseries",
  INVERSED = "inversed",
}
