export interface ICompanyEntity {
  id: string;
  display_name: string;
}

export interface ILightCompany {
  id: string;
  display_name: string;
}

export interface ICompanyWithEntities {
  id: string;
  display_name: string;
  entities: ICompanyEntity[];
}

export interface IDatasetQueryCompaniesEntitiesResponse {
  tickers: ICompanyWithEntities[];
}
