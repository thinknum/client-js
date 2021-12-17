import fetch from "isomorphic-unfetch";
import qs from "querystringify";
import {version} from "../package.json";
import {
  IDatasetListResponse,
  IDatasetMetadataResponse,
  ITickersResponse,
} from "./dataTypes/response";
import {Paths} from "./paths";

export interface IClientCredentials {
  clientId: string;
  clientSecret: string;
}

export class Client {
  private clientId: string;
  private clientSecret: string;
  private token: string | undefined;
  private userAgent = "Javascript API v" + version;

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
      if (init.method === "HEAD") {
        return Promise.resolve({data: undefined, status: result.status});
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
        if (message) {
          return Promise.reject(new Error(message));
        }
      })
      .catch(async (error) => {
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

  public async getDatasetList(): Promise<IDatasetListResponse> {
    return this.requestData<IDatasetListResponse>(Paths.datasets);
  }

  public async getDatasetMetadata(datasetId: string): Promise<IDatasetMetadataResponse> {
    if (!datasetId || datasetId.trim().length === 0) {
      return Promise.reject(new Error("Missing or invalid datasetId"));
    }

    return this.requestData<IDatasetMetadataResponse>(Paths.datasetMetadata(datasetId.trim()));
  }

  public async getTickerDatasetList(ticker: string): Promise<IDatasetListResponse> {
    if (!ticker || ticker.trim().length === 0) {
      return Promise.reject(new Error("Missing or invalid ticker"));
    }

    const params = {
      ticker: ticker.trim(),
    };
    return this.requestData(Paths.datasets + qs.stringify(params, "?"));
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
}
