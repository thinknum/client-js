<p align="center">
<img src="https://user-images.githubusercontent.com/22453682/146544326-2133ed10-7e57-4c6b-98a7-c8749a4667f6.jpg" width="191" alt="thinknum">
</p>
<h1 align="center">
Thinknum JS API
</h1>
<p align="center">
An API client for Thinknum Alternative Data written in Typescript.
</p>

## 💎 Thinknum

As companies move their business operations to the Internet, new data trails are being created that can provide unique insights on these companies. Thinknum Alternative Data indexes all of these data trails in one platform, providing investors with critical data points that others miss.

## 🔧 Installation

```bash
npm i @thinknum/client-js
or
yarn add @thinknum/client-js
```

## 🌐 Usage

Initialize `Client` with API credentials. You can obtain those credentials from your assigned Thinknum account manager. Your clientSecret must not be shared or exposed via publicly accessible resources (such as browser client-side scripting).

```js
import {Client} from "@thinknum/client-js";

const client = new Client({
  clientId: "apiID",
  clientSecret: "apiSecret",
});
```

### Datasets & search API

You will get a list of datasets, each of which has the dataset id and its display_name.

```js
const datasets = await client.getDatasetList();
```

You will get dataset's metadata.

```js
const metadata = await client.getDatasetMetadata("job_listings");
```

It's possible to limit the dataset list to a specific ticker by specific a "ticker" query parameter. For example, getting all datasets available for Apple Inc:

```js
const datasets = await client.getTickerDatasetList("nasdaq:aapl");
```

You can search for tickers.

```js
const tickers = await client.getTickerList("tesla");
```

You can also search for tickers of particular dataset

```js
const tickers = await client.getTickerList("tesla", "job_listings");
```

### Query

Initialize `Query` with client object or API credentials.

```js
import {Client, Query} from "@thinknum/client-js";

const client = new Client({
  clientId: "apiID",
  clientSecret: "apiSecret",
});

const query = new Query(client);
```

The default timeout is 180 seconds. If you need to change timeout seconds, you can configure it with the timeout argument.

```js
const query = new Query(client, 300); // timeout set to 300 seconds
```

You can retrieve data for specific dataset and tickers with various filters. To retrieve data lulu's job listings in 2020, an example request is:

```js
import {DateFilterType, SortOrder} from "@thinknum/client-js";

const query = new Query(client);
query.addTicker("nasdaq:lulu");
query.addFilter({
  column: "as_of_date",
  type: DateFilterType.BETWEEN,
  value: ["2020-01-01", "2020-12-31"],
});
query.addSort({
  column: "as_of_date",
  order: SortOrder.DESC,
});
const data = await query.getData("job_listings");
```

You can retrieve data with OR filters. To retrieve lulu's job listings which title has `sales` or description has `sales` in 2020, an example request is:

```js
import {
  DateFilterType,
  IQuerySimpleFilter,
  ComplexFilterMatch,
  IQueryComplexFilter,
  StringFilterType,
} from "@thinknum/client-js";

const query = new Query(client);
query.addTicker("nasdaq:lulu");

const dateFilter: IQuerySimpleFilter = {
  column: "as_of_date",
  type: DateFilterType.BETWEEN,
  value: ["2020-01-01", "2020-12-31"],
};

const titleAndDescriptionFilter: IQueryComplexFilter = {
  match: ComplexFilterMatch.ANY,
  conditions: [
    {
      column: "title",
      type: StringFilterType.CONTAINS,
      value: ["sales"],
    },
    {
      column: "description",
      type: StringFilterType.CONTAINS,
      value: ["sales"],
    },
  ],
};

query.addFilter({
  match: ComplexFilterMatch.ALL,
  conditions: [dateFilter, titleAndDescriptionFilter],
});
const data = await query.getData("job_listings");
```

You can retrieve data with more complicated filters. To retrieve lulu's sales job in 2020 or marketing job in 2021:

