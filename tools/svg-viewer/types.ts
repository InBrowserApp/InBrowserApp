import type en from "./messages/en.json"

export type Messages = typeof en
export type Failure =
  | "unsupported"
  | "emptyFile"
  | "invalid"
  | "compression"
  | "encoding"
  | "doctype"
  | "resourceLimit"
  | "renderError"
export type Illustration = {
  svg: string
  width: number
  height: number
  declaredWidth: string
  declaredHeight: string
  viewBox: string
  absolute: boolean
  omitted: boolean
  empty: boolean
}
