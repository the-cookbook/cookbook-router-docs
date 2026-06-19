import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import process from "node:process";

const root = process.cwd();
const docsRoot = join(root, "content/docs");
const manifest = JSON.parse(
  await readFile(
    join(root, "scripts/artifacts/public-api-manifest.json"),
    "utf8",
  ),
);
const packages = new Map(manifest.packages.map((pkg) => [pkg.name, pkg]));
const packageNames = [...packages.keys()].sort((a, b) => b.length - a.length);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else if (entry.name.endsWith(".mdx")) files.push(path);
  }
  return files;
}

function codeFences(content) {
  const blocks = [];
  const pattern = /```(?:tsx?|jsx?|mjs|cjs)\s*(?:[^\n]*)\n([\s\S]*?)```/g;
  for (const match of content.matchAll(pattern)) blocks.push(match[1]);
  return blocks;
}

function publicPackageFor(specifier) {
  return packageNames.find(
    (name) => specifier === name || specifier.startsWith(`${name}/`),
  );
}

function parseNamedImports(source) {
  return source
    .split(",")
    .map((entry) => entry.trim().replace(/^type\s+/, ""))
    .filter(Boolean)
    .map((entry) => entry.split(/\s+as\s+/)[0].trim())
    .filter(Boolean);
}

const failures = [];

for (const file of await walk(docsRoot)) {
  const content = await readFile(file, "utf8");
  const display = relative(root, file);

  for (const block of codeFences(content)) {
    const importPattern =
      /import\s+([^;]+?)\s+from\s+['"](@cookbook\/[^'"]+)['"];?/g;

    for (const match of block.matchAll(importPattern)) {
      const clause = match[1].trim();
      const specifier = match[2];
      const packageName = publicPackageFor(specifier);

      if (!packageName) continue;
      if (specifier !== packageName) {
        failures.push(
          `${display}: deep import "${specifier}" is not a public package entrypoint.`,
        );
        continue;
      }

      const pkg = packages.get(packageName);
      const available = new Set([...pkg.values, ...pkg.types]);
      const namedMatch = clause.match(/\{([\s\S]*?)\}/);
      if (namedMatch) {
        for (const imported of parseNamedImports(namedMatch[1])) {
          if (!available.has(imported)) {
            failures.push(
              `${display}: ${imported} is not exported by ${packageName}.`,
            );
          }
        }
      }

      const beforeNamed = clause.split("{", 1)[0].replace(/,$/, "").trim();
      const defaultName =
        beforeNamed && beforeNamed !== "type" && !beforeNamed.startsWith("*")
          ? beforeNamed
          : undefined;
      if (defaultName && !pkg.defaultExport) {
        failures.push(`${display}: ${packageName} has no default export.`);
      }
    }
  }
}

if (failures.length) {
  console.error("Cookbook package import validation failed:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(
    "Cookbook package imports in MDX code fences match the public package entrypoints.",
  );
}
