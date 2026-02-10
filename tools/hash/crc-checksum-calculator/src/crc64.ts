const CRC64_WIDTH = 64
const CRC64_MASK = 0xffffffffffffffffn
const CRC64_TOP_BIT = 0x8000000000000000n

type CRC64Model = {
  name: string
  poly: bigint
  init: bigint
  refin: boolean
  refout: boolean
  xorout: bigint
  check: string
}

const reflectBits = (value: bigint, width: number): bigint => {
  let reflected = 0n
  for (let index = 0; index < width; index += 1) {
    const bit = (value >> BigInt(index)) & 1n
    reflected |= bit << BigInt(width - index - 1)
  }
  return reflected
}

const createTable = (poly: bigint, refin: boolean): bigint[] => {
  if (refin) {
    const reflectedPoly = reflectBits(poly, CRC64_WIDTH)
    return Array.from({ length: 256 }, (_, value) => {
      let crc = BigInt(value)
      for (let bit = 0; bit < 8; bit += 1) {
        if ((crc & 1n) === 1n) {
          crc = (crc >> 1n) ^ reflectedPoly
        } else {
          crc >>= 1n
        }
      }
      return crc & CRC64_MASK
    })
  }

  return Array.from({ length: 256 }, (_, value) => {
    let crc = BigInt(value) << 56n
    for (let bit = 0; bit < 8; bit += 1) {
      if ((crc & CRC64_TOP_BIT) !== 0n) {
        crc = ((crc << 1n) ^ poly) & CRC64_MASK
      } else {
        crc = (crc << 1n) & CRC64_MASK
      }
    }
    return crc
  })
}

const createCalculator = ({ poly, init, refin, refout, xorout }: CRC64Model) => {
  const table = createTable(poly, refin)

  return (bytes: Uint8Array): bigint => {
    let crc = init & CRC64_MASK

    if (refin) {
      for (const byte of bytes) {
        const tableIndex = Number((crc ^ BigInt(byte)) & 0xffn)
        crc = (crc >> 8n) ^ (table[tableIndex] ?? 0n)
      }
    } else {
      for (const byte of bytes) {
        const tableIndex = Number(((crc >> 56n) ^ BigInt(byte)) & 0xffn)
        crc = ((crc << 8n) & CRC64_MASK) ^ (table[tableIndex] ?? 0n)
      }
    }

    if (refin !== refout) {
      crc = reflectBits(crc, CRC64_WIDTH)
    }

    return (crc ^ xorout) & CRC64_MASK
  }
}

export const crc64Models = [
  {
    name: 'CRC64 ECMA-182',
    poly: 0x42f0e1eba9ea3693n,
    init: 0x0000000000000000n,
    refin: false,
    refout: false,
    xorout: 0x0000000000000000n,
    check: '6c40df5f0b497347',
  },
  {
    name: 'CRC64 GO-ISO',
    poly: 0x000000000000001bn,
    init: 0xffffffffffffffffn,
    refin: true,
    refout: true,
    xorout: 0xffffffffffffffffn,
    check: 'b90956c775a41001',
  },
  {
    name: 'CRC64 MS',
    poly: 0x259c84cba6426349n,
    init: 0xffffffffffffffffn,
    refin: true,
    refout: true,
    xorout: 0x0000000000000000n,
    check: '75d4b74f024eceea',
  },
  {
    name: 'CRC64 NVME',
    poly: 0xad93d23594c93659n,
    init: 0xffffffffffffffffn,
    refin: true,
    refout: true,
    xorout: 0xffffffffffffffffn,
    check: 'ae8b14860a799888',
  },
  {
    name: 'CRC64 REDIS',
    poly: 0xad93d23594c935a9n,
    init: 0x0000000000000000n,
    refin: true,
    refout: true,
    xorout: 0x0000000000000000n,
    check: 'e9c6d914c4b8d9ca',
  },
  {
    name: 'CRC64 WE',
    poly: 0x42f0e1eba9ea3693n,
    init: 0xffffffffffffffffn,
    refin: false,
    refout: false,
    xorout: 0xffffffffffffffffn,
    check: '62ec59e3f1a4f00a',
  },
  {
    name: 'CRC64 XZ',
    poly: 0x42f0e1eba9ea3693n,
    init: 0xffffffffffffffffn,
    refin: true,
    refout: true,
    xorout: 0xffffffffffffffffn,
    check: '995dc9bbdf1939fa',
  },
] as const satisfies readonly CRC64Model[]

export const crc64Calculators = crc64Models.map((model) => ({
  ...model,
  bits: 64,
  calculator: createCalculator(model),
}))
