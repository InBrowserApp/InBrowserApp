import { mkdir, readdir, readFile, writeFile } from "node:fs/promises"
import { relative, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

import {
  assertToolManifest,
  assertToolMessageCatalogs,
  ToolContractError,
  type ToolManifest,
  type ToolMessageCatalogs,
} from "@workspace/tool-sdk"

import type {
  LoadedToolManifest,
  ToolRegistryArtifactPaths,
  ToolRegistryEntrySource,
  ToolRegistryGenerationOptions,
  ToolSearchIndexEntry,
} from "./types"

function toPosixPath(path: string) {
  return path.replaceAll("\\", "/")
}

function toRelativeImportPath(fromDirectory: string, targetPath: string) {
  const relativePath = toPosixPath(relative(fromDirectory, targetPath))
  const normalized = relativePath.startsWith(".")
    ? relativePath
    : `./${relativePath}`

  return normalized.replace(/\.(?:ts|tsx|js|jsx)$/, "")
}

function toVariableName(slug: string) {
  const camelCase = slug.replace(/-([a-z0-9])/g, (_, character: string) =>
    character.toUpperCase()
  )

  return camelCase.replace(/^[0-9]/, (digit) => `tool${digit}`)
}

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

async function discoverToolManifestSources(
  toolsRoot: string,
  generatedRoot: string
) {
  const directoryEntries = await readdir(toolsRoot, { withFileTypes: true })
  const manifestSources: ToolRegistryEntrySource[] = []

  for (const entry of directoryEntries) {
    if (!entry.isDirectory()) {
      continue
    }

    const manifestAbsolutePath = resolve(toolsRoot, entry.name, "manifest.ts")

    if (!(await fileExists(manifestAbsolutePath))) {
      continue
    }

    manifestSources.push({
      directoryName: entry.name,
      manifestAbsolutePath,
      manifestImportPath: toRelativeImportPath(
        generatedRoot,
        manifestAbsolutePath
      ),
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

async function loadToolMessageCatalogs(
  manifest: ToolManifest,
  source: ToolRegistryEntrySource
) {
  const manifestDirectory = resolve(source.manifestAbsolutePath, "..")
  const catalogs = Object.fromEntries(
    await Promise.all(
      Object.entries(manifest.messages).map(async ([language, path]) => {
        const absolutePath = resolve(manifestDirectory, path)
        const parsedJson = await readJsonFile(absolutePath)
        return [language, parsedJson]
      })
    )
  ) as ToolMessageCatalogs

  assertToolMessageCatalogs(catalogs)

  return catalogs
}

async function assertContentFilesExist(
  manifest: ToolManifest,
  source: ToolRegistryEntrySource
) {
  if (!manifest.content) {
    return
  }

  const manifestDirectory = resolve(source.manifestAbsolutePath, "..")
  const missingFiles: string[] = []

  for (const path of Object.values(manifest.content)) {
    const absolutePath = resolve(manifestDirectory, path)

    if (!(await fileExists(absolutePath))) {
      missingFiles.push(absolutePath)
    }
  }

  if (missingFiles.length > 0) {
    throw new ToolContractError("Missing tool content files.", missingFiles)
  }
}

async function assertPageFileExists(
  manifest: ToolManifest,
  source: ToolRegistryEntrySource
) {
  if (!manifest.page) {
    return
  }

  const manifestDirectory = resolve(source.manifestAbsolutePath, "..")
  const absolutePath = resolve(manifestDirectory, manifest.page)

  if (!(await fileExists(absolutePath))) {
    throw new ToolContractError("Missing tool page file.", [absolutePath])
  }
}

function buildSearchIndexEntry(
  manifest: ToolManifest,
  catalogs: ToolMessageCatalogs
): ToolSearchIndexEntry {
  const locales = Object.fromEntries(
    Object.entries(catalogs).map(([language, catalog]) => [
      language,
      {
        name: catalog.meta.name,
        description: catalog.meta.description,
      },
    ])
  )

  return {
    id: manifest.id,
    slug: manifest.slug,
    category: manifest.category,
    group: manifest.group,
    icon: manifest.icon,
    tags: manifest.tags,
    features: manifest.features ?? [],
    searchTerms: manifest.searchTerms ?? [],
    locales,
  }
}

function buildStaticPaths(manifest: ToolManifest) {
  return Object.keys(manifest.messages)
    .sort((left, right) => left.localeCompare(right))
    .map((language) => ({
      slug: manifest.slug,
      language,
    }))
}

async function loadToolManifests(paths: ToolRegistryArtifactPaths) {
  const manifestSources = await discoverToolManifestSources(
    paths.toolsRoot,
    paths.generatedRoot
  )
  const manifests: LoadedToolManifest[] = []
  const slugOwners = new Map<string, string>()
  const idOwners = new Map<string, string>()

  for (const source of manifestSources) {
    const manifest = loadManifestModule(source)
    const loadedManifest = await manifest

    assertToolManifest(loadedManifest)

    if (loadedManifest.slug !== source.directoryName) {
      throw new ToolContractError("Tool slug must match its directory name.", [
        `${source.manifestAbsolutePath}: slug '${loadedManifest.slug}' does not match directory '${source.directoryName}'`,
      ])
    }

    const existingSlugOwner = slugOwners.get(loadedManifest.slug)
    if (existingSlugOwner) {
      throw new ToolContractError("Duplicate tool slug detected.", [
        `${loadedManifest.slug}: ${existingSlugOwner}`,
        `${loadedManifest.slug}: ${source.manifestAbsolutePath}`,
      ])
    }
    slugOwners.set(loadedManifest.slug, source.manifestAbsolutePath)

    const existingIdOwner = idOwners.get(loadedManifest.id)
    if (existingIdOwner) {
      throw new ToolContractError("Duplicate tool id detected.", [
        `${loadedManifest.id}: ${existingIdOwner}`,
        `${loadedManifest.id}: ${source.manifestAbsolutePath}`,
      ])
    }
    idOwners.set(loadedManifest.id, source.manifestAbsolutePath)

    const catalogs = await loadToolMessageCatalogs(loadedManifest, source)
    await assertContentFilesExist(loadedManifest, source)
    await assertPageFileExists(loadedManifest, source)

    manifests.push({
      manifest: loadedManifest,
      source,
      searchIndexEntry: buildSearchIndexEntry(loadedManifest, catalogs),
      staticPaths: buildStaticPaths(loadedManifest),
    })
  }

  return manifests.sort((left, right) =>
    left.manifest.slug.localeCompare(right.manifest.slug)
  )
}

function createRegistrySource(manifests: readonly LoadedToolManifest[]) {
  const importLines = manifests.map(({ manifest, source }) => {
    const variableName = toVariableName(manifest.slug)
    return `import { tool as ${variableName} } from "${source.manifestImportPath}"`
  })

  const registryEntries = manifests.map(({ manifest }) =>
    toVariableName(manifest.slug)
  )
  const slugMapEntries = manifests.map(
    ({ manifest }) => `  "${manifest.slug}": ${toVariableName(manifest.slug)},`
  )
  const idMapEntries = manifests.map(
    ({ manifest }) => `  "${manifest.id}": ${toVariableName(manifest.slug)},`
  )

  const toolRegistryBySlug =
    slugMapEntries.length === 0
      ? `export const toolRegistryBySlug: Record<string, ToolManifest> = {}`
      : [
          `export const toolRegistryBySlug: Record<string, ToolManifest> = {`,
          ...slugMapEntries,
          `}`,
        ].join("\n")
  const toolRegistryById =
    idMapEntries.length === 0
      ? `export const toolRegistryById: Record<string, ToolManifest> = {}`
      : [
          `export const toolRegistryById: Record<string, ToolManifest> = {`,
          ...idMapEntries,
          `}`,
        ].join("\n")

  return [
    `import type { ToolManifest } from "@workspace/tool-sdk"`,
    ...importLines,
    "",
    `export const toolRegistry: readonly ToolManifest[] = [${registryEntries.join(", ")}]`,
    "",
    toolRegistryBySlug,
    "",
    toolRegistryById,
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
