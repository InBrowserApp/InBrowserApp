import type english from "./messages/en.json"

export type Messages = typeof english
export type Format = "env" | "json" | "yaml"
export type Direction = "env-json" | "json-env" | "env-yaml" | "yaml-env"
export type Diagnostic = {
  code: keyof Messages["diagnostics"]
  severity: "error" | "warning"
  line?: number
  key?: string
  previousLine?: number
  quote?: string
  format?: string
  detail?: string
}
export type ParseResult = {
  values: Record<string, string>
  diagnostics: Diagnostic[]
}
export type ConversionResult = ParseResult & {
  state: "empty" | "converted" | "error"
  output: string
}

export function interpolate(
  template: string,
  values: Record<string, string | number>
) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    Object.hasOwn(values, key) ? String(values[key]) : match
  )
}
