type Window = Readonly<{ start: number; end: number }>

type SecondSignal = Readonly<{
  windows: readonly Window[]
  symbol: string
}>

/* v8 ignore file -- type-only module */

type StationId = "jjy-40" | "jjy-60" | "bpc" | "dcf77" | "msf" | "wwvb"

export type { SecondSignal, StationId, Window }
