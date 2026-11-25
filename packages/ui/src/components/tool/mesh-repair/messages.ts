import { resolveLocale } from "@workspace/tool-sdk"
import type English from "./messages/en.json"

export type MeshRepairMessages = typeof English
const catalogs = import.meta.glob<{ default: MeshRepairMessages }>(
  "./messages/*.json"
)

export async function getMeshRepairMessages(lang: string) {
  return (await resolveLocale(catalogs, lang)!()).default
}
