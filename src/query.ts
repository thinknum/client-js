import qs from "querystringify";
import {Client, IClientCredentials} from "./client";
import {HTTPStatus, IQueryPagination, IQuerySort} from "./dataTypes/common";
import {
  IQuery,
  IQueryAggregation,
  IQueryFilter,
  IQueryGroup,
  isQueryComplexFilter,
  QueryFunction,
} from "./dataTypes/datasetQueries";
import {ICreateQueryResponse, ITableFetchQueryResponse} from "./dataTypes/response";
import {Paths} from "./paths";
import {sleep} from "./utils";

export class Query {
  private client: Client;
  private timeout: number;

  private tickers: string[] = [];
  private filters: IQueryFilter[] = [];
  private groups: IQueryGroup[] = [];
  private aggregations: IQueryAggregation[] = [];
  private functions: QueryFunction[] = [];
  private sorts: IQuerySort[] = [];

  private static defaultPagination: IQueryPagination = {
    start: 1,
    limit: 100000,
  };

  constructor(init: Client | IClientCredentials, timeout: number = 180) {
    if (init instanceof Client) {
      this.client = init;
    } else if (init) {
      this.client = new Client(init);
    } else {
      throw new Error("You need to provide Client instance or credentials");
    }
    this.timeout = timeout;
  }

  /* Query Setup API
  -------------------------------------------------------------------------*/

  public getQuery() {
    const query: IQuery = {};
    if (this.tickers && this.tickers.length > 0) {
      query.tickers = this.tickers;
    }
    if (this.filters && this.filters.length > 0) {
      query.filters = this.filters;
    }
    if (this.groups && this.groups.length > 0) {
      query.groups = this.groups;
    }
    if (this.aggregations && this.aggregations.length > 0) {
      query.aggregations = this.aggregations;
    }
    if (this.functions && this.functions.length > 0) {
      query.functions = this.functions;
    }
    if (this.sorts && this.sorts.length > 0) {
      query.sorts = this.sorts;
    }
    return query;
  }

  public resetQuery() {
    this.tickers = [];
    this.filters = [];
    this.groups = [];
    this.aggregations = [];
    this.functions = [];
    this.sorts = [];
  }

  // Tickers

  public addTicker(ticker: string) {
    if (!ticker || ticker.trim().length === 0) {
      return Promise.reject(new Error("Missing or invalid ticker"));
    }

    this.tickers.push(ticker);
  }

  public setTickers(tickers: string[]) {
    const validTickers = tickers.map((item) => item.trim()).filter((item) => !!item);
    this.tickers = validTickers;
  }

  public resetTickers() {
    this.tickers = [];
  }

  // Filters

  public addFilter(filter: IQueryFilter) {
    if (this.filters.length > 0) {
      if (isQueryComplexFilter(this.filters[0])) {
        throw new Error(
          "Your root filter is a complex filter. You cannot add another filter - you need to modify complex filter conditions.",
        );
      }

      if (isQueryComplexFilter(filter)) {
        throw new Error(
          "You query already contains filters. If you want to use complex filter it needs to start as root filter.",
        );
      }
    }

    this.filters.push(filter);
  }

  public setFilters(filters: IQueryFilter[]) {
    if (filters.length > 1) {
      const someComplexFilter = filters.find((item) => isQueryComplexFilter(item));
      if (someComplexFilter) {
        throw new Error("If you want to use complex filter it needs to start as root filter.");
      }
    }

    this.filters = filters;
  }

  public resetFilters() {
    this.filters = [];
  }

  // Groups

  public addGroup(group: IQueryGroup) {
    this.groups.push(group);
  }

  public setGroups(groups: IQueryGroup[]) {
    this.groups = groups;
  }

  public resetGroups() {
    this.groups = [];
  }

  // Aggregations

  public addAggregation(aggregation: IQueryAggregation) {
    this.aggregations.push(aggregation);
  }

  public setAggregations(aggregations: IQueryAggregation[]) {
    this.aggregations = aggregations;
  }

  public resetAggregations() {
    this.aggregations = [];
  }

  // Functions

  public addFunction(func: QueryFunction) {
    this.functions.push(func);
  }

  public setFunctions(functions: QueryFunction[]) {
    this.functions = functions;
  }

  public resetFunctions() {
    this.functions = [];
  }

  // Sorts

  public addSort(sort: IQuerySort) {
    this.sorts.push(sort);
  }

  public setSorts(sorts: IQuerySort[]) {
    this.sorts = sorts;
  }

  public resetSorts() {
    this.sorts = [];
  }

  /* Query Fetch API
  -------------------------------------------------------------------------*/

  public async getData(datasetId: string, pagination?: Partial<IQueryPagination>) {
    const startTime = new Date();

    // Check parameters
    if (!datasetId || datasetId.trim().length === 0) {
      return Promise.reject(new Error("Missing or invalid datasetId"));
    }

    // Prepare pagination
    const queryPagination = {...Query.defaultPagination};
    if (pagination) {
      const {start, limit} = pagination;
      if (start !== undefined) {
        if (start < 1) {
          return Promise.reject(Error("Pagination start needs to be >= 1"));
        }

        queryPagination.start = start;
      }

      if (limit !== undefined) {
        if (limit < 1) {
          return Promise.reject(new Error("Pagination limit needs to be >= 1"));
        }

        queryPagination.limit = limit;
      }
    }

    // Create query
    const query = this.getQuery();
    const createRequest = await this.client.request<ICreateQueryResponse>(Paths.query(datasetId), {
      method: "POST",
      body: JSON.stringify(query),
    });
    console.log("Query created.");
    if (!createRequest || !createRequest.status || !createRequest.data) {
      return Promise.reject(new Error("Query create failed."));
    }
    if (createRequest.status !== HTTPStatus.CREATED) {
      const message = createRequest.data["message"];
      return Promise.reject(new Error(message));
    }
    const queryId = createRequest.data.id;
    if (!queryId || queryId.length === 0) {
      return Promise.reject(new Error(`Invalid query ID ${queryId}`));
    }

    // Check if query ready
    const queryURL = Paths.queryById(datasetId, queryId) + qs.stringify(queryPagination, "?");
    while (true) {
      console.log("Query running...");
      const checkRequest = await this.client.request(queryURL, {
        method: "HEAD",
        headers: {Accept: "application/vnd.thinknum.table+json"},
      });
      if (!checkRequest || !checkRequest.status) {
        return Promise.reject(new Error("Query status check failed."));
      }
      if (checkRequest.status === HTTPStatus.OK) {
        break;
      } else if (checkRequest.status === HTTPStatus.ACCEPTED) {
        const diff = (Date.now() - startTime.getTime()) / 1000;
        if (diff > this.timeout) {
          return Promise.reject(new Error(`Timeout ${this.timeout}s exceeded.`));
        }

        await sleep(1000);
        continue;
      } else {
        return Promise.reject(new Error("Query status check result invalid."));
      }
    }
    console.log("Query ready. Fetching data...");

    // Fetch query result
    return await this.client.requestData<ITableFetchQueryResponse>(queryURL, {
      method: "GET",
      headers: {Accept: "application/vnd.thinknum.table+json"},
    });
  }
}
