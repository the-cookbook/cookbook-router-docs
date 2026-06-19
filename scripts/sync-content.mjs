import { existsSync, readFileSync } from "node:fs";
import { algoliasearch } from "algoliasearch";
import { sync } from "fumadocs-core/search/algolia";

const appId =
  process.env.ALGOLIA_APP_ID ?? process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const adminApiKey = process.env.ALGOLIA_ADMIN_API_KEY;
const indexName =
  process.env.ALGOLIA_INDEX_NAME ?? process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME;
const filePath =
  process.env.FUMADOCS_SEARCH_INDEX_FILE ?? ".next/server/app/static.json.body";

if (!appId || !adminApiKey || !indexName) {
  throw new Error(
    [
      "Missing Algolia environment variables.",
      "Required:",
      "- ALGOLIA_APP_ID or NEXT_PUBLIC_ALGOLIA_APP_ID",
      "- ALGOLIA_ADMIN_API_KEY",
      "- ALGOLIA_INDEX_NAME or NEXT_PUBLIC_ALGOLIA_INDEX_NAME",
    ].join("\n"),
  );
}

if (!existsSync(filePath)) {
  throw new Error(
    [
      `Fumadocs search index file was not found: ${filePath}`,
      "",
      "Make sure:",
      "1. You have an app/static.json/route.ts route.",
      "2. You run this script after next build.",
      "3. The route is statically generated.",
    ].join("\n"),
  );
}

const raw = readFileSync(filePath, "utf8");
const records = JSON.parse(raw);

if (!Array.isArray(records)) {
  throw new Error(
    `Expected ${filePath} to contain an array of Fumadocs search records.`,
  );
}

if (!records.length) {
  throw new Error(
    `Fumadocs search index is empty. Nothing was synced to Algolia.`,
  );
}

const client = algoliasearch(appId, adminApiKey);

await sync(client, {
  indexName,
  documents: records,
});

console.log(
  `Synced ${records.length} Fumadocs document records to Algolia index "${indexName}".`,
);
