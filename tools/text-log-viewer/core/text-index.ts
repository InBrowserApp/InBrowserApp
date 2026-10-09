import type { Section } from "../types"
// These bound the displayed section, never the input or searchable content.
const SECTION_UNITS = 32768
const SECTION_LINES = 256
export function floorIndex(sorted: readonly number[], value: number) {
  let lo = 0,
    hi = sorted.length
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2)
    if (sorted[mid]! <= value) lo = mid + 1
    else hi = mid
  }
  return Math.max(0, lo - 1)
}
export class TextIndex {
  chunks: string[] = []
  offsets: number[] = []
  lines: number[] = [0]
  sections: number[] = [0]
  length = 0
  private cr = false
  add(text: string) {
    if (!text) return
    if (text.includes("\0")) throw new Error("BINARY")
    this.offsets.push(this.length)
    this.chunks.push(text)
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i)
      if (char === 10 && this.cr)
        this.lines[this.lines.length - 1] = this.length + i + 1
      else if (char === 10 || char === 13) this.lines.push(this.length + i + 1)
      this.cr = char === 13
    }
    this.length += text.length
  }
  read(start: number, end: number) {
    let result = ""
    for (
      let i = floorIndex(this.offsets, start);
      i < this.chunks.length && this.offsets[i]! < end;
      i++
    ) {
      const offset = this.offsets[i]!
      result += this.chunks[i]!.slice(Math.max(0, start - offset), end - offset)
    }
    return result
  }
  finish() {
    this.sections = [0]
    let start = 0
    while (start < this.length) {
      const line = floorIndex(this.lines, start)
      let end = Math.min(
        this.length,
        start + SECTION_UNITS,
        this.lines[line + SECTION_LINES] ?? this.length
      )
      const pair = this.read(end - 1, end + 1)
      // Keep CRLF and UTF-16 surrogate pairs together at display boundaries.
      if (
        pair === "\r\n" ||
        (/[\uD800-\uDBFF]/.test(pair[0]!) && /[\uDC00-\uDFFF]/.test(pair[1]!))
      )
        end++
      if (end < this.length) this.sections.push(end)
      start = end
    }
  }
  section(index: number): Section {
    index = Math.max(0, Math.min(this.sections.length - 1, Math.trunc(index)))
    const start = this.sections[index]!,
      end = this.sections[index + 1] ?? this.length
    const rows: Section["rows"] = []
    for (
      let line = floorIndex(this.lines, start);
      line < this.lines.length;
      line++
    ) {
      const origin = this.lines[line]!
      if (origin >= end && !(origin === this.length && end === this.length))
        break
      const offset = Math.max(origin, start)
      const lineEnd = this.lines[line + 1] ?? this.length
      const contentEnd =
        lineEnd -
        (this.read(Math.max(origin, lineEnd - 2), lineEnd).match(
          /\r\n$|[\r\n]$/
        )?.[0].length ?? 0)
      rows.push({
        line: line + 1,
        offset,
        text: this.read(offset, Math.min(contentEnd, end)),
        continued: offset > origin,
      })
    }
    return { index, start, end, rows }
  }
  at(offset: number) {
    return this.section(floorIndex(this.sections, offset))
  }
}
