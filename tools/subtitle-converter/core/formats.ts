export const FORMATS = [
  { id: "srt", label: "SubRip · SRT", extension: "srt" },
  { id: "vtt", label: "WebVTT · VTT", extension: "vtt" },
  { id: "ass", label: "Advanced SubStation Alpha · ASS", extension: "ass" },
  { id: "ssa", label: "SubStation Alpha · SSA", extension: "ssa" },
  { id: "sbv", label: "YouTube SubViewer · SBV", extension: "sbv" },
  { id: "microdvd", label: "MicroDVD · SUB", extension: "sub" },
  { id: "subviewer", label: "SubViewer 2.0 · SUB", extension: "sub" },
  { id: "sami", label: "SAMI · SMI", extension: "smi" },
  { id: "lrc", label: "Lyrics · LRC", extension: "lrc" },
  { id: "ttml", label: "Timed Text · TTML", extension: "ttml" },
  {
    id: "dfxp",
    label: "Distribution Format Exchange · DFXP",
    extension: "dfxp",
  },
  { id: "srv3", label: "YouTube · SRV3", extension: "srv3" },
  { id: "youtube", label: "YouTube · XML", extension: "xml" },
  { id: "mpl2", label: "MPL2 · MPL", extension: "mpl" },
  { id: "spruce", label: "Spruce Subtitle · STL (text)", extension: "stl" },
  { id: "qt", label: "QuickTime Text · QT.TXT", extension: "qt.txt" },
  { id: "json", label: "JSON · ms", extension: "json" },
  { id: "csv", label: "CSV", extension: "csv" },
  { id: "tsv", label: "TSV", extension: "tsv" },
  { id: "txt", label: "TXT", extension: "txt" },
] as const

export type Format = (typeof FORMATS)[number]["id"]
export type InputFormat = Exclude<Format, "txt"> | "auto"
export type Cue = { start: number; end: number; text: string }
export type Options = {
  source: InputFormat
  target: Format
  fps: number
  offset: number
}
type ErrorCode =
  | "empty"
  | "unsupported"
  | "invalid"
  | "timing"
  | "invalidOptions"
  | "encodingError"
  | "noCues"

export class SubtitleError extends Error {
  constructor(public code: ErrorCode) {
    super(code)
  }
}
