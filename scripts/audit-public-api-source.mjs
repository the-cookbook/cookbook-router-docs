import { readFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";

import {
  createPublicApiManifest,
  resolveCookbookRouterRoot,
  summarizePublicApiManifest,
} from "./public-api-source.mjs";

const docsRoot = process.cwd();
const sourceRootArgument = process.argv[2] ?? process.env.COOKBOOK_ROUTER_ROOT;

if (!sourceRootArgument) {
  console.error(
    "Provide the Cookbook Router monorepo root: node scripts/audit-public-api-source.mjs <path> or set COOKBOOK_ROUTER_ROOT.",
  );
  process.exit(1);
}

const sourceRoot = resolveCookbookRouterRoot(sourceRootArgument, docsRoot);
const manifestPath = join(
  docsRoot,
  "scripts/artifacts/public-api-manifest.json",
);
const expected = JSON.parse(await readFile(manifestPath, "utf8"));
const actual = await createPublicApiManifest(sourceRoot);
const expectedByName = new Map(expected.packages.map((pkg) => [pkg.name, pkg]));
const actualByName = new Map(actual.packages.map((pkg) => [pkg.name, pkg]));
const failures = [];

for (const pkg of actual.packages) {
  const expectedPackage = expectedByName.get(pkg.name);

  if (!expectedPackage) {
    failures.push(
      `${pkg.name}: add the package entrypoint to the manifest and documentation.`,
    );
    continue;
  }

  const expectedValues = [...expectedPackage.values].sort();
  const expectedTypes = [...expectedPackage.types].sort();
  const actualValues = [...pkg.values].sort();
  const actualTypes = [...pkg.types].sort();
  const missingValues = actualValues.filter(
    (name) => !expectedValues.includes(name),
  );
  const staleValues = expectedValues.filter(
    (name) => !actualValues.includes(name),
  );
  const missingTypes = actualTypes.filter(
    (name) => !expectedTypes.includes(name),
  );
  const staleTypes = expectedTypes.filter(
    (name) => !actualTypes.includes(name),
  );

  if (missingValues.length) {
    failures.push(
      `${pkg.name}: add new values to the manifest/docs: ${missingValues.join(", ")}`,
    );
  }
  if (staleValues.length) {
    failures.push(
      `${pkg.name}: remove stale values from the manifest/docs: ${staleValues.join(", ")}`,
    );
  }
  if (missingTypes.length) {
    failures.push(
      `${pkg.name}: add new types to the manifest/docs: ${missingTypes.join(", ")}`,
    );
  }
  if (staleTypes.length) {
    failures.push(
      `${pkg.name}: remove stale types from the manifest/docs: ${staleTypes.join(", ")}`,
    );
  }
  if (pkg.defaultExport !== expectedPackage.defaultExport) {
    failures.push(
      `${pkg.name}: default export changed (source=${pkg.defaultExport}, manifest=${expectedPackage.defaultExport}).`,
    );
  }
  if (pkg.source !== expectedPackage.source) {
    failures.push(
      `${pkg.name}: source entrypoint changed (source=${pkg.source}, manifest=${expectedPackage.source}).`,
    );
  }
}

for (const pkg of expected.packages) {
  if (!actualByName.has(pkg.name)) {
    failures.push(
      `${pkg.name}: remove the stale package entrypoint from the manifest and documentation.`,
    );
  }
}

if (failures.length) {
  console.error("Source public API audit failed:\n");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

const summary = summarizePublicApiManifest(actual);
console.log(
  `Source public API audit passed: ${summary.values} values and ${summary.types} types across ${summary.packages} package entrypoints.`,
);
