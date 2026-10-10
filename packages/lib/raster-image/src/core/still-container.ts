/** Reject compositions and timed tracks even when a container advertises a still-compatible brand. */
export function assertStillContainer(bytes: Uint8Array) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  let offset = 0
  let codestreams = 0
  while (offset < bytes.length) {
    if (bytes.length - offset < 8) throw new Error("invalid")
    let size = view.getUint32(offset)
    let header = 8
    if (size === 1) {
      if (bytes.length - offset < 16) throw new Error("invalid")
      size = Number(view.getBigUint64(offset + 8))
      header = 16
    } else if (size === 0) size = bytes.length - offset
    if (size < header || size > bytes.length - offset)
      throw new Error("invalid")
    const type = String.fromCharCode(...bytes.subarray(offset + 4, offset + 8))
    if (["moov", "jpxh", "jplh", "jpch", "comp"].includes(type))
      throw new Error("sequence")
    if (type === "jp2c" && ++codestreams > 1) throw new Error("sequence")
    offset += size
  }
}
