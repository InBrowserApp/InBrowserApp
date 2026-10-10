export type Source = { html: string; css: string }
export type Progress = { page: number; pages: number; saving?: boolean }
export type Result = { pdf: Blob; pages: number }
export type Reply =
  | { ready: true }
  | { progress: Progress }
  | { result: Result }
  | { error: string; page: number }
