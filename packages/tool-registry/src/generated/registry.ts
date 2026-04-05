import type { ToolManifest } from "@workspace/tool-sdk"

export const toolRegistry: readonly ToolManifest[] = []

export const toolRegistryBySlug: Record<string, ToolManifest> = {}

export const toolRegistryById: Record<string, ToolManifest> = {}
