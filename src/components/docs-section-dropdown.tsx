"use client";

import { BookOpen, Boxes, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

interface DocsSection {
  readonly name: string;
  readonly description: string;
  readonly href: string;
  readonly icon: typeof BookOpen;
}

const sections: readonly DocsSection[] = [
  {
    name: "Cookbook Router",
    description:
      "Framework concepts, core API, React integration, CLI, recipes, errors, and troubleshooting.",
    href: "/docs/router",
    icon: BookOpen,
  },
  {
    name: "Bundler Plugins",
    description:
      "Build integrations for Vite, Webpack, Rspack, Rollup, esbuild, and Bun.",
    href: "/docs/bundler-plugins",
    icon: Boxes,
  },
];

export function DocsSectionDropdown() {
  const pathname = usePathname();
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-haspopup="menu"
        className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-fd-muted-foreground transition hover:bg-fd-accent hover:text-fd-accent-foreground"
        onClick={() => setIsOpen((current) => !current)}
      >
        Docs
        <ChevronDown
          aria-hidden="true"
          className={`size-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          id={menuId}
          role="menu"
          aria-label="Documentation sections"
          className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-80 rounded-xl border bg-fd-popover p-2 text-fd-popover-foreground shadow-xl"
        >
          <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-[0.2em] text-fd-muted-foreground">
            Documentation
          </p>

          <div className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive =
                pathname === section.href ||
                pathname.startsWith(`${section.href}/`);

              return (
                <Link
                  key={section.href}
                  href={section.href}
                  role="menuitem"
                  aria-current={isActive ? "page" : undefined}
                  className={`group flex gap-3 rounded-lg px-3 py-3 transition ${
                    isActive
                      ? "bg-fd-accent text-fd-accent-foreground"
                      : "hover:bg-fd-accent/60 hover:text-fd-accent-foreground"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="[&_svg]:size-4 shrink-0 items-center justify-center inline-block mt-0.5">
                    <Icon aria-hidden="true" />
                  </span>

                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">
                      {section.name}
                    </span>

                    <span className="mt-1 block text-xs leading-5 text-fd-muted-foreground">
                      {section.description}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
