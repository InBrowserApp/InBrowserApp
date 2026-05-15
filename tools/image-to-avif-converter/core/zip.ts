type ZipEntry = Readonly<{
  data: Uint8Array
  name: string
}>

type PreparedZipEntry = ZipEntry &
  Readonly<{
    crc: number
    localHeaderOffset: number
    nameBytes: Uint8Array
  }>

const ZIP_MIME_TYPE = "application/zip"
const UINT16_MAX = 0xffff
const UINT32_MAX = 0xffffffff
const UTF8_FLAG = 0x0800
const STORE_METHOD = 0
const VERSION_NEEDED = 20

const crcTable = new Uint32Array(256)

for (let index = 0; index < crcTable.length; index += 1) {
  let value = index

  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1
  }

  crcTable[index] = value >>> 0
}

function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff

  for (const byte of bytes) {
    crc = crcTable[(crc ^ byte) & 0xff]! ^ (crc >>> 8)
  }

  return (crc ^ 0xffffffff) >>> 0
}

function sanitizeZipEntryName(name: string) {
  const safeName = name.replace(/[/\\]+/g, "_").trim()

  return safeName || "image.avif"
}

function assertZipEntryLimits(entries: readonly ZipEntry[]) {
  if (entries.length > UINT16_MAX) {
    throw new Error("ZIP_TOO_MANY_ENTRIES")
  }
}

function assertUint32(value: number, errorCode: string) {
  if (value > UINT32_MAX) {
    throw new Error(errorCode)
  }
}

function writeUint16(view: DataView, offset: number, value: number) {
  view.setUint16(offset, value, true)
}

function writeUint32(view: DataView, offset: number, value: number) {
  view.setUint32(offset, value, true)
}

function prepareEntries(entries: readonly ZipEntry[]) {
  assertZipEntryLimits(entries)

  const encoder = new TextEncoder()
  let localHeaderOffset = 0

  return entries.map((entry) => {
    assertUint32(entry.data.byteLength, "ZIP_ENTRY_TOO_LARGE")

    const nameBytes = encoder.encode(sanitizeZipEntryName(entry.name))

    if (nameBytes.byteLength > UINT16_MAX) {
      throw new Error("ZIP_ENTRY_NAME_TOO_LONG")
    }

    const prepared = {
      ...entry,
      crc: crc32(entry.data),
      localHeaderOffset,
      nameBytes,
    }

    localHeaderOffset += 30 + nameBytes.byteLength + entry.data.byteLength
    assertUint32(localHeaderOffset, "ZIP_TOO_LARGE")

    return prepared
  })
}

function writeLocalHeader(
  output: Uint8Array,
  view: DataView,
  offset: number,
  entry: PreparedZipEntry
) {
  writeUint32(view, offset, 0x04034b50)
  writeUint16(view, offset + 4, VERSION_NEEDED)
  writeUint16(view, offset + 6, UTF8_FLAG)
  writeUint16(view, offset + 8, STORE_METHOD)
  writeUint16(view, offset + 10, 0)
  writeUint16(view, offset + 12, 0)
  writeUint32(view, offset + 14, entry.crc)
  writeUint32(view, offset + 18, entry.data.byteLength)
  writeUint32(view, offset + 22, entry.data.byteLength)
  writeUint16(view, offset + 26, entry.nameBytes.byteLength)
  writeUint16(view, offset + 28, 0)
  output.set(entry.nameBytes, offset + 30)
  output.set(entry.data, offset + 30 + entry.nameBytes.byteLength)
}

function writeCentralDirectoryHeader(
  output: Uint8Array,
  view: DataView,
  offset: number,
  entry: PreparedZipEntry
) {
  writeUint32(view, offset, 0x02014b50)
  writeUint16(view, offset + 4, VERSION_NEEDED)
  writeUint16(view, offset + 6, VERSION_NEEDED)
  writeUint16(view, offset + 8, UTF8_FLAG)
  writeUint16(view, offset + 10, STORE_METHOD)
  writeUint16(view, offset + 12, 0)
  writeUint16(view, offset + 14, 0)
  writeUint32(view, offset + 16, entry.crc)
  writeUint32(view, offset + 20, entry.data.byteLength)
  writeUint32(view, offset + 24, entry.data.byteLength)
  writeUint16(view, offset + 28, entry.nameBytes.byteLength)
  writeUint16(view, offset + 30, 0)
  writeUint16(view, offset + 32, 0)
  writeUint16(view, offset + 34, 0)
  writeUint16(view, offset + 36, 0)
  writeUint32(view, offset + 38, 0)
  writeUint32(view, offset + 42, entry.localHeaderOffset)
  output.set(entry.nameBytes, offset + 46)
}

function createStoredZipBytes(entries: readonly ZipEntry[]) {
  const preparedEntries = prepareEntries(entries)
  const localBytes = preparedEntries.reduce(
    (total, entry) =>
      total + 30 + entry.nameBytes.byteLength + entry.data.length,
    0
  )
  const centralDirectoryBytes = preparedEntries.reduce(
    (total, entry) => total + 46 + entry.nameBytes.byteLength,
    0
  )
  const endOffset = localBytes + centralDirectoryBytes + 22

  assertUint32(localBytes, "ZIP_TOO_LARGE")
  assertUint32(centralDirectoryBytes, "ZIP_TOO_LARGE")
  assertUint32(endOffset, "ZIP_TOO_LARGE")

  const output = new Uint8Array(endOffset)
  const view = new DataView(output.buffer)
  let offset = 0

  for (const entry of preparedEntries) {
    writeLocalHeader(output, view, offset, entry)
    offset += 30 + entry.nameBytes.byteLength + entry.data.length
  }

  const centralDirectoryOffset = offset

  for (const entry of preparedEntries) {
    writeCentralDirectoryHeader(output, view, offset, entry)
    offset += 46 + entry.nameBytes.byteLength
  }

  writeUint32(view, offset, 0x06054b50)
  writeUint16(view, offset + 4, 0)
  writeUint16(view, offset + 6, 0)
  writeUint16(view, offset + 8, preparedEntries.length)
  writeUint16(view, offset + 10, preparedEntries.length)
  writeUint32(view, offset + 12, centralDirectoryBytes)
  writeUint32(view, offset + 16, centralDirectoryOffset)
  writeUint16(view, offset + 20, 0)

  return output
}

function createStoredZip(entries: readonly ZipEntry[]) {
  return new Blob([createStoredZipBytes(entries)], { type: ZIP_MIME_TYPE })
}

export { ZIP_MIME_TYPE, createStoredZip, createStoredZipBytes, crc32 }
