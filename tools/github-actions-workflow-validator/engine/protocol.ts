type WorkflowDiagnostic = (
  | { message: string; code?: never }
  | { code: "singleDocument"; message?: never }
) & { line: number; column: number; warning?: boolean }

type WorkflowCheck = { issues: WorkflowDiagnostic[] } | { error: string }

export type { WorkflowCheck, WorkflowDiagnostic }
