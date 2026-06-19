import { Image } from "fumadocs-core/framework";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import Link from "next/link";
import Harpy from "@/assets/harpy.png";
import HarpyDocs from "@/assets/harpy-docs.png";
import { cn } from "@/lib/cn";

const animatedUnderline = [
  "relative inline-block",
  "after:absolute after:-bottom-1 after:left-0",
  "after:h-0.5 after:w-full after:bg-current",
  "after:origin-left after:scale-x-0",
  "after:transition-transform after:duration-300 after:ease-out",
  "hover:after:scale-x-100",
  "focus-visible:after:scale-x-100",
  "motion-reduce:after:transition-none",
].join(" ");

const proofPoints = [
  {
    label: "One source",
    value: "One route. One truth.",
    description:
      "Matching, links, URL state, middleware, rendering, tests, and SSR all answer to the same route contract.",
  },
  {
    label: "End-to-end typing",
    value: (
      <>
        <code className="font-mono bg-fd-muted-foreground/15 dark:bg-fd-muted-foreground/45 px-1 py-0.5 rounded-sm font-light text-2xl">
          {"{id:int}"}
        </code>{" "}
        means number.{" "}
        <span className="font-extrabold tracking-wider">Everywhere</span>.
      </>
    ),
    description:
      "Params, search, and hash are inferred from the route contract. Wrong values fail in links and navigation before the app runs.",
  },
  {
    label: "Build integration",
    value: "Fits your build.",
    description:
      "Generate and validate route artifacts during development and production builds.",
    details: "Vite · Webpack · Rspack · Rollup · esbuild · Bun",
  },
];

const outcomes = [
  {
    label: "Refactor without archaeology",
    title: "A route ID that survives when a pathname changes.",
    description:
      "Stop copying paths into links, redirects, middleware, tests, and components. Navigate through a contract instead of hunting strings across the repository.",
    href: "/docs/router/concepts/typed-contracts",
    linkLabel: "Explore typed contracts",
  },
  {
    label: "Validate before rendering",
    title: "Pages receive verified URL state.",
    description:
      "Params, search values, and hash state are parsed against the route definition before application code depends on them.",
    href: "/docs/router/concepts/search-and-hash",
    linkLabel: "Explore URL state",
  },
  {
    label: "Put policy where it belongs",
    title: "Authorization runs before the page.",
    description:
      "Middleware can redirect, rewrite, cancel, or return a response before navigation commits. No access-control effects pretending to be architecture.",
    href: "/docs/router/concepts/middleware",
    linkLabel: "Explore middleware",
  },
  {
    label: "Model the real interface",
    title: "Layouts, slots, and modals stay routable.",
    description:
      "Represent shells, sidebars, modal routes, previews, and split views in the route tree instead of rebuilding routing behavior around it.",
    href: "/docs/router/concepts/layouts-outlets-and-slots",
    linkLabel: "Explore routed layouts",
  },
];

const features = [
  {
    title: "Typed params, search, and hash",
    description:
      "Declare URL state beside the route and consume parsed values instead of raw strings.",
  },
  {
    title: "Middleware and lifecycle",
    description:
      "Handle authorization, analytics, redirects, rewrites, cancellation, audit trails, and navigation policy.",
  },
  {
    title: "Layouts, outlets, and slots",
    description:
      "Build nested application shells and named routed surfaces without turning layout structure into hidden component state.",
  },
  {
    title: "Route intercepts",
    description:
      "Open route-driven modals, previews, and split views while preserving a navigable destination.",
  },
  {
    title: "Preloading and lazy views",
    description:
      "Preload route data and modules intentionally, then integrate lazy route views with React.",
  },
  {
    title: "SSR and hydration",
    description:
      "Use static routing, serialization, hydration checks, and the same route contracts on the server and client.",
  },
  {
    title: "Validation and diagnostics",
    description:
      "Reject duplicate IDs, invalid route structures, malformed redirects, missing params, and unsafe generated output.",
  },
  {
    title: "Generated contracts",
    description:
      "Generate TypeScript contracts, declarations, manifests, and composable route modules from static route definitions.",
  },
];

