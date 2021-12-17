import {SortOrder} from "./common";

export type ScreenerStringMetricFilterValue = string[];
export type ScreenerDateMetricFilterValue = (string | undefined)[];
export type ScreenerNumericMetricFilterValue = (number | undefined)[];

export type ScreenerMetricFilterValue = ScreenerStringMetricFilterValue | ScreenerDateMetricFilterValue | ScreenerNumericMetricFilterValue;

export enum ScreenerMetaColumn {
  ROW_NUMBER = "meta::row_number",
  TICKER = "meta::ticker",
  COMPANY_NAME = "meta::display_name",
  SUMMARY = "meta::summary",
  LOCATION = "meta::location",
  DOMAIN = "meta::domain",
  CATEGORY = "meta::category",
  CEO_ETHNICITY = "meta::ceo_ethnicity",
  CEO_GENDER = "meta::ceo_gender",
  MARKET = "meta::market",
  INDUSTRY = "meta::market_industry",
  SECTOR = "meta::market_sector",
  ISIN = "meta::isin",
  CUSIP = "meta::cusip",
  SEDOL = "meta::sedol",
  DUNS = "meta::duns",
  FIGI = "meta::figi",
}

export enum ScreenerFilterType {
  EQUALS = "=",
  NOT_EQUALS = "!=",
  CONTAINS = "...",
  BETWEEN = "[]",
}

export const ScreenerFilterLabel: {[key: string]: string} = {
  [ScreenerFilterType.EQUALS]: "Equals",
  [ScreenerFilterType.NOT_EQUALS]: "Not Equals",
  [ScreenerFilterType.CONTAINS]: "Contains",
  [ScreenerFilterType.BETWEEN]: "Between",
};

export interface IScreenerQueryColumn {
  id: string;
  required?: boolean;
}

export type ScreenerQuerySortOrder = SortOrder;

export interface IScreenerQuerySort {
  column_id: string;
  order: ScreenerQuerySortOrder;
}

export interface IScreenerQuerySearch {
  search_term: string;
  lower_bound?: number;
  upper_bound?: number;
  required?: boolean;
}

export type ScreenerQueryFilterValue = (number | undefined)[] | (string | undefined)[];

export interface IScreenerQueryFilter {
  column_id: string;
  type: ScreenerFilterType;
  value: ScreenerQueryFilterValue | undefined;
}

export interface IScreenerQueryGeoFilter {
  latitude: number;
  longitude: number;
  radius: number;
}

export interface IScreenerQueryUpload {
  id: string;
  column_id: string;
}

export interface IScreenerQuery {
  columns?: IScreenerQueryColumn[];
  filters?: IScreenerQueryFilter[];
  sorts?: IScreenerQuerySort[];
  geoFilter?: IScreenerQueryGeoFilter;
  search?: IScreenerQuerySearch[];
  start?: number;
  limit?: number;
  uploads?: IScreenerQueryUpload[];
  as_of_date?: string;
}

export interface IScreenerEmbedBodyConfig {
  is_live: boolean;
  histogram_snapshots?: string[];
  tickers?: string[];
}
