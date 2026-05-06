import { createIpAddress, stringifyIpAddress } from "./ip-address"

type CoverableCidrRange = Readonly<{
  family: 4 | 6
  start: bigint
  end: bigint
}>

const BIT_SIZE_BY_FAMILY = {
  4: 32,
  6: 128,
} as const

function coverRange(range: CoverableCidrRange) {
  const bitSize = BIT_SIZE_BY_FAMILY[range.family]
  const cidrs: string[] = []
  let current = range.start

  while (current <= range.end) {
    const remaining = range.end - current + 1n
    const alignmentBits = countTrailingZeroBits(current, bitSize)
    const spanBits = floorLog2BigInt(remaining)
    const hostBits = Math.min(alignmentBits, spanBits)
    const prefix = bitSize - hostBits
    const blockSize = 1n << BigInt(hostBits)

    cidrs.push(`${stringifyRangeAddress(range.family, current)}/${prefix}`)
    current += blockSize
  }

  return cidrs
}

function stringifyRangeAddress(family: 4 | 6, value: bigint) {
  return stringifyIpAddress(createIpAddress(family, value))
}

function countTrailingZeroBits(value: bigint, maxBits: number) {
  if (value === 0n) {
    return maxBits
  }

  let bitCount = 0
  let current = value

  while (bitCount < maxBits && (current & 1n) === 0n) {
    bitCount += 1
    current >>= 1n
  }

  return bitCount
}

function floorLog2BigInt(value: bigint) {
  let result = 0
  let current = value

  while (current > 1n) {
    current >>= 1n
    result += 1
  }

  return result
}

export { coverRange }
