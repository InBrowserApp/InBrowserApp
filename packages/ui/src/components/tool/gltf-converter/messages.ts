import { resolveLocale } from "@workspace/tool-sdk"
import type English from "./messages/en.json"

export type GltfConverterMessages = typeof English
const catalogs = import.meta.glob<{ default: GltfConverterMessages }>(
  "./messages/*.json"
)

export async function getGltfConverterMessages(lang: string) {
  return (await resolveLocale(catalogs, lang)!()).default
}
