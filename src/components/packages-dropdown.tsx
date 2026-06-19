"use client";

import { useEffect, useId, useRef, useState } from "react";

import { NpmIcon } from "@/components/npm-icon";

interface PackageLinkItem {
  readonly kind: "package";
  readonly name: string;
  readonly description: string;
  readonly href: string;
}

interface PackageGroupItem {
  readonly kind: "group";
  readonly label: string;
}

interface PackageSeparatorItem {
  readonly kind: "separator";
  readonly id: string;
}

const packages: ReadonlyArray<
  PackageLinkItem | PackageGroupItem | PackageSeparatorItem
> = [
  { kind: "group", label: "Framework" },
  {
    kind: "package",
    name: "@cookbook/router",
    description:
      "Framework-agnostic routing, matching, URL contracts, middleware, histories, validation, and SSR.",
    href: "https://www.npmjs.com/package/@cookbook/router",
  },
  {
    kind: "package",
    name: "@cookbook/router-react",
    description:
      "React providers, links, hooks, outlets, slots, intercepts, blockers, and static rendering.",
    href: "https://www.npmjs.com/package/@cookbook/router-react",
  },
  { kind: "separator", id: "framework-cli" },
  { kind: "group", label: "CLI" },
  {
    kind: "package",
    name: "@cookbook/router-cli",
    description:
      "Route generation, validation, manifests, declarations, configuration, and watch mode.",
    href: "https://www.npmjs.com/package/@cookbook/router-cli",
  },
  { kind: "separator", id: "cli-build" },
  { kind: "group", label: "Build Integration" },
  {
    kind: "package",
    name: "@cookbook/router-vite-plugin",
    description:
      "Route generation and validation integrated with Vite development and production builds.",
    href: "https://www.npmjs.com/package/@cookbook/router-vite-plugin",
  },
  {
    kind: "package",
    name: "@cookbook/router-webpack-plugin",
    description:
      "Route generation, dependency tracking, validation, and recovery for Webpack.",
    href: "https://www.npmjs.com/package/@cookbook/router-webpack-plugin",
  },
  {
    kind: "package",
    name: "@cookbook/router-rspack-plugin",
    description: "Cookbook Router build integration for Rspack projects.",
    href: "https://www.npmjs.com/package/@cookbook/router-rspack-plugin",
  },
  {
    kind: "package",
    name: "@cookbook/router-rollup-plugin",
    description:
      "Route generation and validation for Rollup and compatible Rolldown workflows.",
    href: "https://www.npmjs.com/package/@cookbook/router-rollup-plugin",
  },
  {
    kind: "package",
    name: "@cookbook/router-esbuild-plugin",
    description: "Route generation and validation during esbuild builds.",
    href: "https://www.npmjs.com/package/@cookbook/router-esbuild-plugin",
  },
  {
    kind: "package",
    name: "@cookbook/router-bun-plugin",
    description: "Route generation and validation through Bun's plugin system.",
    href: "https://www.npmjs.com/package/@cookbook/router-bun-plugin",
  },
];

export function PackagesDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownId = useId();

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const root = rootRef.current;

      if (!root || root.contains(event.target as Node)) {
        return;
      }

      setIsOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }

      setIsOpen(false);
      triggerRef.current?.focus();
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label={isOpen ? "Close npm packages" : "Open npm packages"}
        aria-expanded={isOpen}
        aria-controls={dropdownId}
        onClick={() => setIsOpen((current) => !current)}
        className="flex size-9 cursor-pointer items-center justify-center rounded-md text-fd-muted-foreground transition hover:bg-fd-accent hover:text-fd-accent-foreground"
      >
        <NpmIcon aria-hidden="true" className="size-7" />
      </button>

      {isOpen && (
        <div
          id={dropdownId}
          className="absolute right-0 top-11 z-50 w-80 overflow-hidden rounded-xl border bg-fd-popover p-2 text-fd-popover-foreground shadow-xl"
        >
          <div className="flex items-center gap-2 px-3 py-2">
            <NpmIcon aria-hidden="true" className="size-8" />

            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-fd-muted-foreground">
              npm packages
            </p>
          </div>

          <div className="max-h-[min(70vh,32rem)] overflow-y-auto">
            {packages.map((pkg) => {
              if (pkg.kind === "separator") {
                return <hr key={pkg.id} className="my-5" />;
              }

              if (pkg.kind === "group") {
                return (
                  <p
                    key={pkg.label}
                    className="px-3 text-[10px] font-semibold uppercase text-fd-muted-foreground"
                  >
                    {pkg.label}
                  </p>
                );
              }

              return (
                <a
                  key={pkg.name}
                  href={pkg.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
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
      )}
    </div>
  );
}
