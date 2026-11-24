import type messages from "./messages/en.json"

export type Messages = typeof messages

export type Request =
  | { type: "open"; file: File }
  | { type: "render"; page: number }

export type PageResult =
  | {
      type: "page"
      page: number
      width: number
      height: number
      cssWidth: number
      pixels: Uint8ClampedArray<ArrayBuffer>
    }
  | { type: "pageError"; page: number }

export type Reply =
  | { type: "opened"; total: number }
  | { type: "invalid" | "engineError" }
  | PageResult
