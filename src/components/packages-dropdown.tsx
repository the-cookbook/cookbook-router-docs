import { NpmIcon } from "@/components/npm-icon";

interface PackageItem {
  readonly name: string;
  readonly description: string;
  readonly href: string;
}

const packages: ReadonlyArray<PackageItem | "separator" | { group: string }> = [
  { group: "Framework" },
  {
    name: "@cookbook/router",
    description:
      "Framework-agnostic routing, matching, URL contracts, middleware, histories, validation, and SSR.",
    href: "https://www.npmjs.com/package/@cookbook/router",
  },
  {
    name: "@cookbook/router-react",
    description:
      "React providers, links, hooks, outlets, slots, intercepts, blockers, and static rendering.",
    href: "https://www.npmjs.com/package/@cookbook/router-react",
  },
  "separator",
  { group: "CLI" },
  {
    name: "@cookbook/router-cli",
    description:
      "Route generation, validation, manifests, declarations, configuration, and watch mode.",
    href: "https://www.npmjs.com/package/@cookbook/router-cli",
  },
  "separator",
  { group: "Build Integration" },
  {
    name: "@cookbook/router-vite-plugin",
    description:
      "Route generation and validation integrated with Vite development and production builds.",
    href: "https://www.npmjs.com/package/@cookbook/router-vite-plugin",
  },
  {
    name: "@cookbook/router-webpack-plugin",
    description:
      "Route generation, dependency tracking, validation, and recovery for Webpack.",
    href: "https://www.npmjs.com/package/@cookbook/router-webpack-plugin",
  },
  {
    name: "@cookbook/router-rspack-plugin",
    description: "Cookbook Router build integration for Rspack projects.",
    href: "https://www.npmjs.com/package/@cookbook/router-rspack-plugin",
  },
  {
    name: "@cookbook/router-rollup-plugin",
    description:
      "Route generation and validation for Rollup and compatible Rolldown workflows.",
    href: "https://www.npmjs.com/package/@cookbook/router-rollup-plugin",
  },
  {
    name: "@cookbook/router-esbuild-plugin",
    description: "Route generation and validation during esbuild builds.",
    href: "https://www.npmjs.com/package/@cookbook/router-esbuild-plugin",
  },
  {
    name: "@cookbook/router-bun-plugin",
    description: "Route generation and validation through Bun's plugin system.",
    href: "https://www.npmjs.com/package/@cookbook/router-bun-plugin",
  },
];

export function PackagesDropdown() {
  return (
    <details className="group relative">
      <summary
        aria-label="Open npm packages"
        className="flex size-9 cursor-pointer list-none items-center justify-center rounded-md text-fd-muted-foreground transition hover:bg-fd-accent hover:text-fd-accent-foreground [&::-webkit-details-marker]:hidden"
      >
        <NpmIcon aria-hidden="true" className="size-7" />
      </summary>

      <div className="absolute right-0 top-11 z-50 w-80 overflow-hidden rounded-xl border bg-fd-popover p-2 text-fd-popover-foreground shadow-xl">
        <div className="flex items-center gap-2 px-3 py-2">
          <NpmIcon aria-hidden="true" className="size-8" />

          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-fd-muted-foreground">
            npm packages
          </p>
        </div>

        <div className="max-h-[min(70vh,32rem)] overflow-y-auto">
          {packages.map((pkg) => {
            if (pkg === "separator") {
              return <hr className="my-5" />;
            }

            if ("group" in pkg) {
              return (
                <p className="text-[10px] font-semibold uppercase px-3 text-fd-muted-foreground">
                  {pkg.group}
                </p>
              );
            }
            return (
              <a
                key={pkg.name}
                href={pkg.href}
                target="_blank"
                rel="noreferrer"
                className="group/item block rounded-lg px-3 py-2 transition hover:bg-fd-accent/60 hover:text-fd-accent-foreground"
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="font-mono text-sm font-semibold">
                    {pkg.name}
                  </span>

                  <span
                    aria-hidden="true"
                    className="shrink-0 text-xs text-fd-muted-foreground transition group-hover/item:-translate-y-0.5 group-hover/item:translate-x-0.5"
                  >
                    ↗
                  </span>
                </span>

                <span className="mt-1 block text-xs leading-5 text-fd-muted-foreground">
                  {pkg.description}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </details>
  );
}
