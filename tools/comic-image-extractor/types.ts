import type { ComicPage } from "@workspace/comic/types"
import type English from "./messages/en.json"

export type Messages = typeof English
export type Format = "original" | "jpg"
export const extension = /\.(?:cbz|cbr|cb7)$/i

export function canRead(page: ComicPage) {
  return page.status === "unchecked" || page.status === "ready"
}
