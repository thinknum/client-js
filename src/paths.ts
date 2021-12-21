export class Paths {
  private static BASE_URL = "https://data.thinknum.com";

  static authorize = this.BASE_URL + "/api/authorize";
  static datasets = this.BASE_URL + "/datasets/";
  static datasetMetadata(datasetId: string) {
    return this.BASE_URL + "/datasets/" + datasetId;
  }
  static datasetTickers(datasetId: string) {
    return this.BASE_URL + `/datasets/${datasetId}/tickers/`;
  }
  static tickers = this.BASE_URL + "/tickers/";
  static stock(ticker: string) {
    return this.BASE_URL + "/companies/stock/" + ticker;
  }

  static query(datasetId: string) {
    return this.BASE_URL + `/datasets/${datasetId}/query/`;
  }
  static queryById(datasetId: string, id: string) {
    return this.BASE_URL + `/datasets/${datasetId}/query/${id}`;
  }
}
