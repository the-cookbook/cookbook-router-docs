"use client";

import { create } from "@orama/orama";
import { liteClient } from "algoliasearch/lite";
import React, { useMemo } from "react";

import { useDocsSearch } from "fumadocs-core/search/client";
import { algoliaClient as createAlgoliaClient } from "fumadocs-core/search/client/algolia";
import { oramaStaticClient } from "fumadocs-core/search/client/orama-static";
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogOverlay,
  type SharedProps,
} from "fumadocs-ui/components/dialog/search";
import { useI18n } from "fumadocs-ui/contexts/i18n";

interface AlgoliaEnv {
  readonly appId: string;
  readonly searchApiKey: string;
  readonly indexName: string;
}

interface SearchResultItem {
  readonly id?: string;
  readonly url: string;
  readonly title?: string;
  readonly section?: string;
  readonly content?: string;
  readonly type?: string;
}

interface HighlightedTextProps {
  readonly value: string;
}

interface SearchResultsProps {
  readonly items: ReadonlyArray<SearchResultItem> | null;
  readonly search: string;
  readonly onSelect: () => void;
}

function initOrama() {
  return create({
    schema: { _: "string" },
    language: "english",
  });
}

function getAlgoliaEnv(): AlgoliaEnv | null {
  const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
  const searchApiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY;
  const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME;

  if (!appId || !searchApiKey || !indexName) {
    return null;
  }

  return {
    appId,
    searchApiKey,
    indexName,
  };
}

const algoliaEnv = getAlgoliaEnv();

const algolia = algoliaEnv
  ? liteClient(algoliaEnv.appId, algoliaEnv.searchApiKey)
  : null;

function getResultTitle(item: SearchResultItem) {
  return item.title ?? item.section ?? item.content ?? item.url;
}

function HighlightedText({ value }: HighlightedTextProps) {
  const segments = value.split(/<\/?mark>/i);

  if (segments.length === 1) {
    return value;
  }

  return (
    <>
      {segments.map((segment, index) => {
        if (!segment) {
          return null;
        }

        const isHighlighted = index % 2 === 1;
        const key = `${index}-${segment}`;

        if (isHighlighted) {
          return (
            <mark
              key={key}
              className="bg-transparent text-fd-foreground underline underline-offset-2"
            >
              {segment}
            </mark>
          );
        }

        return <span key={key}>{segment}</span>;
      })}
    </>
  );
}

function SearchResults({ items, search, onSelect }: SearchResultsProps) {
  if (!search.trim()) {
    return (
      <div className="px-4 py-8 text-center text-sm text-fd-muted-foreground">
        Start typing to search the documentation.
      </div>
    );
  }

  if (!items?.length) {
    return (
      <div className="px-4 py-8 text-center text-sm text-fd-muted-foreground">
        No results found.
      </div>
    );
  }

  return (
    <div
      role="list"
      aria-label="Search results"
      className="max-h-[min(70vh,32rem)] overflow-y-auto p-2"
    >
      {items.map((item) => {
        const title = getResultTitle(item);
        const key = item.id ?? `${item.url}-${item.content ?? title}`;

        return (
          <React.Fragment key={key}>
            <a
              href={item.url}
              onClick={onSelect}
              className="block rounded-lg px-3 py-2 transition hover:bg-fd-accent hover:text-fd-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring"
            >
              <span className="block text-sm font-medium">
                <HighlightedText value={title} />
              </span>

              {item.content ? (
                <span className="mt-1 block text-xs leading-5 text-fd-muted-foreground">
                  <span className="font-medium text-fd-foreground">
                    Content:
                  </span>{" "}
                  <HighlightedText value={item.content} />
                </span>
              ) : null}

              {item.type ? (
                <span className="mt-1 block text-[10px] uppercase tracking-wide text-fd-muted-foreground">
                  {item.type}
                </span>
              ) : null}
            </a>
            <hr />
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function DefaultSearchDialog(props: SharedProps) {
  const { locale } = useI18n();

  const client = useMemo(() => {
    if (algolia && algoliaEnv) {
      return createAlgoliaClient({
        client: algolia,
        indexName: algoliaEnv.indexName,
        locale,
      });
    }

    return oramaStaticClient({
      initOrama,
      locale,
    });
  }, [locale]);

  const { search, setSearch, query } = useDocsSearch({
    client,
  });

  const items =
    query.data && query.data !== "empty"
      ? (query.data as ReadonlyArray<SearchResultItem>)
      : null;

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

        <SearchResults
          items={items}
          search={search}
          onSelect={() => props.onOpenChange?.(false)}
        />

        {algoliaEnv ? (
          <SearchDialogFooter>
            <a
              href="https://algolia.com"
              target="_blank"
              rel="noreferrer noopener"
              className="ms-auto text-xs text-fd-muted-foreground"
            >
              Search powered by Algolia
            </a>
          </SearchDialogFooter>
        ) : null}
      </SearchDialogContent>
    </SearchDialog>
  );
}
