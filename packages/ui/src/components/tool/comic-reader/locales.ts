import { resolveLocale } from "@workspace/tool-sdk"
import type { Messages } from "./types"

type CatalogGlob = (
  pattern: string,
  options: { eager: true; import: "default" }
) => Record<string, Messages>

const locales = (import.meta.glob as unknown as CatalogGlob)(
  "./messages/*.json",
  { eager: true, import: "default" }
)

export function comicReaderMessages(lang: string): Messages {
  return resolveLocale(locales, lang)!
}
