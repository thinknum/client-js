import {IQueryAggregation, IQueryFilter, IQueryGroup, QueryFunction} from "./datasetQueries";

export enum ChartType {
  LINE_CHART = "line",
  BAR_CHART = "bar",
  PIE_CHART = "pie",
  SCATTERPLOT = "scatterplot",
  WORD_CLOUD = "wordcloud",
  TIME_BAR_CHART = "time_bar",
  TIME_WORD_CLOUD = "time_wordcloud",
  HISTOGRAM = "histogram",
}

export enum DateRangeOptions {
  ALL_TIME = "all",
  ONE_WEEK = "1w",
  ONE_MONTH = "1m",
  THREE_MONTHS = "3m",
  SIX_MONTHS = "6m",
  YTD = "ytd",
  ONE_YEAR = "1y",
  TWO_YEARS = "2y",
  FIVE_YEARS = "5y",
}

export interface IChartQueryPreset {
  id: string;
  display_name: string;
  summary: string | undefined;
  preferred_visualization: ChartType;
  date_range?: DateRangeOptions;
  query: {
    groups: IQueryGroup[];
    aggregations: IQueryAggregation[];
    functions: QueryFunction[];
    filters: IQueryFilter[];
  };
}
