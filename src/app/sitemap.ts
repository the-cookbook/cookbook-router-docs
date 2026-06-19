import type { MetadataRoute } from "next";
import { source } from "@/lib/source";

export const dynamic = "force-static";
export const revalidate = false;

interface StaticSitemapEntry {
  readonly pathname: string;
  readonly priority: number;
  readonly changeFrequency: NonNullable<
    MetadataRoute.Sitemap[number]["changeFrequency"]
  >;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const staticEntries: readonly StaticSitemapEntry[] = [
  {
    pathname: "/",
    priority: 1,
    changeFrequency: "weekly",
  },
];

function stripTrailingSlashes(value: string) {
  return value.replace(/\/+$/, "");
}

function normalizeBasePath(value: string) {
  if (!value) return "";

  const normalized = value.replace(/^\/+|\/+$/g, "");

  if (!normalized) return "";

  return `/${normalized}`;
}

function normalizePathname(value: string) {
  if (!value || value === "/") return "/";

  const pathname = value.startsWith("/") ? value : `/${value}`;

  return stripTrailingSlashes(pathname);
}

function toSitemapUrl(pathname: string) {
  const origin = stripTrailingSlashes(siteUrl);
  const normalizedBasePath = normalizeBasePath(basePath);
  const normalizedPathname = normalizePathname(pathname);

  if (normalizedPathname === "/") {
    return `${origin}${normalizedBasePath || "/"}`;
  }

  return `${origin}${normalizedBasePath}${normalizedPathname}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const homeEntries = staticEntries.map((entry) => ({
    url: toSitemapUrl(entry.pathname),
    lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));

  const docsEntries = source.getPages().map((page) => ({
    url: toSitemapUrl(page.url),
    lastModified,
    changeFrequency: "weekly" as const,
    priority:
      page.url === "/docs/router" || page.url === "/docs/bundler-plugins"
        ? 0.9
        : 0.7,
  }));

  return [...homeEntries, ...docsEntries].sort((a, b) =>
    a.url.localeCompare(b.url),
  );
}
