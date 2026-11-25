import { resolveLocale } from "@workspace/tool-sdk"
import type English from "./messages/en.json"

export type ModelViewerMessages = typeof English

const locales = import.meta.glob<{ default: ModelViewerMessages }>(
  "./messages/*.json"
)

export async function getModelViewerMessages(lang: string) {
  const load = resolveLocale(locales, lang)!
  return (await load()).default
}
