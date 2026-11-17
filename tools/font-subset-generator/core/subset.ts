import type { OutputFormat, SubsetOutput, SubsetResult } from "../types"

export function characters(text: string) {
  const codepoints = Array.from(text, (character) => character.codePointAt(0)!)
  return [...new Set(codepoints)]
    .filter((cp) => cp >= 32 && cp !== 127)
    .sort((a, b) => a - b)
}

export function subsetCharacters(text: string) {
  return characters(text + text.normalize("NFC") + text.normalize("NFD"))
}

export function unicodeRange(unicodes: number[]) {
  const ranges: string[] = []
  const sorted = [...new Set(unicodes)].sort((a, b) => a - b)
  for (let i = 0; i < sorted.length; i++) {
    const start = sorted[i]!
    let end = start
    while (sorted[i + 1] === end + 1) end = sorted[++i]!
    const hex = (value: number) => value.toString(16).toUpperCase()
    ranges.push(`U+${hex(start)}${end === start ? "" : `-${hex(end)}`}`)
  }
  return ranges.join(", ")
}

export function createResult(
  result: SubsetOutput,
  file: Pick<File, "name" | "size">,
  text: string,
  format: OutputFormat
): SubsetResult {
  const stem =
    file.name.replace(/\.[^.]*$/, "").replace(/[^a-zA-Z0-9_-]/g, "_") || "font"
  const extension = format === "woff2" ? "woff2" : result.extension
  const filename = `${stem}.subset.${extension}`
  const family = `${stem} Subset`
  const css = `@font-face {\n  font-family: '${family}';\n  src: url('./${filename}') format('${extension === "ttf" ? "truetype" : extension === "otf" ? "opentype" : "woff2"}');\n  font-weight: ${result.weight};\n  font-style: ${result.style};\n  font-display: swap;\n  unicode-range: ${unicodeRange(result.unicodes)};\n}\n`
  return {
    ...result,
    originalSize: file.size,
    text,
    filename,
    mime: `font/${extension}`,
    css,
    family,
  }
}
