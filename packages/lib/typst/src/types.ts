export type Diagnostic = {
  message: string
  line: number | null
  column: number | null
  severity: string
}
export type Phase = "reading" | "preparing" | "compiling"
export type Failure =
  | "invalid"
  | "empty"
  | "resource"
  | "engineUnavailable"
  | "failed"
export type CompileResult = {
  pdf?: ArrayBuffer
  diagnostics: Diagnostic[]
  error?: Failure
}
export type WorkerReply =
  | { type: "progress"; phase: Phase }
  | ({ type: "complete" } & CompileResult)
