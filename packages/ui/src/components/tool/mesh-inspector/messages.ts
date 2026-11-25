import { resolveLocale } from "@workspace/tool-sdk"
import type English from "./messages/en.json"

export type MeshInspectorMessages = typeof English
const catalogs = import.meta.glob<{ default: MeshInspectorMessages }>(
  "./messages/*.json"
)

export async function getMeshInspectorMessages(lang: string) {
  return (await resolveLocale(catalogs, lang)!()).default
}
