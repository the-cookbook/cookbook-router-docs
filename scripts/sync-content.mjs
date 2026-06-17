import { readFileSync } from "node:fs";
import { algoliasearch } from "algoliasearch";
import { sync } from "fumadocs-core/search/algolia";

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const adminApiKey = process.env.ALGOLIA_ADMIN_API_KEY;
const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME;
const filePath =
  process.env.FUMADOCS_SEARCH_INDEX_FILE ?? ".next/server/app/static.json.body";

if (!appId || !adminApiKey || !indexName) {
  throw new Error(
    "Missing Algolia environment variables. Set NEXT_PUBLIC_ALGOLIA_APP_ID, ALGOLIA_ADMIN_API_KEY, and NEXT_PUBLIC_ALGOLIA_INDEX_NAME.",
  );
}

const records = JSON.parse(readFileSync(filePath, "utf8"));
const client = algoliasearch(appId, adminApiKey);

await sync(client, {
  indexName,
  documents: records,
});
