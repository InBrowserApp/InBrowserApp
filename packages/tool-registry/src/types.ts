import type { ToolManifest, ToolMeta } from "@workspace/tool-sdk"

type ToolRegistryEntrySource = Readonly<{
  directoryName: string
  packageName: string
  manifestAbsolutePath: string
  toolRoot: string
}>

type ToolStaticPathEntry = Readonly<{
  slug: string
  language: string
}>

type ToolSearchLocaleEntry = ToolMeta

type ToolRegistryEntry = Readonly<{
  slug: string
  category: string
  secondaryCategories?: readonly string[]
  icon: string
  tags: readonly string[]
  locales: Readonly<Record<string, ToolSearchLocaleEntry>>
}>

type ToolSearchIndexEntry = ToolRegistryEntry

type ToolSearchSuggestionEntry = Readonly<{
  slug: string
  category: string
  name: string
  alternateName?: string
}>

type ToolRegistryArtifactPaths = Readonly<{
  repoRoot: string
  toolsRoot: string
  packageRoot: string
  generatedRoot: string
  registryFile: string
  staticPathsFile: string
  searchIndexFile: string
  pageLoadersFile: string
}>

type ToolRegistryGenerationOptions = Readonly<{
  repoRoot?: string
}>

type LoadedToolManifest = Readonly<{
  manifest: ToolManifest
  registryEntry: ToolRegistryEntry
  source: ToolRegistryEntrySource
  staticPaths: readonly ToolStaticPathEntry[]
}>

export type {
  LoadedToolManifest,
  ToolRegistryArtifactPaths,
  ToolRegistryEntry,
  ToolRegistryEntrySource,
  ToolRegistryGenerationOptions,
  ToolSearchIndexEntry,
  ToolSearchSuggestionEntry,
  ToolSearchLocaleEntry,
  ToolStaticPathEntry,
}
