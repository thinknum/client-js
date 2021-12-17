import {Client, Query} from "@thinknum/client-js";

function queryAppleJobListingCategoriesOfYear2021() {
  const client = new Client({
    clientId: "",
    clientSecret: "",
  });

  const query = new Query(client);
  query.addTicker("nasdaq:aapl");
  query.addFilter({
    column: "as_of_date",
    type: "[]",
    value: ["2021-01-01", "2021-12-31"],
  });
  query.addGroup({
    column: "category",
  });
  query.addAggregation({
    column: "dataset__entity__entity_ticker__ticker__ticker",
    type: "count",
  });
  query.addSort({
    column: "dataset__entity__entity_ticker__ticker__ticker@count",
    order: "desc",
  });
  query
    .getData("job_listings")
    .then((result) => {
      console.log("👀 ", result);
    })
    .catch((error) => {
      console.log("🛑 ", error);
    });
}

queryAppleJobListingCategoriesOfYear2021();
