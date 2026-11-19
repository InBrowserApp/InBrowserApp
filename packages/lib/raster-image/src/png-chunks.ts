function readChunkType(view: DataView, offset: number) {
  return String.fromCharCode(
    view.getUint8(offset),
    view.getUint8(offset + 1),
    view.getUint8(offset + 2),
    view.getUint8(offset + 3)
  )
}

const CRC_TABLE = buildCrcTable()

function buildCrcTable() {
  const table = new Uint32Array(256)

  for (let index = 0; index < table.length; index += 1) {
    let crc = index

    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc & 1) !== 0 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1
    }

    table[index] = crc >>> 0
  }

  return table
}

function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff

  for (const value of bytes) {
    const tableValue = CRC_TABLE[(crc ^ value) & 0xff]!
    crc = tableValue ^ (crc >>> 8)
  }

  return (crc ^ 0xffffffff) >>> 0
}

function setApngLoop(buffer: ArrayBuffer, loopCount: number) {
  const view = new DataView(buffer)
  let offset = 8

  while (offset + 12 <= view.byteLength) {
    const length = view.getUint32(offset)
    const type = readChunkType(view, offset + 4)
    const dataOffset = offset + 8

    if (
      type === "acTL" &&
      length >= 8 &&
      dataOffset + length <= view.byteLength
    ) {
      view.setUint32(dataOffset + 4, loopCount)

      const crcOffset = dataOffset + length

      if (crcOffset + 4 <= view.byteLength) {
        const crc = crc32(new Uint8Array(buffer, offset + 4, length + 4))
        view.setUint32(crcOffset, crc)
      }

      return buffer
    }

    offset = dataOffset + length + 4
  }

  return buffer
}

export { crc32, readChunkType, setApngLoop }
