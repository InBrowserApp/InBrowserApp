import type { Diagnostic, Failure } from "../types"

export function readSource(bytes: ArrayBuffer): string {
  let source: string
  try {
    source = new TextDecoder("utf-8", { fatal: true }).decode(bytes)
  } catch (reason) {
    if (reason instanceof TypeError) throw new Error("invalid")
    throw reason
  }
  if (!source.trim()) throw new Error("empty")
  return source
}

export function diagnostic(value: {
  message: string
  range: string
  severity: string
}): Diagnostic {
  const match = /^(\d+):(\d+)-/.exec(value.range)
  return {
    message: value.message,
    severity: value.severity,
    line: match ? Number(match[1]) + 1 : null,
    column: match ? Number(match[2]) + 1 : null,
  }
}

export function failure(reason: unknown): Failure {
  if (reason instanceof RangeError) return "resource"
  const message = reason instanceof Error ? reason.message : String(reason)
  if (message === "invalid" || message === "empty") return message
  if (
    /out of memory|memory access|allocation|array buffer|arraybuffer|invalid array length|invalid string length/i.test(
      message
    )
  )
    return "resource"
  return "failed"
}
