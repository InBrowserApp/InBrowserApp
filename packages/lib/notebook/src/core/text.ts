export function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("INVALID")
  return value as Record<string, unknown>
}
export function text(value: unknown): string {
  if (typeof value === "string") return value
  if (Array.isArray(value) && value.every((x) => typeof x === "string"))
    return value.join("")
  throw new Error("INVALID")
}
export function escape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
function terminal(value: string) {
  // ANSI CSI and OSC commands are presentation/control data, never HTML.
  /* oxlint-disable no-control-regex */
  return value
    .replace(/\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)/g, "")
    .replace(/\x1b\[[0-?]*[ -/]*[@-~]/g, "")
  /* oxlint-enable no-control-regex */
}
export function pre(value: string) {
  return `<pre>${escape(terminal(value))}</pre>`
}
