import type { ToolManifest } from "@workspace/tool-sdk"

type ToolRegistryEntrySource = Readonly<{
  directoryName: string
  manifestAbsolutePath: string
  manifestImportPath: string
}>

type ToolStaticPathEntry = Readonly<{
  slug: string
  language: string
}>

type ToolSearchLocaleEntry = Readonly<{
  name: string
  description: string
}>

type ToolSearchIndexEntry = Readonly<{
  id: string
  slug: string
  category: string
  group?: string
  icon: string
  tags: readonly string[]
  features: readonly string[]
  searchTerms: readonly string[]
  locales: Readonly<Record<string, ToolSearchLocaleEntry>>
}>

type ToolRegistryArtifactPaths = Readonly<{
  repoRoot: string
  toolsRoot: string
  packageRoot: string
  generatedRoot: string
  registryFile: string
  staticPathsFile: string
  searchIndexFile: string
}>

type ToolRegistryGenerationOptions = Readonly<{
  repoRoot?: string
}>

type LoadedToolManifest = Readonly<{
  manifest: ToolManifest
  source: ToolRegistryEntrySource
  searchIndexEntry: ToolSearchIndexEntry
  staticPaths: readonly ToolStaticPathEntry[]
}>

export type {
  LoadedToolManifest,
  ToolRegistryArtifactPaths,
  ToolRegistryEntrySource,
  ToolRegistryGenerationOptions,
  ToolSearchIndexEntry,
  ToolSearchLocaleEntry,
  ToolStaticPathEntry,
}
