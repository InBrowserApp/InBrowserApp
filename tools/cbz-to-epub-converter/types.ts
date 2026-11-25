import type { ComicPreview } from "@workspace/comic/types"
import type english from "./messages/en.json"

export type Messages = typeof english
export type Result = ComicPreview & { epub: Blob }
export const extension = /\.(?:cbz|cbr|zip|rar)$/i
