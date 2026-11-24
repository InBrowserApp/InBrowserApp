export function hex(value: number, digits = 2) {
  return value.toString(16).toUpperCase().padStart(digits, "0")
}

export function readReport(data: DataView, previous?: Uint8Array) {
  const bytes = new Uint8Array(
    data.buffer,
    data.byteOffset,
    data.byteLength
  ).slice()
  const changed = Array.from(
    bytes,
    (byte, index) => previous !== undefined && previous[index] !== byte
  )
  return { bytes, changed }
}
