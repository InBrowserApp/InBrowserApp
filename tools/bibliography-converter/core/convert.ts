import { plugins, type CSL } from "@citation-js/core"
import "@citation-js/plugin-bibtex"

import type { Format, InputFormat } from "../formats"
import { findDuplicates, type Duplicate } from "./duplicates"
import { formatRis, parseRis } from "./ris"

// Citation.js otherwise rewrites syntax-safe keys containing hyphens or dots.
plugins.config.get("@bibtex").format.checkLabel = false

export type Conversion =
  | { state: "inputError" | "outputError" }
  | {
      state: "converted"
      output: string
      count: number
      duplicates: Duplicate[]
    }

function detectFormat(text: string): Format {
  if (/^[[{]/.test(text)) return "json"
  if (/^TY[ \t]+-[ \t]+/.test(text)) {
    return "ris"
  }
  return "bibtex"
}

function isCslEntry(value: unknown): value is CSL {
  if (!value || typeof value !== "object") return false
  const entry = value as Partial<CSL>
  return (
    typeof entry.type === "string" &&
    entry.type.length > 0 &&
    (typeof entry.id === "string" || typeof entry.id === "number")
  )
}

function parse(text: string, format: Format): CSL[] {
  if (format === "bibtex") {
    const raw = plugins.input.data(text, "@biblatex/text")
    // The plugin's declaration describes the input instead of the CSL result.
    return plugins.input.data(raw, "@biblatex/entries+list") as unknown as CSL[]
  }
  if (format === "ris") return parseRis(text)
  const json: unknown = JSON.parse(text)
  const entries: unknown[] = Array.isArray(json) ? json : [json]
  if (!entries.every(isCslEntry)) throw new Error("Expected CSL JSON entries")
  return entries
}

function formatBibtex(entries: CSL[]) {
  const taken = new Set<string>()
  const keyed = entries.map((entry, index) => {
    // BibTeX needs distinct keys. Keep usable citation keys and IDs when possible.
    const candidate = entry["citation-key"] ?? String(entry.id)
    const base = /^[a-z\d][a-z\d_.:+/-]*$/i.test(candidate)
      ? candidate
      : `ref-${index + 1}`
    let key = base
    let suffix = 2
    while (taken.has(key)) key = `${base}-${suffix++}`
    taken.add(key)
    return { ...entry, "citation-key": key }
  })
  return plugins.output.format("bibtex", keyed)
}

export function convertReferences(
  input: string,
  source: InputFormat,
  target: Format
): Conversion {
  const text = input.trim()
  const format = source === "auto" ? detectFormat(text) : source
  let entries: CSL[]
  let duplicates: Duplicate[]
  try {
    entries = parse(text, format)
    if (!entries.length) return { state: "inputError" }
    duplicates = findDuplicates(entries)
  } catch {
    return { state: "inputError" }
  }

  try {
    let output: string
    if (format === target) output = text
    else if (target === "ris") output = formatRis(entries)
    else if (target === "bibtex") output = formatBibtex(entries)
    else output = JSON.stringify(entries, null, 2) + "\n"
    return { state: "converted", output, count: entries.length, duplicates }
  } catch {
    return { state: "outputError" }
  }
}
