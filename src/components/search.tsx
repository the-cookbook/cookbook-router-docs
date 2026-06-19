"use client";
import { create } from "@orama/orama";
import { liteClient } from "algoliasearch/lite";
import { useDocsSearch } from "fumadocs-core/search/client";
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SharedProps,
} from "fumadocs-ui/components/dialog/search";
import { useI18n } from "fumadocs-ui/contexts/i18n";

function initOrama() {
  return create({
    schema: { _: "string" },
    language: "english",
  });
}

const algoliaAppId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const algoliaSearchApiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY;
const algoliaIndexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME;
const hasAlgolia = Boolean(
  algoliaAppId && algoliaSearchApiKey && algoliaIndexName,
);
const algoliaClient = hasAlgolia
  ? liteClient(algoliaAppId as string, algoliaSearchApiKey as string)
  : null;

export default function DefaultSearchDialog(props: SharedProps) {
  const { locale } = useI18n();
  const { search, setSearch, query } = useDocsSearch(
    hasAlgolia && algoliaClient
      ? {
          type: "algolia",
          client: algoliaClient,
          indexName: algoliaIndexName as string,
        }
      : {
          type: "static",
          initOrama,
          locale,
        },
  );

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      {...props}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={query.data !== "empty" ? query.data : null} />
      </SearchDialogContent>
    </SearchDialog>
  );
}
