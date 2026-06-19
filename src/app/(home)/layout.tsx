import { HomeLayout } from "fumadocs-ui/layouts/home";
import { BookOpen, Boxes } from "lucide-react";
import type { ReactNode } from "react";

import { PackagesDropdown } from "@/components/packages-dropdown";
import { baseOptions } from "@/lib/layout.shared";

export default function Layout({ children }: { children: ReactNode }) {
  const options = baseOptions();

  return (
    <HomeLayout
      nav={options.nav}
      links={[
        {
          type: "menu",
          text: "Docs",
          items: [
            {
              text: "Cookbook Router",
              description:
                "Framework concepts, core API, React integration, CLI, recipes, errors, and troubleshooting.",
              url: "/docs/router",
              icon: <BookOpen />,
            },
            {
              text: "Bundler Plugins",
              description:
                "Build integrations for Vite, Webpack, Rspack, Rollup, esbuild, and Bun.",
              url: "/docs/bundler-plugins",
              icon: <Boxes />,
            },
          ],
        },
        {
          text: "API",
          url: "/docs/router/api",
        },
        {
          text: "Recipes",
          url: "/docs/router/recipes",
        },
        {
          type: "custom",
          on: "nav",
          secondary: true,
          children: <PackagesDropdown />,
        },
      ]}
      githubUrl={options.githubUrl}
      themeSwitch={options.themeSwitch}
      searchToggle={options.searchToggle}
    >
      {children}
    </HomeLayout>
  );
}
