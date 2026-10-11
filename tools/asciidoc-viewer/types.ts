import type en from "./messages/en.json"

export type Messages = typeof en
export type { Failure, Conversion, WorkerResult } from "@workspace/asciidoc"
export type Preview = import("@workspace/web-document").WebDocument & {
  includes: boolean
  warnings: boolean
}