const packages = [
  {
    name: "@cookbook/router",
    label: "Core",
    description:
      "The framework-agnostic engine for route definitions, matching, URL contracts, middleware, lifecycle, histories, rendering traversal, validation, and SSR.",
    href: "/docs/router/api/router",
  },
  {
    name: "@cookbook/router-react",
    label: "React",
    description:
      "Providers, links, navigation hooks, outlets, slots, intercept rendering, blockers, lazy views, and static rendering integration.",
    href: "/docs/router/api/router-react",
  },
  {
    name: "@cookbook/router-cli",
    label: "CLI",
    description:
      "Generate route contracts, manifests, declarations, and route modules. Validate the route tree in development, builds, and CI.",
    href: "/docs/router/api/router-cli",
  },
];

const plugins = [
  { name: "Vite", href: "/docs/bundler-plugins/vite/" },
  { name: "Webpack", href: "/docs/bundler-plugins/webpack/" },
  { name: "Rspack", href: "/docs/bundler-plugins/rspack/" },
  { name: "Rollup", href: "/docs/bundler-plugins/rollup-and-rolldown/" },
  { name: "Rolldown", href: "/docs/bundler-plugins/rollup-and-rolldown/" },
  { name: "esbuild", href: "/docs/bundler-plugins/esbuild/" },
  { name: "Bun", href: "/docs/bundler-plugins/bun/" },
];

const journeys = [
  {
    label: "Build",
    title: "Start with a working application.",
    description:
      "Install the packages, declare the first route tree, create the router, and render it.",
    href: "/docs/router/getting-started/quick-start",
    linkLabel: "Open the quick start",
  },
  {
    label: "Understand",
    title: "Learn why the contract matters.",
    description:
      "Follow the route from declaration through matching, URL state, middleware, rendering, and hydration.",
    href: "/docs/router/concepts/route-definitions",
    linkLabel: "Read framework concepts",
  },
  {
    label: "Reference",
    title: "Find the exact public contract.",
    description:
      "Inspect signatures, options, return values, overloads, failure behavior, and package boundaries.",
    href: "/docs/router/api",
    linkLabel: "Browse the API",
  },
  {
    label: "Ship",
    title: "Use a production pattern.",
    description:
      "Start from recipes for authentication, typed links, modal routes, SSR, search filters, tests, and CI validation.",
    href: "/docs/router/recipes",
    linkLabel: "Browse recipes",
  },
];

const routeCode = `import { defineRoutes, lazyRouteView } from '@cookbook/router';

const UserPage = lazyRouteView(()=> import("./pages/user-page.tsx"));

export const routes = defineRoutes([
  {
    id: 'root',
    path: '/',
    layout: {
      view: AppShell,
    },
    children: [
      {
        id: 'users.show',
        path: 'users/{id:int}',
        search: {
          tab: {
            type: 'enum',
            values: ['profile', 'settings'],
            default: 'profile',
          },
        },
        middleware: [requireAuth],
        view: UserPage,
        meta: {
          title: 'User',
          requiresAuth: true,
        },
      },
    ],
  },
] as const);`;

