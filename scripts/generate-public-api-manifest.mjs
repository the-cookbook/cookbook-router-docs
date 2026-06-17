import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, join, resolve } from "node:path";
import process from "node:process";

import {
  createPublicApiManifest,
  resolveCookbookRouterRoot,
  summarizePublicApiManifest,
} from "./public-api-source.mjs";

const docsRoot = process.cwd();
const argumentsList = process.argv.slice(2);
let sourceRootArgument = process.env.COOKBOOK_ROUTER_ROOT;
let outputPath = join(docsRoot, "scripts/artifacts/public-api-manifest.json");
let checkOnly = false;
let printToStdout = false;

for (let index = 0; index < argumentsList.length; index += 1) {
  const argument = argumentsList[index];

  if (argument === "--check") {
    checkOnly = true;
    continue;
  }

  if (argument === "--stdout") {
    printToStdout = true;
    continue;
  }

  if (argument === "--output") {
    const nextArgument = argumentsList[index + 1];

    if (!nextArgument) {
      console.error("Expected a file path after --output.");
      process.exit(1);
    }

    outputPath = isAbsolute(nextArgument)
      ? nextArgument
      : resolve(docsRoot, nextArgument);
    index += 1;
    continue;
  }

  if (argument.startsWith("--")) {
    console.error(`Unknown option: ${argument}`);
    process.exit(1);
  }

  if (sourceRootArgument) {
    console.error(`Unexpected positional argument: ${argument}`);
    process.exit(1);
  }

  sourceRootArgument = argument;
}

if (!sourceRootArgument) {
  console.error(
    "Usage: node scripts/generate-public-api-manifest.mjs <cookbook-router-root> [--check] [--stdout] [--output <path>]\n" +
      "You can also set COOKBOOK_ROUTER_ROOT instead of passing the root path.",
  );
  process.exit(1);
}

const sourceRoot = resolveCookbookRouterRoot(sourceRootArgument, docsRoot);
const manifest = await createPublicApiManifest(sourceRoot);
const serializedManifest = `${JSON.stringify(manifest, null, 2)}\n`;
const summary = summarizePublicApiManifest(manifest);

if (printToStdout) {
  process.stdout.write(serializedManifest);
}

if (checkOnly) {
  let existingManifest;

  try {
    existingManifest = await readFile(outputPath, "utf8");
  } catch (error) {
    console.error(
      `Cannot read ${outputPath}: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  }

  if (existingManifest !== serializedManifest) {
    console.error(
      "Public API manifest is stale. Regenerate it with:\n\n" +
        `  node scripts/generate-public-api-manifest.mjs ${sourceRootArgument}\n`,
    );
    process.exit(1);
  }

  console.log(
    `Public API manifest is current: ${summary.values} values and ${summary.types} types across ${summary.packages} package entrypoints.`,
  );
  process.exit(0);
}

if (!printToStdout) {
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, serializedManifest);
  console.log(
    `Wrote ${outputPath}: ${summary.values} values and ${summary.types} types across ${summary.packages} package entrypoints.`,
  );
}
