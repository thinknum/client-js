import fetch from "isomorphic-unfetch";
import qs from "querystringify";
import {
  IDataset,
  IDatasetListResponse,
  IDatasetMetadataResponse,
  IStockOverlayFetchResponse,
  ITickersResponse,
} from "./dataTypes/response";
import {Paths} from "./paths";
import {validateRangeDateFormat} from "./utils";

export interface IClientCredentials {
  clientId: string;
  clientSecret: string;
}

export class Client {
  private clientId: string;
  private clientSecret: string;
  private token: string | undefined;
  // @ts-ignore
  private userAgent = "Javascript API v" + PACKAGE_VERSION;

  constructor(config: IClientCredentials) {
    if (!config.clientId || config.clientId.length === 0) {
      throw new Error("Invalid clientId");
    }
    if (!config.clientSecret || config.clientSecret.length === 0) {
      throw new Error("Invalid clientSecret");
    }
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
  }

  private async authenticate() {
    console.log("Autheticating...");
    const body = new URLSearchParams();
    body.append("version", "20151130");
    body.append("client_id", this.clientId);
    body.append("client_secret", this.clientSecret);

    const result = await fetch(Paths.authorize, {method: "POST", body});
    if (!result.ok) {
      throw new Error(result.statusText);
    }

    const data = await result.json();
    const token = data["auth_token"] as string;
    if (!token && token.length === 0) {
      throw new Error("Invalid or missing auth_token");
    }
    this.token = token;
    console.log("Auth token received.");
  }

  public async request<T>(url: string, init?: RequestInit): Promise<{data: T; status: number}> {
    if (!this.token) {
      await this.authenticate();
    }

    const defaultHeaders: HeadersInit = {
      Accept: "application/json",
      Authorization: "token " + this.token,
      "X-API-Version": "20151130",
      "User-Agent": this.userAgent,
    };
    const headers = init && init.headers ? {...defaultHeaders, ...init.headers} : defaultHeaders;

    const result = await fetch(url, {...init, headers});
    if (result.ok) {
      if (init?.method === "HEAD") {
        return Promise.resolve({data: undefined as any, status: result.status});
      } else {
        return result
          .json()
          .then((data) => {
            return Promise.resolve({data, status: result.status});
          })
          .catch((error) => {
            return Promise.reject(error);
          });
      }
    }

    return result
      .clone()
      .json()
      .then((dict) => {
        const message = dict["message"];
        return Promise.reject(new Error(message));
      })
      .catch(async () => {
        const message = (await result.text()) || result.statusText;
        return Promise.reject(new Error(message));
      });
  }

  public async requestData<T>(url: string, init?: RequestInit): Promise<T> {
    return this.request<T>(url, init)
      .then(({data}) => Promise.resolve(data))
      .catch((error) => Promise.reject(error));
  }

  /* Miscellaneous API
  -------------------------------------------------------------------------*/

  public async getDatasetList(): Promise<IDataset[]> {
    return this.requestData<IDatasetListResponse>(Paths.datasets).then((data) => {
      return data.datasets;
    });
  }

  public async getDatasetMetadata(datasetId: string): Promise<IDatasetMetadataResponse> {
    if (!datasetId || datasetId.trim().length === 0) {
      return Promise.reject(new Error("Missing or invalid datasetId"));
    }

    return this.requestData<IDatasetMetadataResponse>(Paths.datasetMetadata(datasetId.trim()));
  }

  public async getTickerDatasetList(ticker: string): Promise<IDataset[]> {
    if (!ticker || ticker.trim().length === 0) {
      return Promise.reject(new Error("Missing or invalid ticker"));
    }

    const params = {
      ticker: ticker.trim(),
    };
    return this.requestData<IDatasetListResponse>(Paths.datasets + qs.stringify(params, "?")).then(
      (data) => {
        return data.datasets;
      },
    );
  }

  public async getTickerList(query: string, datasetId?: string) {
    if (!query || query.trim().length === 0) {
      return Promise.reject(new Error("Missing or invalid query"));
    }

    const searchQuery = query.trim();
    const params = {
      query: searchQuery,
    };
    const encodedQuery = qs.stringify(params, "?");
    let promise: Promise<ITickersResponse>;
    if (datasetId) {
      if (datasetId.trim().length === 0) {
        return Promise.reject(new Error("Invalid datasetId"));
      }
      promise = this.requestData(Paths.datasetTickers(datasetId.trim()) + encodedQuery);
    } else {
      promise = this.requestData(Paths.tickers + encodedQuery);
    }

    return promise.then((data) => {
      return data.queries[searchQuery];
    });
  }

  /* Stock API
  -------------------------------------------------------------------------*/

  public async getStockPrice(ticker: string, range?: {startDate: string; endDate: string}) {
    if (!ticker || ticker.trim().length === 0) {
      return Promise.reject(new Error("Missing or invalid ticker"));
    }

    if (range) {
      const hasStartDate = range.startDate && range.startDate.length > 0;
      const hasEndDate = range.endDate && range.endDate.length > 0;

      if (!hasStartDate || !hasEndDate) {
        return Promise.reject(
          new Error("Both startDate and endDate are required when specifying range."),
        );
      }

      if (!validateRangeDateFormat(range.startDate)) {
        return Promise.reject(new Error("Invalid startDate format. Please use YYYY-MM-DD format."));
      }

      if (!validateRangeDateFormat(range.endDate)) {
        return Promise.reject(new Error("Invalid endDate format. Please use YYYY-MM-DD format."));
      }
    }

    const data: {start_date?: string; end_date?: string} = {};
    if (range?.startDate) {
      data.start_date = range.startDate;
    }
    if (range?.endDate) {
      data.end_date = range.endDate;
    }

    return this.requestData<IStockOverlayFetchResponse>(Paths.stock(ticker.trim()), {
      method: "POST",
      body: JSON.stringify(data),
    }).then((data) => {
      return data.results;
    });
  }
}
