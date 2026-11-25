import { resolveLocale } from "@workspace/tool-sdk"
import type English from "./messages/en.json"

export type MeshConverterMessages = typeof English

const catalogs = import.meta.glob<{ default: MeshConverterMessages }>(
  "./messages/*.json"
)

export async function getMeshConverterMessages(lang: string) {
  const load = resolveLocale(catalogs, lang)!
  return (await load()).default
}
