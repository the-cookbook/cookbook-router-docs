import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import process from "node:process";

const root = process.cwd();
const docsRoot = join(root, "content/docs");
const failures = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else files.push(path);
  }
  return files;
}

const files = await walk(docsRoot);
const mdxFiles = files.filter((file) => file.endsWith(".mdx"));
const metaFiles = files.filter((file) => file.endsWith(`${sep}meta.json`));
const routes = new Set();

for (const file of mdxFiles) {
  const rel = relative(docsRoot, file).replaceAll(sep, "/");
  const withoutExtension = rel.slice(0, -4);
  const route = withoutExtension.endsWith("/index")
    ? `/docs/${withoutExtension.slice(0, -6)}`
    : `/docs/${withoutExtension}`;
  routes.add(route.replace(/\/$/, "") || "/docs");
}

for (const file of files) {
  const rel = relative(root, file);
  if (rel.split(sep).some((part) => part.includes(" "))) {
    failures.push(`${rel}: paths must not contain spaces.`);
  }
}

for (const file of mdxFiles) {
  const content = await readFile(file, "utf8");
  const rel = relative(root, file);
  const frontmatter = content.match(/^---\n([\s\S]*?)\n---\n/);

  if (!frontmatter) {
    failures.push(`${rel}: missing YAML frontmatter.`);
  } else {
    if (!/^title:\s*.+$/m.test(frontmatter[1]))
      failures.push(`${rel}: frontmatter requires title.`);
    if (!/^description:\s*.+$/m.test(frontmatter[1]))
      failures.push(`${rel}: frontmatter requires description.`);
  }

  const fenceCount = (content.match(/^```/gm) ?? []).length;
  if (fenceCount % 2 !== 0)
    failures.push(`${rel}: unbalanced fenced code blocks.`);

  if (/<(?:Tab|Step|Accordion)[^>]*>```/.test(content)) {
    failures.push(
      `${rel}: fenced code must start on a new line after an MDX component.`,
    );
  }
  if (/```<\/(?:Tab|Step|Accordion)>/.test(content)) {
    failures.push(
      `${rel}: fenced code must end on a line before an MDX component closes.`,
    );
  }

  const prose = content.replace(/```[\s\S]*?```/g, "");
  const pairedComponents = new Set([
    "Tabs",
    "Tab",
    "Steps",
    "Step",
    "Accordions",
    "Accordion",
    "Cards",
    "Callout",
  ]);
  const componentStack = [];
  for (const match of prose.matchAll(
    /<(\/?)(Tabs|Tab|Steps|Step|Accordions|Accordion|Cards|Callout)\b[^>]*>/g,
  )) {
    const [token, slash, name] = match;
    if (!pairedComponents.has(name) || token.endsWith("/>")) continue;
    if (!slash) {
      componentStack.push(name);
      continue;
    }
    const current = componentStack.pop();
    if (current !== name) {
      failures.push(
        `${rel}: MDX component </${name}> closes ${current ? `<${current}>` : "without an opening tag"}.`,
      );
      break;
    }
  }
  if (componentStack.length) {
    failures.push(
      `${rel}: unclosed MDX component(s): ${componentStack.map((name) => `<${name}>`).join(", ")}.`,
    );
  }

  if (/Cookbook Foo/i.test(content))
    failures.push(`${rel}: placeholder copy remains.`);
  if (/\/docs\/packages(?:\/|\b)/.test(content))
    failures.push(`${rel}: obsolete /docs/packages route remains.`);

  for (const match of content.matchAll(
    /\]\((\/docs\/[^)#?\s]+)(?:#[^)]+)?\)/g,
  )) {
    const target = match[1].replace(/\/$/, "");
    if (!routes.has(target))
      failures.push(`${rel}: internal link target does not exist: ${target}`);
  }
}

for (const file of metaFiles) {
  const rel = relative(root, file);
  let meta;
  try {
    meta = JSON.parse(await readFile(file, "utf8"));
  } catch (error) {
    failures.push(
      `${rel}: invalid JSON: ${error instanceof Error ? error.message : String(error)}`,
    );
    continue;
  }

  if (!Array.isArray(meta.pages)) continue;

  let grouped = false;
  const listed = new Set();
  const requiresRootGrouping = meta.root === true;
  for (const entry of meta.pages) {
    if (typeof entry !== "string") {
      failures.push(`${rel}: every pages entry must be a string.`);
      continue;
    }

    if (/^---.+---$/.test(entry)) {
      grouped = true;
      if (/packages/i.test(entry))
        failures.push(
          `${rel}: use API wording; a Packages separator is forbidden.`,
        );
      continue;
    }

    if (requiresRootGrouping && !grouped) {
      failures.push(
        `${rel}: "${entry}" appears before a ---Label--- separator.`,
      );
    }

    const listedEntry = entry.startsWith("...") ? entry.slice(3) : entry;
    listed.add(listedEntry);

    const directory = file.slice(0, -"meta.json".length);
    const pagePath = join(directory, `${listedEntry}.mdx`);
    const folderPath = join(directory, listedEntry);
    let exists = false;
    try {
      exists = (await stat(pagePath)).isFile();
    } catch {}
    if (!exists) {
      try {
        exists = (await stat(folderPath)).isDirectory();
      } catch {}
    }
    if (!exists)
      failures.push(`${rel}: listed page or folder does not exist: ${entry}`);
  }

  const directory = file.slice(0, -"meta.json".length);
  const siblings = await readdir(directory, { withFileTypes: true });
  for (const sibling of siblings) {
    if (sibling.name === "meta.json") continue;
    if (sibling.isFile() && sibling.name.endsWith(".mdx")) {
      const stem = sibling.name.slice(0, -4);
      if (!listed.has(stem))
        failures.push(`${rel}: unlisted sidebar page: ${stem}`);
    }
    if (sibling.isDirectory()) {
      let hasMeta = false;
      try {
        hasMeta = (
          await stat(join(directory, sibling.name, "meta.json"))
        ).isFile();
      } catch {}
      if (hasMeta && !listed.has(sibling.name))
        failures.push(`${rel}: unlisted sidebar section: ${sibling.name}`);
    }
  }
}

if (failures.length) {
  console.error("Content structure validation failed:\n");
  for (const failure of [...new Set(failures)]) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(
    `Content structure passed for ${mdxFiles.length} MDX pages and ${metaFiles.length} sidebar definitions.`,
  );
}
