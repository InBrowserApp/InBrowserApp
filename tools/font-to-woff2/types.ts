import type messages from "./messages/en.json"

export type Messages = typeof messages

export type ConversionResult = {
  index: number
  output: ArrayBuffer | null
}
