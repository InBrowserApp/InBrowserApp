export type Window = { start: number; end: number }

export type SecondSignal = {
  windows: Window[]
  symbol: string
}

export type StationId = 'jjy-40' | 'jjy-60' | 'bpc' | 'dcf77' | 'msf' | 'wwvb'
