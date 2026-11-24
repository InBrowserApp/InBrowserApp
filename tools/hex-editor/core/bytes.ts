export const PAGE_SIZE = 256

export function hex(value: number, width = 2) {
  return value.toString(16).toUpperCase().padStart(width, "0")
}

export function ascii(value: number) {
  return value >= 32 && value <= 126 ? String.fromCharCode(value) : "."
}

export function parseOffset(input: string, size: number) {
  const value = input.trim()
  if (!/^(?:0x)?[0-9a-f]+$/i.test(value)) return null

  const offset = Number.parseInt(value, 16)
  return offset < size ? offset : null
}

export function pageStart(offset: number) {
  return Math.floor(offset / PAGE_SIZE) * PAGE_SIZE
}

export function patchedFile(file: File, edits: ReadonlyMap<number, number>) {
  const parts: BlobPart[] = []
  const orderedEdits = [...edits].sort(([left], [right]) => left - right)
  let cursor = 0
  let run: number[] = []

  for (const [offset, value] of orderedEdits) {
    if (offset !== cursor) {
      parts.push(Uint8Array.from(run), file.slice(cursor, offset))
      run = []
    }
    run.push(value)
    cursor = offset + 1
  }

  parts.push(Uint8Array.from(run), file.slice(cursor))
  return new Blob(parts, { type: file.type })
}
