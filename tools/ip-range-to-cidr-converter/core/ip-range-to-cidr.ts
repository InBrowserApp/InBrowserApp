import { parseIpAddress, stringifyIpAddress } from "./ip-address"

import type { ParsedIpAddress } from "./ip-address"

type IpRangeToCidrsResult =
  | Readonly<{ status: "empty" }>
  | Readonly<{ status: "incomplete" }>
  | Readonly<{ status: "invalid" }>
  | Readonly<{ status: "mixed-family" }>
  | Readonly<{ status: "reversed" }>
  | Readonly<{
      status: "success"
      family: 4 | 6
      start: string
      end: string
      cidrs: readonly string[]
    }>

function convertIpRangeToCidrs(
  startInput: string,
  endInput: string
): IpRangeToCidrsResult {
  const startValue = startInput.trim()
  const endValue = endInput.trim()

  if (startValue.length === 0 && endValue.length === 0) {
    return { status: "empty" }
  }

  if (startValue.length === 0 || endValue.length === 0) {
    return { status: "incomplete" }
  }

  const start = parseIpAddress(startValue)
  const end = parseIpAddress(endValue)

  if (start === null || end === null) {
    return { status: "invalid" }
  }

  if (start.family !== end.family) {
    return { status: "mixed-family" }
  }

  if (start.value > end.value) {
    return { status: "reversed" }
  }

  return {
    status: "success",
    family: start.family,
    start: stringifyIpAddress(start),
    end: stringifyIpAddress(end),
    cidrs: coverIpRange(start, end),
  }
}

function coverIpRange(start: ParsedIpAddress, end: ParsedIpAddress) {
  const bits = start.family === 4 ? 32 : 128
  const cidrs: string[] = []
  let current = start.value

  while (current <= end.value) {
    const remaining = end.value - current + 1n
    const alignmentBits = countTrailingZeroBits(current, bits)
    const spanBits = floorLog2BigInt(remaining)
    const hostBits = Math.min(alignmentBits, spanBits)
    const prefix = bits - hostBits
    const blockSize = 1n << BigInt(hostBits)

    cidrs.push(`${stringifyRangeAddress(start.family, current)}/${prefix}`)
    current += blockSize
  }

  return cidrs
}

function stringifyRangeAddress(family: 4 | 6, value: bigint) {
  if (family === 4) {
    const segments = Array.from({ length: 4 }, (_, index) => {
      const shift = BigInt(8 * (3 - index))
      return Number((value >> shift) & 0xffn)
    }) as [number, number, number, number]

    return stringifyIpAddress({ family, segments, value })
  }

  const segments = Array.from({ length: 8 }, (_, index) => {
    const shift = BigInt(16 * (7 - index))
    return Number((value >> shift) & 0xffffn)
  })

  return stringifyIpAddress({ family, segments, value })
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

export { convertIpRangeToCidrs, coverIpRange }
export type { IpRangeToCidrsResult }
