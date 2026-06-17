import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

import { DocsSectionDropdown } from "@/components/docs-section-dropdown";
import { PackagesDropdown } from "@/components/packages-dropdown";

import { appName, gitConfigRouter } from "./shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: appName,
    },
    links: [
      {
        type: "custom",
        on: "nav",
        children: <DocsSectionDropdown />,
      },
      {
        text: "API",
        on: "nav",
        url: "/docs/router/api",
      },
      {
        text: "Recipes",
        on: "nav",
        url: "/docs/router/recipes",
      },
      {
        type: "custom",
        on: "nav",
        secondary: true,
        children: <PackagesDropdown />,
      },
    ],
    githubUrl: `https://github.com/${gitConfigRouter.user}/${gitConfigRouter.repo}`,
    themeSwitch: {
      enabled: true,
    },
    searchToggle: {
      enabled: true,
    },
  };
}
