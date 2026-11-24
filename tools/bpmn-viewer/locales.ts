import { resolveLocale } from "@workspace/tool-sdk"
import type english from "./messages/en.json"

const locales = import.meta.glob<{ default: typeof english }>(
  "./messages/*.json"
)

export async function getBpmnMessages(language: string) {
  const load = resolveLocale(locales, language)!
  const { default: messages } = await load()
  return messages
}
