import { CRC_MODELS, type CrcModel, type CrcWidthGroup } from "./models"

type CrcResult = Readonly<{
  id: string
  name: string
  width: CrcWidthGroup
  hex: string
}>

const tableCache = new Map<string, readonly bigint[]>()

async function calculateCrcChecksums(source: Blob) {
  const bytes = new Uint8Array(await source.arrayBuffer())

  return calculateCrcChecksumsForBytes(bytes)
}

function calculateCrcChecksumsForBytes(bytes: Uint8Array) {
  return [
    calculateCrc1(bytes),
    ...CRC_MODELS.map((model) => ({
      id: model.id,
      name: model.name,
      width: model.width,
      hex: formatCrcValue(calculateCrc(bytes, model), model.width),
    })),
  ] as readonly CrcResult[]
}

function calculateCrc(bytes: Uint8Array, model: CrcModel) {
  const width = Number(model.width)
  const mask = maskForWidth(width)
  const table = getTable(model)
  let crc = model.initial & mask

  if (model.reflectInput) {
    for (const byte of bytes) {
      const tableIndex = Number((crc ^ BigInt(byte)) & 0xffn)
      crc = (crc >> 8n) ^ table[tableIndex]!
    }
  } else {
    const shift = BigInt(width - 8)

    for (const byte of bytes) {
      const tableIndex = Number(((crc >> shift) ^ BigInt(byte)) & 0xffn)
      crc = ((crc << 8n) & mask) ^ table[tableIndex]!
    }
  }

  if (model.reflectInput !== model.reflectOutput) {
    crc = reflectBits(crc, width)
  }

  return (crc ^ model.xorOutput) & mask
}

function calculateCrc1(bytes: Uint8Array): CrcResult {
  let sum = 0

  for (const byte of bytes) {
    sum += byte
  }

  return {
    id: "crc1",
    name: "CRC1",
    width: "1",
    hex: String(sum % 2),
  }
}

function getTable(model: CrcModel) {
  const cachedTable = tableCache.get(model.id)

  if (cachedTable) {
    return cachedTable
  }

  const table = createTable(model)
  tableCache.set(model.id, table)
  return table
}

function createTable(model: CrcModel) {
  const width = Number(model.width)
  const mask = maskForWidth(width)

  if (model.reflectInput) {
    const reflectedPolynomial = reflectBits(model.polynomial, width)

    return Array.from({ length: 256 }, (_, value) => {
      let crc = BigInt(value)

      for (let bit = 0; bit < 8; bit += 1) {
        crc = (crc & 1n) === 1n ? (crc >> 1n) ^ reflectedPolynomial : crc >> 1n
      }

      return crc & mask
    })
  }

  const topBit = 1n << BigInt(width - 1)
  const shift = BigInt(width - 8)

  return Array.from({ length: 256 }, (_, value) => {
    let crc = BigInt(value) << shift

    for (let bit = 0; bit < 8; bit += 1) {
      crc =
        (crc & topBit) !== 0n
          ? ((crc << 1n) ^ model.polynomial) & mask
          : (crc << 1n) & mask
    }

    return crc
  })
}

function reflectBits(value: bigint, width: number) {
  let reflected = 0n

  for (let index = 0; index < width; index += 1) {
    reflected |= ((value >> BigInt(index)) & 1n) << BigInt(width - index - 1)
  }

  return reflected
}

function formatCrcValue(value: bigint, width: CrcWidthGroup) {
  return value.toString(16).padStart(Math.ceil(Number(width) / 4), "0")
}

function maskForWidth(width: number) {
  return (1n << BigInt(width)) - 1n
}

export {
  CRC_MODELS,
  calculateCrc,
  calculateCrcChecksums,
  calculateCrcChecksumsForBytes,
  formatCrcValue,
}
export type { CrcModel, CrcResult, CrcWidthGroup }
