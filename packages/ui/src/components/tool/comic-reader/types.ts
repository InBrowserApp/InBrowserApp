import type messages from "./messages/en.json"

export type Messages = typeof messages
export type { Comic, PageStatus } from "@workspace/comic/types"
export type LoadedImage = { url: string; width: number; height: number }
export type Fit = "page" | "width" | number
