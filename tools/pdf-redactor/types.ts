import type englishMessages from "./messages/en.json"

export type Messages = typeof englishMessages
export type Point = { x: number; y: number }
export type Region = Readonly<{
  left: number
  top: number
  right: number
  bottom: number
}>
export type Redactions = Readonly<Partial<Record<number, readonly Region[]>>>
