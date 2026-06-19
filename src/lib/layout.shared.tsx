import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

import { appName, gitConfigRouter } from "./shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: appName,
    },
    githubUrl: `https://github.com/${gitConfigRouter.user}/${gitConfigRouter.repo}`,
    themeSwitch: {
      enabled: true,
    },
    searchToggle: {
      enabled: true,
    },
  };
}
