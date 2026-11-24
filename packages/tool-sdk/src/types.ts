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
 * existing values still get autocomplete.
 */
type ToolCategory =
  | "audio"
  | "crypto"
  | "developer"
  | "diagram"
  | "document"
  | "ebook"
  | "geo"
  | "image"
  | "json"
  | "misc"
  | "network"
  | "pdf"
  | "random"
  | "spreadsheet"
  | "text"
  | "time"
  | "video"
  | "web"
  | (string & {})

/** Known lucide icon identifiers used across tool manifests. */
type ToolIcon =
  | "binary"
  | "braces"
  | "credit-card"
  | "eraser"
  | "eye-off"
  | "file-text"
  | "globe"
  | "image"
  | "lock"
  | "network"
  | "file-json-2"
  | (string & {})

type ToolDefinition = Readonly<{
  /** Primary category, used for the tool's breadcrumb and directory label. */
  category: ToolCategory
  /** Additional categories where the tool can be browsed. */
  secondaryCategories?: readonly ToolCategory[]
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
