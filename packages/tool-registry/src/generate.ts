import type { Dirent } from "node:fs"
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises"
import { resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

import {
  assertToolManifest,
  assertToolMetaCatalogs,
  ToolContractError,
  type ToolManifest,
  type ToolMetaCatalogs,
} from "@workspace/tool-sdk"

import type {
  LoadedToolManifest,
  ToolRegistryArtifactPaths,
  ToolRegistryEntry,
  ToolRegistryEntrySource,
  ToolRegistryGenerationOptions,
  ToolSearchIndexEntry,
} from "./types"

function stringifyJson(value: unknown) {
  return `${JSON.stringify(value, null, 2)}\n`
}

function resolveToolRegistryPaths(
  options: ToolRegistryGenerationOptions = {}
): ToolRegistryArtifactPaths {
  const sourceDirectory = fileURLToPath(new URL(".", import.meta.url))
  const packageRoot = resolve(sourceDirectory, "..")
  const repoRoot = options.repoRoot
    ? resolve(options.repoRoot)
    : resolve(sourceDirectory, "../../..")
  const generatedRoot = resolve(packageRoot, "src/generated")

  return {
    repoRoot,
    toolsRoot: resolve(repoRoot, "tools"),
    packageRoot,
    generatedRoot,
    registryFile: resolve(generatedRoot, "registry.ts"),
    staticPathsFile: resolve(generatedRoot, "static-paths.ts"),
    searchIndexFile: resolve(generatedRoot, "search-index.ts"),
  }
}

async function fileExists(path: string) {
  try {
    await readFile(path)
    return true
  } catch {
    return false
  }
}

async function discoverToolManifestSources(toolsRoot: string) {
  const directoryEntries = await readdir(toolsRoot, { withFileTypes: true })
  const manifestSources: ToolRegistryEntrySource[] = []

  for (const entry of directoryEntries) {
    if (!entry.isDirectory()) {
      continue
    }

    const toolRoot = resolve(toolsRoot, entry.name)
    const manifestAbsolutePath = resolve(toolRoot, "manifest.ts")

    if (!(await fileExists(manifestAbsolutePath))) {
      continue
    }

    manifestSources.push({
      directoryName: entry.name,
      manifestAbsolutePath,
      toolRoot,
    })
  }

  return manifestSources.sort((left, right) =>
    left.directoryName.localeCompare(right.directoryName)
  )
}

async function readJsonFile(path: string) {
  const fileContents = await readFile(path, "utf8")
  return JSON.parse(fileContents) as unknown
}

async function loadManifestModule(source: ToolRegistryEntrySource) {
  const importedModule = (await import(
    pathToFileURL(source.manifestAbsolutePath).href
  )) as Record<string, unknown>

  const manifest = (importedModule.tool ?? importedModule.default) as
    | ToolManifest
    | undefined

  if (!manifest) {
    throw new ToolContractError("Invalid tool manifest module.", [
      `${source.manifestAbsolutePath}: expected a named 'tool' export or a default export`,
    ])
  }

  return manifest
}

function getLanguageFromMetaFilename(filename: string) {
  return filename.replace(/\.json$/u, "")
}

async function loadToolMetaCatalogs(source: ToolRegistryEntrySource) {
  const metaDirectory = resolve(source.toolRoot, "meta")

  let directoryEntries: Dirent[]
  try {
    directoryEntries = await readdir(metaDirectory, { withFileTypes: true })
  } catch {
    throw new ToolContractError("Missing tool meta directory.", [metaDirectory])
  }

  const metaFiles = directoryEntries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .sort((left, right) => left.name.localeCompare(right.name))

  if (metaFiles.length === 0) {
    throw new ToolContractError("Tool meta directory is empty.", [
      metaDirectory,
    ])
  }

  const catalogs = Object.fromEntries(
    await Promise.all(
      metaFiles.map(async (entry) => {
        const language = getLanguageFromMetaFilename(entry.name)
        const absolutePath = resolve(metaDirectory, entry.name)
        const parsedJson = await readJsonFile(absolutePath)

        return [language, parsedJson]
      })
    )
  ) as ToolMetaCatalogs

  assertToolMetaCatalogs(catalogs)

  return catalogs
}

async function assertPageFileExists(source: ToolRegistryEntrySource) {
  const pageAbsolutePath = resolve(source.toolRoot, "index.astro")

  if (!(await fileExists(pageAbsolutePath))) {
    throw new ToolContractError("Missing tool page file.", [pageAbsolutePath])
  }
}

function buildRegistryEntry(
  source: ToolRegistryEntrySource,
  manifest: ToolManifest,
  catalogs: ToolMetaCatalogs
): ToolRegistryEntry {
  return {
    slug: source.directoryName,
    category: manifest.category,
    icon: manifest.icon,
    tags: manifest.tags ?? [],
    locales: catalogs,
  }
}

function buildSearchIndexEntry(
  registryEntry: ToolRegistryEntry
): ToolSearchIndexEntry {
  return {
    slug: registryEntry.slug,
    category: registryEntry.category,
    icon: registryEntry.icon,
    tags: registryEntry.tags,
    locales: registryEntry.locales,
  }
}

function buildStaticPaths(
  source: ToolRegistryEntrySource,
  catalogs: ToolMetaCatalogs
) {
  return Object.keys(catalogs)
    .sort((left, right) => left.localeCompare(right))
    .map((language) => ({
      slug: source.directoryName,
      language,
    }))
}

async function loadToolManifests(paths: ToolRegistryArtifactPaths) {
  const manifestSources = await discoverToolManifestSources(paths.toolsRoot)
  const manifests: LoadedToolManifest[] = []
  const slugOwners = new Map<string, string>()

  for (const source of manifestSources) {
    const loadedManifest = await loadManifestModule(source)

    assertToolManifest(loadedManifest)

    const existingSlugOwner = slugOwners.get(source.directoryName)
    if (existingSlugOwner) {
      throw new ToolContractError("Duplicate tool slug detected.", [
        `${source.directoryName}: ${existingSlugOwner}`,
        `${source.directoryName}: ${source.manifestAbsolutePath}`,
      ])
    }
    slugOwners.set(source.directoryName, source.manifestAbsolutePath)

    await assertPageFileExists(source)
    const catalogs = await loadToolMetaCatalogs(source)
    const registryEntry = buildRegistryEntry(source, loadedManifest, catalogs)

    manifests.push({
      manifest: loadedManifest,
      registryEntry,
      searchIndexEntry: buildSearchIndexEntry(registryEntry),
      source,
      staticPaths: buildStaticPaths(source, catalogs),
    })
  }

  return manifests.sort((left, right) =>
    left.registryEntry.slug.localeCompare(right.registryEntry.slug)
  )
}

function createRegistrySource(manifests: readonly LoadedToolManifest[]) {
  const registryEntries = manifests.map(({ registryEntry }) => registryEntry)
  const slugMapEntries = manifests.map(
    ({ registryEntry }) =>
      `  "${registryEntry.slug}": ${JSON.stringify(registryEntry, null, 2)},`
  )
  const toolRegistryBySlug =
    slugMapEntries.length === 0
      ? `export const toolRegistryBySlug: Record<string, ToolRegistryEntry> = {}`
      : [
          `export const toolRegistryBySlug: Record<string, ToolRegistryEntry> = {`,
          ...slugMapEntries,
          `}`,
        ].join("\n")

  return [
    `import type { ToolRegistryEntry } from "../types"`,
    "",
    `export const toolRegistry: readonly ToolRegistryEntry[] = ${JSON.stringify(registryEntries, null, 2)}`,
    "",
    toolRegistryBySlug,
    "",
  ].join("\n")
}

function createStaticPathsSource(manifests: readonly LoadedToolManifest[]) {
  const staticPaths = manifests.flatMap(({ staticPaths }) => staticPaths)

  return [
    `import type { ToolStaticPathEntry } from "../types"`,
    "",
    `export const toolStaticPaths: readonly ToolStaticPathEntry[] = ${JSON.stringify(staticPaths, null, 2)}`,
    "",
  ].join("\n")
}

function createSearchIndexSource(manifests: readonly LoadedToolManifest[]) {
  const searchIndex = manifests.map(({ searchIndexEntry }) => searchIndexEntry)

  return [
    `import type { ToolSearchIndexEntry } from "../types"`,
    "",
    `export const toolSearchIndex: readonly ToolSearchIndexEntry[] = ${JSON.stringify(searchIndex, null, 2)}`,
    "",
  ].join("\n")
}

async function writeFileIfChanged(path: string, contents: string) {
  const currentContents = (await fileExists(path))
    ? await readFile(path, "utf8")
    : null

  if (currentContents === contents) {
    return
  }

  await writeFile(path, contents, "utf8")
}

async function generateToolRegistryArtifacts(
  options: ToolRegistryGenerationOptions = {}
) {
  const paths = resolveToolRegistryPaths(options)
  const manifests = await loadToolManifests(paths)

  await mkdir(paths.generatedRoot, { recursive: true })

  await Promise.all([
    writeFileIfChanged(paths.registryFile, createRegistrySource(manifests)),
    writeFileIfChanged(
      paths.staticPathsFile,
      createStaticPathsSource(manifests)
    ),
    writeFileIfChanged(
      paths.searchIndexFile,
      createSearchIndexSource(manifests)
    ),
  ])

  return {
    manifests,
    paths,
  }
}

const isDirectExecution =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isDirectExecution) {
  generateToolRegistryArtifacts().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : stringifyJson(error))
    process.exitCode = 1
  })
}

export { generateToolRegistryArtifacts, resolveToolRegistryPaths }
