import { readdir, readFile } from "node:fs/promises";
import { basename, isAbsolute, join, resolve } from "node:path";
import ts from "typescript";

const PUBLIC_SOURCE_PREFIX = "cookbook-router";

export function resolveCookbookRouterRoot(
  sourceRootArgument,
  cwd = process.cwd(),
) {
  if (!sourceRootArgument) {
    throw new Error(
      "Provide the Cookbook Router monorepo root as a positional argument or set COOKBOOK_ROUTER_ROOT.",
    );
  }

  return isAbsolute(sourceRootArgument)
    ? resolve(sourceRootArgument)
    : resolve(cwd, sourceRootArgument);
}

function hasModifier(node, kind) {
  return Boolean(
    ts.getModifiers(node)?.some((modifier) => modifier.kind === kind),
  );
}

function collectBindingNames(name, names) {
  if (ts.isIdentifier(name)) {
    names.add(name.text);
    return;
  }

  for (const element of name.elements) {
    if (ts.isOmittedExpression(element)) {
      continue;
    }

    collectBindingNames(element.name, names);
  }
}

function formatNodeLocation(sourceFile, node) {
  const location = sourceFile.getLineAndCharacterOfPosition(
    node.getStart(sourceFile),
  );
  return `${sourceFile.fileName}:${location.line + 1}:${location.character + 1}`;
}

export function parsePublicIndex(source, filePath = "src/index.ts") {
  const sourceFile = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const values = new Set();
  const types = new Set();
  const unsupportedExports = [];
  let defaultExport = false;

  for (const statement of sourceFile.statements) {
    if (ts.isExportDeclaration(statement)) {
      if (!statement.exportClause) {
        unsupportedExports.push(
          `${formatNodeLocation(sourceFile, statement)} uses "export *". ` +
            "List public exports explicitly so the API manifest stays deterministic.",
        );
        continue;
      }

      if (ts.isNamespaceExport(statement.exportClause)) {
        const name = statement.exportClause.name.text;
        (statement.isTypeOnly ? types : values).add(name);
        continue;
      }

      for (const element of statement.exportClause.elements) {
        const exportedName = element.name.text;

        if (exportedName === "default") {
          defaultExport = true;
          continue;
        }

        const isTypeOnly = statement.isTypeOnly || element.isTypeOnly;
        (isTypeOnly ? types : values).add(exportedName);
      }

      continue;
    }

    if (ts.isExportAssignment(statement)) {
      if (statement.isExportEquals) {
        unsupportedExports.push(
          `${formatNodeLocation(sourceFile, statement)} uses "export =". ` +
            "CommonJS export assignments are not supported by the public API manifest.",
        );
      } else {
        defaultExport = true;
      }

      continue;
    }

    if (!hasModifier(statement, ts.SyntaxKind.ExportKeyword)) {
      continue;
    }

    const isDefault = hasModifier(statement, ts.SyntaxKind.DefaultKeyword);

    if (isDefault) {
      defaultExport = true;
    }

    if (
      ts.isInterfaceDeclaration(statement) ||
      ts.isTypeAliasDeclaration(statement)
    ) {
      if (!isDefault) {
        types.add(statement.name.text);
      }
      continue;
    }

    if (
      ts.isFunctionDeclaration(statement) ||
      ts.isClassDeclaration(statement) ||
      ts.isEnumDeclaration(statement) ||
      ts.isModuleDeclaration(statement)
    ) {
      if (!isDefault && statement.name) {
        values.add(statement.name.text);
      }
      continue;
    }

    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        collectBindingNames(declaration.name, values);
      }
    }
  }

  if (unsupportedExports[0]) {
    throw new Error(unsupportedExports.join("\n"));
  }

  return {
    values: [...values].sort((left, right) => left.localeCompare(right)),
    types: [...types].sort((left, right) => left.localeCompare(right)),
    defaultExport,
  };
}

export async function discoverPublicPackageEntrypoints(sourceRoot) {
  const packagesRoot = join(sourceRoot, "packages");
  const packageDirectories = await readdir(packagesRoot, {
    withFileTypes: true,
  });
  const packages = [];

  for (const directory of packageDirectories) {
    if (!directory.isDirectory()) {
      continue;
    }

    const packageRoot = join(packagesRoot, directory.name);
    const packageJsonPath = join(packageRoot, "package.json");
    const indexPath = join(packageRoot, "src/index.ts");
    let packageJson;
    let source;

    try {
      packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));
      source = await readFile(indexPath, "utf8");
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "ENOENT"
      ) {
        continue;
      }

      throw error;
    }

    if (!packageJson.name || packageJson.private === true) {
      continue;
    }

    packages.push({
      name: packageJson.name,
      directoryName: directory.name,
      indexPath,
      source,
    });
  }

  return packages.sort((left, right) => left.name.localeCompare(right.name));
}

export async function createPublicApiManifest(sourceRoot) {
  const packageEntrypoints = await discoverPublicPackageEntrypoints(sourceRoot);
  const packages = packageEntrypoints.map((entrypoint) => {
    const parsed = parsePublicIndex(entrypoint.source, entrypoint.indexPath);

    return {
      name: entrypoint.name,
      source: `${PUBLIC_SOURCE_PREFIX}/packages/${entrypoint.directoryName}/src/index.ts`,
      values: parsed.values,
      types: parsed.types,
      defaultExport: parsed.defaultExport,
    };
  });

  return {
    generatedFrom: `${PUBLIC_SOURCE_PREFIX}/packages/*/src/index.ts`,
    packages,
  };
}

export function summarizePublicApiManifest(manifest) {
  return manifest.packages.reduce(
    (summary, pkg) => ({
      packages: summary.packages + 1,
      values: summary.values + pkg.values.length,
      types: summary.types + pkg.types.length,
    }),
    { packages: 0, values: 0, types: 0 },
  );
}

export function sourceRootLabel(sourceRoot) {
  return basename(resolve(sourceRoot));
}
