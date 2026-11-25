import { resolveLocale } from "@workspace/tool-sdk"
import type common from "./messages/en.json"

type Shared = typeof common
type CatalogGlob = (
  pattern: string,
  options: { eager: true; import: "default" }
) => Record<string, Shared>

const catalogs = (import.meta.glob as unknown as CatalogGlob)(
  "./messages/*.json",
  {
    eager: true,
    import: "default",
  }
)

export function archiveMessages(lang: string) {
  return resolveLocale<Shared>(catalogs, lang)!
}

export type ArchiveMessages = Shared &
  Record<
    "open" | "replace" | "releaseFile" | "drop" | "formats" | "invalid",
    string
  > & { sample?: string }

export type FolderMessages = Record<
  "folders" | "empty" | "allFolders" | "emptyFolder",
  string
>
