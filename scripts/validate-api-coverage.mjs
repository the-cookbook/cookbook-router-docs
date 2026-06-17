import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";

const root = process.cwd();
const manifest = JSON.parse(
  await readFile(
    join(root, "scripts/artifacts/public-api-manifest.json"),
    "utf8",
  ),
);

const docsByPackage = new Map([
  ["@cookbook/router", "content/docs/router/api/router"],
  ["@cookbook/router-react", "content/docs/router/api/router-react"],
  ["@cookbook/router-cli", "content/docs/router/api/router-cli"],
  ["@cookbook/router-vite-plugin", "content/docs/bundler-plugins/vite.mdx"],
  [
    "@cookbook/router-webpack-plugin",
    "content/docs/bundler-plugins/webpack.mdx",
  ],
  ["@cookbook/router-rspack-plugin", "content/docs/bundler-plugins/rspack.mdx"],
  [
    "@cookbook/router-rollup-plugin",
    "content/docs/bundler-plugins/rollup-and-rolldown.mdx",
  ],
  [
    "@cookbook/router-esbuild-plugin",
    "content/docs/bundler-plugins/esbuild.mdx",
  ],
  ["@cookbook/router-bun-plugin", "content/docs/bundler-plugins/bun.mdx"],
]);

async function readMdx(target) {
  const absolute = join(root, target);

  if (target.endsWith(".mdx")) {
    return readFile(absolute, "utf8");
  }

  const entries = await readdir(absolute, { withFileTypes: true });
  const chunks = await Promise.all(
    entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
      .map((entry) => readFile(join(absolute, entry.name), "utf8")),
  );

  return chunks.join("\n");
}

const failures = [];
let valueCount = 0;
let typeCount = 0;

for (const pkg of manifest.packages) {
  const target = docsByPackage.get(pkg.name);

  if (!target) {
    failures.push(`${pkg.name}: no documentation mapping exists.`);
    continue;
  }

  const content = await readMdx(target);
  const missingValues = pkg.values.filter((name) => !content.includes(name));
  const missingTypes = pkg.types.filter((name) => !content.includes(name));

  valueCount += pkg.values.length;
  typeCount += pkg.types.length;

  if (missingValues.length) {
    failures.push(
      `${pkg.name}: undocumented values: ${missingValues.join(", ")}`,
    );
  }

  if (missingTypes.length) {
    failures.push(
      `${pkg.name}: undocumented types: ${missingTypes.join(", ")}`,
    );
  }

  if (
    pkg.defaultExport &&
    !/default export|default import|export default/i.test(content)
  ) {
    failures.push(`${pkg.name}: default export is not documented.`);
  }
}

if (failures.length) {
  console.error("Public API coverage failed:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(
    `Public API coverage passed: ${valueCount} values and ${typeCount} types across ${manifest.packages.length} packages.`,
  );
}
