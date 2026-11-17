import type english from "./messages/en.json"
import type { MediaInfoResult } from "mediainfo.js"

export type Messages = { [K in keyof typeof english]: string }
export type Reply =
  | { result: MediaInfoResult }
  | { error: "parseError" | "loadError" }
