// Keep discovery imports independent of tool pages and their styles.
export { toolRegistry, toolRegistryBySlug } from "./generated/registry"
export { toolSearchIndex } from "./generated/search-index"
export { toolStaticPaths } from "./generated/static-paths"
export type {
  ToolRegistryArtifactPaths,
  ToolRegistryEntry,
  ToolRegistryEntrySource,
  ToolRegistryGenerationOptions,
  ToolSearchIndexEntry,
  ToolSearchLocaleEntry,
  ToolStaticPathEntry,
} from "./types"
