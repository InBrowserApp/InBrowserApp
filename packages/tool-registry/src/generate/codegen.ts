import type { LoadedToolManifest } from "../types"

export function createRegistrySource(manifests: readonly LoadedToolManifest[]) {
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

export function createStaticPathsSource(
  manifests: readonly LoadedToolManifest[]
) {
  const staticPaths = manifests.flatMap(({ staticPaths }) => staticPaths)

  return [
    `import type { ToolStaticPathEntry } from "../types"`,
    "",
    `export const toolStaticPaths: readonly ToolStaticPathEntry[] = ${JSON.stringify(staticPaths, null, 2)}`,
    "",
  ].join("\n")
}

export function createSearchIndexSource(
  manifests: readonly LoadedToolManifest[]
) {
  const searchIndex = manifests.map(({ searchIndexEntry }) => searchIndexEntry)

  return [
    `import type { ToolSearchIndexEntry } from "../types"`,
    "",
    `export const toolSearchIndex: readonly ToolSearchIndexEntry[] = ${JSON.stringify(searchIndex, null, 2)}`,
    "",
  ].join("\n")
}

export function createPageLoadersSource(
  manifests: readonly LoadedToolManifest[]
) {
  const entries = manifests
    .map(
      ({ source }) =>
        `  "${source.directoryName}": () => import("${source.packageName}/page"),`
    )
    .join("\n")

  const body =
    manifests.length === 0
      ? `export const toolPageLoaders: Readonly<Record<string, ToolPageLoader>> = {}`
      : [
          `export const toolPageLoaders: Readonly<Record<string, ToolPageLoader>> = {`,
          entries,
          `}`,
        ].join("\n")

  return [
    `import type { AstroComponentFactory } from "astro/runtime/server/index.js"`,
    "",
    `type ToolPageModule = { default: AstroComponentFactory }`,
    `type ToolPageLoader = () => Promise<ToolPageModule>`,
    "",
    body,
    "",
  ].join("\n")
}
