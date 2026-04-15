import type { DefaultRequiredToolLanguage, ToolLanguage } from "./languages"

type ToolMeta = Readonly<{
  name: string
  description: string
}>

type ToolMetaCatalogs<TLanguage extends string = ToolLanguage> = Readonly<
  Record<TLanguage, ToolMeta>
>

/**
 * Known tool categories.  The union is open-ended (`string & {}`) so new
 * categories can be introduced without updating the SDK first, while
 * existing values still get autocomplete and typo detection.
 */
type ToolCategory =
  | "crypto"
  | "developer"
  | "image"
  | "json"
  | "network"
  | "pdf"
  | "text"
  | "web"
  | (string & {})

/** Known lucide icon identifiers used across tool manifests. */
type ToolIcon =
  | "binary"
  | "braces"
  | "credit-card"
  | "file-text"
  | "globe"
  | "image"
  | "lock"
  | "network"
  | "file-json-2"
  | (string & {})

type ToolDefinition = Readonly<{
  category: ToolCategory
  icon: ToolIcon
  tags?: readonly string[]
}>

type ToolManifest = ToolDefinition

type ToolValidationOptions<TLanguage extends string = ToolLanguage> = Readonly<{
  requiredLanguages?: readonly TLanguage[]
}>

export type {
  DefaultRequiredToolLanguage,
  ToolCategory,
  ToolDefinition,
  ToolIcon,
  ToolLanguage,
  ToolManifest,
  ToolMeta,
  ToolMetaCatalogs,
  ToolValidationOptions,
}
