import type messages from "./messages/en.json"

export type Messages = typeof messages
export type ImportError = keyof Messages["errors"]
export type Pair = Readonly<{ name: string; value: string }>
export type Phase = keyof Messages["phases"]
export type Body = Readonly<{
  text: string | null
  mimeType: string
  encoding: string
  params: readonly Pair[]
}>
export type Entry = Readonly<{
  id: number
  started: number
  duration: number | null
  url: string
  method: string
  status: number
  statusText: string
  protocol: string
  mimeType: string
  transferSize: number | null
  contentSize: number | null
  timings: Readonly<Record<Phase, number | null>>
  request: Readonly<{
    headers: readonly Pair[]
    cookies: readonly Pair[]
    query: readonly Pair[]
    body: Body
  }>
  response: Readonly<{
    headers: readonly Pair[]
    cookies: readonly Pair[]
    body: Body
  }>
}>
export type Capture = Readonly<{
  entries: readonly Entry[]
  skipped: number
  started: number
  span: number
}>
