import { readFile, writeFile } from "node:fs/promises"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { ToolContractError } from "@workspace/tool-sdk"

import type {
  ToolRegistryArtifactPaths,
  ToolRegistryEntrySource,
  ToolRegistryGenerationOptions,
} from "../types"

export const TOOL_PACKAGE_SCOPE = "@tool/"

export function resolveToolRegistryPaths(
  options: ToolRegistryGenerationOptions = {}
): ToolRegistryArtifactPaths {
  const sourceDirectory = fileURLToPath(new URL(".", import.meta.url))
  const packageRoot = resolve(sourceDirectory, "../..")
  const repoRoot = options.repoRoot
    ? resolve(options.repoRoot)
    : resolve(sourceDirectory, "../../../..")
  const generatedRoot = resolve(packageRoot, "src/generated")

  return {
    repoRoot,
    toolsRoot: resolve(repoRoot, "tools"),
    packageRoot,
    generatedRoot,
    registryFile: resolve(generatedRoot, "registry.ts"),
    staticPathsFile: resolve(generatedRoot, "static-paths.ts"),
    searchIndexFile: resolve(generatedRoot, "search-index.ts"),
    pageLoadersFile: resolve(generatedRoot, "page-loaders.ts"),
  }
}

export async function fileExists(path: string) {
  try {
    await readFile(path)
    return true
  } catch {
    return false
  }
}

export async function readJsonFile(path: string) {
  const fileContents = await readFile(path, "utf8")
  return JSON.parse(fileContents) as unknown
}

export async function writeFileIfChanged(path: string, contents: string) {
  const currentContents = (await fileExists(path))
    ? await readFile(path, "utf8")
    : null

  if (currentContents === contents) {
    return false
  }

  await writeFile(path, contents, "utf8")
  return true
}

type RegistryPackageJson = {
  dependencies?: Record<string, string>
  [key: string]: unknown
}

export async function syncRegistryPackageDependencies(
  paths: ToolRegistryArtifactPaths,
  sources: readonly ToolRegistryEntrySource[]
) {
  const packageJsonPath = resolve(paths.packageRoot, "package.json")
  const packageJsonText = await readFile(packageJsonPath, "utf8")
  const packageJson = JSON.parse(packageJsonText) as RegistryPackageJson
  const existingDependencies = packageJson.dependencies ?? {}

  // Preserve every non-@tool/* dep verbatim; replace the @tool/* set with
  // the discovered tools so removing a tool also removes its dep entry.
  const preservedDependencies = Object.fromEntries(
    Object.entries(existingDependencies).filter(
      ([name]) => !name.startsWith(TOOL_PACKAGE_SCOPE)
    )
  )
  const toolDependencies = Object.fromEntries(
    sources.map((source) => [source.packageName, "workspace:*"])
  )
  const mergedDependencies = Object.fromEntries(
    Object.entries({ ...preservedDependencies, ...toolDependencies }).sort(
      ([left], [right]) => left.localeCompare(right)
    )
  )

  packageJson.dependencies = mergedDependencies

  const nextText = `${JSON.stringify(packageJson, null, 2)}\n`

  if (nextText === packageJsonText) {
    return false
  }

  await writeFile(packageJsonPath, nextText, "utf8")
  return true
}

export function assertDependenciesInSync(
  changed: boolean,
  paths: ToolRegistryArtifactPaths
) {
  if (!changed) return

  throw new ToolContractError("Tool registry dependencies were out of sync.", [
    `Updated ${resolve(paths.packageRoot, "package.json")} to match the discovered tools.`,
    "Run 'pnpm install' and then re-run 'pnpm tool-registry:generate'.",
  ])
}
