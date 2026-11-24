import { resolveLocale } from "@workspace/tool-sdk"
import type EnglishMessages from "./torrent-messages/en.json"

type CatalogGlob = (
  pattern: string,
  options: { eager: true; import: "default" }
) => Record<string, typeof EnglishMessages>

const catalogs = (import.meta.glob as unknown as CatalogGlob)(
  "./torrent-messages/*.json",
  { eager: true, import: "default" }
)

function getTorrentMessages(language: string) {
  return resolveLocale<typeof EnglishMessages>(catalogs, language)!
}

export { getTorrentMessages }
