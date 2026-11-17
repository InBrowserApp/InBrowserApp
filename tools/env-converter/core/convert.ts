import { dump, JSON_SCHEMA, load, YAMLException } from "js-yaml"

import { ENV_KEY, parseEnv } from "./parse-env"
import type {
  ConversionResult,
  Diagnostic,
  Format,
  ParseResult,
} from "../types"

function parseStructured(input: string, format: "json" | "yaml"): ParseResult {
  const values: Record<string, string> = Object.create(null)
  const diagnostics: Diagnostic[] = []
  let parsed: unknown
  try {
    // JSON.parse enforces strict JSON syntax; js-yaml also detects duplicate keys.
    const json: unknown = format === "json" ? JSON.parse(input) : undefined
    const yaml = load(input, { schema: JSON_SCHEMA })
    parsed = format === "json" ? json : yaml
  } catch (error) {
    const line =
      error instanceof YAMLException && error.mark
        ? error.mark.line + 1
        : undefined
    return {
      values,
      diagnostics: [
        {
          code: "syntax",
          severity: "error",
          format: format.toUpperCase(),
          line,
        },
      ],
    }
  }
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { values, diagnostics: [{ code: "rootObject", severity: "error" }] }
  }
  for (const [key, value] of Object.entries(parsed)) {
    if (!ENV_KEY.test(key)) {
      diagnostics.push({ code: "invalidKey", severity: "error", key })
    } else if (
      typeof value === "string" ||
      typeof value === "boolean" ||
      (typeof value === "number" && Number.isFinite(value))
    ) {
      values[key] = String(value)
    } else {
      diagnostics.push({ code: "invalidValue", severity: "error", key })
    }
  }
  return { values, diagnostics }
}

function serializeEnv(
  values: Record<string, string>,
  diagnostics: Diagnostic[]
) {
  return Object.entries(values)
    .map(([key, value]) => {
      if (value === "" || (!/[\s#]/.test(value) && !/^["'`“”‘’]/.test(value)))
        return `${key}=${value}`
      for (const quote of ["'", '"', "`"]) {
        if (value.includes(quote)) continue
        if (quote === '"' && /\\[nr]/.test(value)) continue
        if (value.includes("\r") && quote !== '"') continue
        return `${key}=${quote}${value.replace(/\r/g, "\\r")}${quote}`
      }
      diagnostics.push({ code: "unrepresentable", severity: "error", key })
      return ""
    })
    .join("\n")
}

export function convert(
  input: string,
  from: Format,
  to: Format
): ConversionResult {
  if (!input.trim())
    return { state: "empty", output: "", values: {}, diagnostics: [] }
  const { values, diagnostics } =
    from === "env" ? parseEnv(input) : parseStructured(input, from)
  let output = ""
  if (!diagnostics.some((item) => item.severity === "error")) {
    output =
      to === "env"
        ? serializeEnv(values, diagnostics)
        : to === "json"
          ? JSON.stringify(values, null, 2)
          : dump(values, {
              schema: JSON_SCHEMA,
              noRefs: true,
              lineWidth: -1,
              forceQuotes: true,
              quoteStyle: "double",
            })
  }
  const state = diagnostics.some((item) => item.severity === "error")
    ? "error"
    : "converted"
  return { state, output: state === "error" ? "" : output, values, diagnostics }
}