const consumerCode = `import { Link, useParams, useSearchParams } from '@cookbook/router-react';

export function UserLink() {
  return (
    <Link
      to="users.show"
      params={{ id: 42 }}
      search={{ tab: 'settings' }}
      prefetch="mount"
    >
      Open settings
    </Link>
  );
}

export function UserPage() {
  const params = useParams('users.show');
  const search = useSearchParams('users.show');

  // params.id: number
  // search.tab: 'profile' | 'settings'
}`;

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-fd-background via-fd-background to-fd-muted/40">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-10 px-6 py-20 md:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="order-2 text-left md:order-1">
          <p className="mb-5 inline-flex rounded-full border bg-fd-card px-3 py-1 font-mono text-xs">
            A router for apps that got serious.
          </p>

          <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-fd-foreground md:text-7xl">
            <span className="text-3xl md:text-5xl">Every app has routes.</span>
            <br />
            Few apps really know them.
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-fd-muted-foreground md:text-xl">
            Cookbook Router turns routes into knowledge for links, navigation,
            params, search, middleware, layouts, validation, testing, and SSR.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/docs/router/getting-started/quick-start"
              className={cn(
                "rounded-full bg-fd-primary px-5 py-3 text-sm font-semibold text-fd-primary-foreground transitiona-all ease-in-out duration-150 hover:opacity-90",
                "hover:scale-105 hover:outline-2 outline-offset-2 outline-fd-primary",
              )}
            >
              Get started
            </Link>

            <Link
              href="/docs/router/concepts/typed-contracts"
              className={cn(
                "rounded-full border bg-fd-card px-5 py-3 text-sm font-semibold text-fd-foreground transition hover:bg-fd-muted",
                "hover:translate-x-2 hover:outline-2 outline-offset-2 outline-fd-border",
              )}
            >
              See why it is different
            </Link>
          </div>
        </div>

        <div className="group relative order-1 flex justify-center md:order-2">
          <div className="absolute inset-8 rounded-full bg-fd-primary/10 blur-3xl" />

          <div className="relative w-full max-w-[440px]">
            <Image
              src={Harpy}
              alt="Harpy Docs mascot"
              className="
                relative w-full drop-shadow-2xl pointer-events-none
                transition-all duration-150 ease-out
                opacity-100
                group-hover:opacity-0
              "
              loading="eager"
            />

            <Image
              src={HarpyDocs}
              alt="Harpy Docs mascot"
              className="
                absolute inset-0 w-full drop-shadow-2xl pointer-events-none
                transition-all duration-150 ease-out
                opacity-0
                group-hover:opacity-100
              "
              loading="eager"
            />
          </div>
        </div>
      </section>

      <section className="border-y bg-fd-card/50">
        <div className="mx-auto grid max-w-7xl divide-y px-6 md:grid-cols-3 md:divide-x md:divide-y-0 lg:px-8 overflow-hidden">
          {proofPoints.map((point) => (
            <div
              key={point.label}
              className="py-8 md:px-8 md:first:pl-0 hover:scale-110 transition-scale ease-in-out duration-150"
            >
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-fd-muted-foreground">
                {point.label}
              </p>

              <p className="mt-4 max-w-sm text-3xl font-bold tracking-tight text-fd-foreground">
                {point.value}
              </p>

              <p className="mt-4 max-w-md text-sm leading-6 text-fd-muted-foreground">
                {point.description}
              </p>

              {point.details && (
                <p className="mt-5 font-mono font-semibold text-xs leading-6 text-fd-muted-foreground">
                  {point.details}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-fd-muted-foreground">
              The actual problem
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              Routing already shapes the app.
              <br />
              Your router should know it.
            </h2>

            <p className="mt-6 text-lg leading-8 text-fd-muted-foreground">
              A production route is a path, a parser, an access rule, a
              navigation target, a layout decision, a test fixture, and an SSR
              concern. Spread that knowledge across the app and flexibility
              becomes maintenance. Five places to update. Six ways to be wrong.
            </p>

            <Link
              href="/docs/router/concepts/route-definitions"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold"
            >
              Understand the route model
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {outcomes.map((outcome) => (
              <article
                key={outcome.title}
                className="group flex min-h-72 flex-col rounded-3xl border bg-fd-card p-7 transition hover:-translate-y-2 hover:shadow-lg"
              >
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-fd-muted-foreground">
                  {outcome.label}
                </p>

                <h3 className="mt-5 text-2xl font-semibold tracking-tight">
                  {outcome.title}
                </h3>

                <p className="mt-4 flex-1 text-sm leading-7 text-fd-muted-foreground">
                  {outcome.description}
                </p>

                <Link
                  href={outcome.href}
                  className={cn(
                    "group/link mt-8 inline-flex w-fit items-center gap-2 text-sm font-semibold",
                    animatedUnderline,
                  )}
                >
                  {outcome.linkLabel}
                  <span
                    aria-hidden="true"
                    className="transition-transform ease-in-out duration-150 ml-1 group-hover/link:translate-x-1 inline-block"
                  >
                    →
                  </span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y bg-fd-card/50">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-fd-muted-foreground">
              One declaration.{" "}
              <span className="border-1 border-b-2 border-fd-muted-foreground/50 px-1 py-0.5 rounded-sm">
                Several guarantees.
              </span>
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              <span className="font-extrabold">
                Define what the route means.
              </span>
              <br />
              Make the whole app answer to it.
            </h2>

            <p className="mt-6 text-lg leading-8 text-fd-muted-foreground">
              The route tree is not a list of screens. It is the contract shared
              by runtime navigation, React rendering, generated types, tests,
              builds, and the server.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="overflow-hidden rounded-3xl border bg-fd-background p-4 drop-shadow-xl">
              <div className="px-3 pb-3 pt-2">
                <p className="font-mono text-xs text-fd-muted-foreground">
                  <span className="px-1 py-0.5 border border-fd-muted-foreground/20 bg-fd-muted-foreground/5 rounded-xs">
                    routes.ts
                  </span>
                </p>
              </div>

              <DynamicCodeBlock lang="ts" code={routeCode} />
            </div>

            <div className="overflow-hidden rounded-3xl border bg-fd-background p-4 drop-shadow-xl">
              <div className="px-3 pb-3 pt-2">
                <p className="font-mono text-xs text-fd-muted-foreground">
                  <span className="px-1 py-0.5 border border-fd-muted-foreground/20 bg-fd-muted-foreground/5 rounded-xs">
                    user-page.tsx
                  </span>
                </p>
              </div>

              <DynamicCodeBlock lang="tsx" code={consumerCode} />
            </div>
          </div>

          <div className="mt-8 grid gap-px overflow-hidden rounded-xl border bg-fd-border sm:grid-cols-4 drop-shadow-xl">
            {[
              ["Route ID", "users.show"],
              ["Path param", "id: number"],
              ["Search state", "profile | settings"],
              ["Policy", "requireAuth"],
            ].map(([label, value]) => (
              <div key={label} className="bg-fd-card px-6 py-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-fd-muted-foreground">
                  {label}
                </p>
                <p className="mt-2 font-mono text-sm font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border bg-fd-card shadow-sm">
          <div className="grid gap-8 p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-fd-muted-foreground">
                Live demo
              </p>

              <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
                Routing under pressure. Try the demo.
              </h3>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-fd-muted-foreground md:text-base">
                Open the demo and move through the parts routers usually
                flatten: shell layouts, modal routes, search params, auth
                redirects, lazy loading, error fallbacks, prefetching, and
                dirty-form blockers. The route contract is not sitting in a
                README. It is driving the app.
              </p>
            </div>

            <Link
              href="https://the-cookbook.github.io/cookbook-router/"
              target="_blank"
              rel="noreferrer"
              className={cn(
                "inline-flex items-center justify-center rounded-full bg-fd-primary px-5 py-3 text-sm font-semibold text-fd-primary-foreground transition-all duration-150 ease-in-out",
                "hover:-translate-y-0.5 hover:opacity-90",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-primary",
              )}
            >
              Try the demo
              <span aria-hidden="true" className="ml-1.5">
                ↗
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-fd-muted-foreground">
            Built for application routing
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
            More than matching a pathname to a component.
          </h2>

          <p className="mt-6 text-lg leading-8 text-fd-muted-foreground">
            The happy path is easy in every router. Cookbook Router focuses on
            what happens after the application grows teeth.
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border bg-fd-border sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="bg-fd-card p-7 transition hover:-translate-y-1 hover:drop-shadow-xl"
            >
              <h3 className="text-lg font-semibold tracking-tight">
                {feature.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-fd-muted-foreground">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="rounded-[2rem] border bg-fd-foreground p-8 text-fd-background md:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] opacity-65">
                The package model
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
                Use the router you need.
                <br />
                <span className="underline underline-offset-2 decoration-2">
                  Do not inherit the rest.
                </span>
              </h2>
            </div>

            <p className="max-w-2xl text-lg leading-8 opacity-75">
              The routing engine is framework-agnostic. React integration is a
              separate layer. Generation and build integration stay outside the
              runtime package.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {packages.map((pkg) => (
              <Link
                key={pkg.name}
                href={pkg.href}
                className="group flex-col flex hover:scale-105 hover:-translate-y-2 hover:shadow-2xl rounded-3xl border border-fd-background/20 bg-fd-background/5 p-6 transition-all hover:bg-fd-background/10"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">
                  {pkg.label}
                </p>

                <h3 className="mt-4 break-words font-mono text-lg font-semibold">
                  {pkg.name}
                </h3>

                <p className="mt-4 text-sm leading-7 opacity-70 flex-1">
                  {pkg.description}
                </p>

                <p
                  className={cn(
                    "group/link mt-7 inline-flex items-center gap-2 text-sm font-semibold w-fit",
                    animatedUnderline,
                  )}
                >
                  Open API reference
                  <span
                    aria-hidden="true"
                    className="transition-transform ease-in-out duration-150 ml-1 group-hover/link:translate-x-1 inline-block"
                  >
                    →
                  </span>
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-10 rounded-[2rem] border bg-fd-card p-8 md:p-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-fd-muted-foreground">
              Generation where builds happen
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              Make the route contract part of the build.
            </h2>

            <p className="mt-6 text-lg leading-8 text-fd-muted-foreground">
              Plugins that runs the same generation and validation pipeline
              during development and production builds, so invalid routes fail
              early and generated artifacts stay in sync.
            </p>

            <Link
              href="/docs/bundler-plugins/choose-a-plugin"
              className={cn(
                "mt-8 inline-flex items-center gap-2 rounded-full bg-fd-primary px-5 py-3 text-sm font-semibold text-fd-primary-foreground transition hover:opacity-90",
                "hover:-translate-y-1 hover:shadow-lg",
              )}
            >
              Choose a bundler plugin
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {plugins.map(({ name, href }) => (
              <div
                key={name}
                className="flex rounded-2xl border bg-black/10 dark:bg-white/10 px-4 font-mono text-sm font-semibold transition-all ease-in-out duration-150 hover:-translate-y-1 outline-0 outline-offset-3 outline-zinc-500 hover:outline-2 "
              >
                <Link
                  href={href}
                  className="flex min-h-24 items-center justify-center text-center w-full"
                >
                  {name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-fd-muted-foreground">
            Pick your entry point
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
            Read less. Find the page that moves the work forward.
          </h2>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {journeys.map((journey) => (
            <Link
              key={journey.label}
              href={journey.href}
              className="group rounded-3xl border bg-fd-card p-7 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-fd-muted-foreground">
                {journey.label}
              </p>

              <h3 className="mt-4 text-2xl font-semibold tracking-tight">
                {journey.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-fd-muted-foreground">
                {journey.description}
              </p>

              <p
                className={cn(
                  "group/link mt-7 inline-flex items-center gap-2 text-sm font-semibold w-fit",
                  animatedUnderline,
                )}
              >
                {journey.linkLabel}
                <span
                  aria-hidden="true"
                  className="transition-transform ease-in-out duration-150 ml-1 group-hover/link:translate-x-1 inline-block"
                >
                  →
                </span>
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 pt-8 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border bg-fd-primary text-fd-primary-foreground">
          <div className="grid gap-10 p-8 md:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] opacity-70">
                Stop routing by guesswork
              </p>

              <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
                Give the application one route contract and make every layer
                answer to it.
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-8 opacity-80">
                Start with the core. Add React when you render with React. Add
                generation when you want typed route IDs, params, search, hash,
                autocomplete, and build-time validation.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/docs/router/getting-started/installation"
                className="rounded-full bg-fd-background px-6 py-3 text-center text-sm font-semibold text-fd-foreground transition hover:opacity-90"
              >
                Install Cookbook Router
              </Link>

              <Link
                href="/docs/router/getting-started/quick-start"
                className="rounded-full border border-fd-primary-foreground/30 px-6 py-3 text-center text-sm font-semibold transition hover:bg-fd-primary-foreground/10"
              >
                Read the quick start
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