```js
const query = new Query(client);
query.addTicker("nasdaq:lulu");

const date2020Filter: IQuerySimpleFilter = {
  column: "as_of_date",
  type: DateFilterType.BETWEEN,
  value: ["2020-01-01", "2020-12-31"],
};

const date2021Filter: IQuerySimpleFilter = {
  column: "as_of_date",
  type: DateFilterType.BETWEEN,
  value: ["2021-01-01", "2021-12-31"],
};

const salesJobsIn2020Filter: IQueryComplexFilter = {
  match: ComplexFilterMatch.ALL,
  conditions: [
    date2020Filter,
    {
      column: "title",
      type: StringFilterType.CONTAINS,
      value: ["sales"],
    },
  ],
};

const marketingJobsIn2021Filter: IQueryComplexFilter = {
  match: ComplexFilterMatch.ALL,
  conditions: [
    date2021Filter,
    {
      column: "title",
      type: StringFilterType.CONTAINS,
      value: ["marketing"],
    },
  ],
};

query.addFilter({
  match: ComplexFilterMatch.ALL,
  conditions: [salesJobsIn2020Filter, marketingJobsIn2021Filter],
});
const data = await query.getData("job_listings");
```

**Please note that the maximum depth of condition is two.**

You can also specify `start` and `limit`. The default values are `1` and `100000`.

```js
query.getData("job_listings", {start: 1, limit: 1000});
```

Sometimes you only need get aggregated results for a dataset. In such cases you can retrieve them through the `addGroup` and `addAggregation` functions.

```js
const query = new Query(client);
query.addTicker("nasdaq:lulu");
query.addGroup({column: "as_of_date"});
query.addAggregation({column: "as_of_date", type: QueryAggregationType.COUNT});
query.addSort({column: "as_of_date", order: SortOrder.ASC});
const data = await query.getData("job_listings");
```

There a few functions that you can apply to queries to gather even more insight into the data. You can retrieve a listing of the available functions in a dataset with the `getDatasetMetadata` client function. For example, there is `nearby` function for `store` dataset.

```js
const query = new Query(client);
query.addTicker("nasdaq:lulu");
query.addFunction({
  function: QueryFunctionName.NEARBY,
  parameters: {
    dataset_type: NearlikeFunctionDatasetType.DATASET,
    dataset: "store",
    tickers: ["nyse:ua"],
    entities: [],
    distance: 5,
    is_include_closed: false,
  },
});
const data = await query.getData("store");
```

Also, you can apply `nearest` function to `store` dataset like the following code.

```js
const query = new Query(client);
query.addTicker("nasdaq:lulu");
query.addFunction({
  function: QueryFunctionName.NEAREST,
  parameters: {
    dataset_type: NearlikeFunctionDatasetType.DATASET,
    dataset: "store",
    tickers: ["nyse:ua"],
    entities: [],
    ranks: [1],
    is_include_closed: false,
  },
});
const data = await query.getData("store");
```

Also, you can apply `sales` function to `Car Inventory` dataset like the following code.

```js
const query = new Query(client);
query.addTicker("nyse:kmx");
query.addFunction({
  function: QueryFunctionName.SALES,
  parameters: {
    lookahead_day_count: 2,
    start_date: "2020-01-01",
    end_date: "2021-01-07",
  },
});
const data = await query.getData("car_inventory");
```

Also, you can reset entire query.

```js
query.resetQuery();
```

Also, you can reset tickers.

```js
query.resetTickers();
```

Also, you can reset filters.

```js
query.resetFilters();
```

Also, you can reset functions.

```js
query.resetFunctions();
```

Also, you can reset groups.

```js
query.resetGroups();
```

Also, you can reset aggregations.

```js
query.resetAggregations();
```

Also, you can reset sorts.

```js
query.resetSorts();
```

## For more details about Library or API

Please visit https://docs.thinknum.com/docs

## If you are interested in Thinknum

Please request demo at https://www.thinknum.com/demo/

## If you have any questions

Please email at customersuccess@thinknum.com

## License

MIT
