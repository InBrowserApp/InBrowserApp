import type { Resource } from "./core/resources"
import type { Failure } from "./core/errors"
export type Request =
  | { type: "open"; bytes: Uint8Array }
  | { type: "continue"; svg?: string }
export type Reply =
  | { type: "resources"; resources: Resource[] }
  | { type: "page"; svg: string; page: number; total: number }
  | { type: "progress"; stage: "engineLoading" | "saving" }
  | { type: "result"; bytes: Uint8Array; pages: number }
  | { type: "error"; code: Failure; page?: number }
