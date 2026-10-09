import type en from "./messages/en.json"

export type Messages = typeof en
export type Failure =
  | "unsupported"
  | "emptyFile"
  | "invalid"
  | "encoding"
  | "resourceLimit"
