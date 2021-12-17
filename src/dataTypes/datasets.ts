import {IQuery} from "./datasetQueries";

interface IDatasetField {
  id: string;
  display_name: string;
  options: DatasetFieldOption[];
  length: number;
  summary: string;
  type: DatasetFieldType;
  format: DatasetFieldFormat;
  width: number;
  metric: boolean;
}

export interface IStringDatasetField extends IDatasetField {
  type: DatasetFieldType.STRING;
  format: DatasetFieldStringFormat;
}

export interface IDateDatasetField extends IDatasetField {
  type: DatasetFieldType.DATE;
  format: DatasetFieldDateFormat;
}

export interface INumberDatasetField extends IDatasetField {
  type: DatasetFieldType.NUMBER;
  format: DatasetFieldNumberFormat;
}

export interface IGeometryDatasetField extends IDatasetField {
  type: DatasetFieldType.GEOMETRY;
  format: DatasetFieldGeometryFormat;
}

export interface IBooleanDatasetField extends IDatasetField {
  type: DatasetFieldType.BOOLEAN;
  format: undefined;
}

export interface ISerialDatasetField extends IDatasetField {
  type: DatasetFieldType.SERIAL;
  format: undefined;
}

export enum DatasetFieldOption {
  INVERSE = "inverse",
}

export enum DatasetFieldType {
  STRING = "string",
  DATE = "date",
  NUMBER = "number",
  GEOMETRY = "geomtry",
  BOOLEAN = "boolean",
  SERIAL = "serial",
}

export enum DatasetFieldStringFormat {
  ADDRESS = "address",
  CITY = "city",
  STATE = "state",
  POSTAL = "postal",
  COUNTRY = "country",
  TICKER = "ticker",
  ENTITY = "entity",
  URL = "url",
}

export enum DatasetFieldDateFormat {
  DATE = "date", // 20171015T000000Z
  DATETIME = "datetime", // 20171015T000000Z
  DAY = "day", // 03
  WEEK = "week", // 03
  MONTH = "month", // 03
  QUARTER = "quarter", // 03
  YEAR = "year", // 2017 | 20171015T000000Z
  YEARQUARTER = "year_quarter", // 2017Q2
  YEARMONTH = "year_month", // 201702
  YEARWEEK = "year_week", // 2016W37
  YEARDAY = "year_day", // 2016D290
}

export enum DatasetFieldNumberFormat {
  NUMBER = "number",
  PERCENT = "percent",
  LATITUDE = "latitude",
  LONGITUDE = "longitude",
}

export enum DatasetFieldGeometryFormat {
  POINT = "point",
}

export type DatasetFieldFormat =
  | DatasetFieldStringFormat
  | DatasetFieldDateFormat
  | DatasetFieldNumberFormat
  | DatasetFieldGeometryFormat;

export type DatasetField =
  | IStringDatasetField
  | IDateDatasetField
  | INumberDatasetField
  | IGeometryDatasetField
  | IBooleanDatasetField
  | ISerialDatasetField;

export interface IFunctionsMetadata {
  [functionId: string]: {
    description?: string;
    blog_url?: string;
  };
}

export interface IDatasetPreset {
  name: string;
  query: IQuery;
}
