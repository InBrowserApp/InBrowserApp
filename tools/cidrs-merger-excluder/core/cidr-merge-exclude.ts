import { coverRange } from "./cidr-cover"
import { parseIpAddress } from "./ip-address"

type InputGroup = "merge" | "exclude"

type CidrInputError = Readonly<{
  group: InputGroup
  line: number
  value: string
}>

type CidrRange = Readonly<{
  family: 4 | 6
  start: bigint
  end: bigint
}>

type CidrMergeExcludeSuccess = Readonly<{
  status: "success"
  cidrs: readonly string[]
  mergeInputCount: number
  excludeInputCount: number
  familyLabels: readonly string[]
}>

type CidrMergeExcludeResult =
  | Readonly<{ status: "empty" }>
  | Readonly<{ status: "missing-merge" }>
  | Readonly<{ status: "invalid"; errors: readonly CidrInputError[] }>
  | CidrMergeExcludeSuccess

type ParsedCidrInput = Readonly<{
  ranges: readonly CidrRange[]
  errors: readonly CidrInputError[]
  count: number
}>

const BIT_SIZE_BY_FAMILY = {
  4: 32,
  6: 128,
} as const

function mergeAndExcludeCidrs(
  mergeInput: string,
  excludeInput: string
): CidrMergeExcludeResult {
  const merge = parseCidrInputList(mergeInput, "merge")
  const exclude = parseCidrInputList(excludeInput, "exclude")
  const errors = [...merge.errors, ...exclude.errors]

  if (errors.length > 0) {
    return { status: "invalid", errors }
  }

  if (merge.count === 0 && exclude.count === 0) {
    return { status: "empty" }
  }

  if (merge.count === 0) {
    return { status: "missing-merge" }
  }

  const mergeRanges = mergeRangesByFamily(merge.ranges)
  const excludeRanges = mergeRangesByFamily(exclude.ranges)
  const resultRanges = subtractRanges(mergeRanges, excludeRanges)
  const cidrs = resultRanges.flatMap((range) => coverRange(range))
  const familyLabels = resolveFamilyLabels(mergeRanges, excludeRanges, cidrs)

  return {
    status: "success",
    cidrs,
    mergeInputCount: merge.count,
    excludeInputCount: exclude.count,
    familyLabels,
  }
}

function parseCidrInputList(input: string, group: InputGroup): ParsedCidrInput {
  const ranges: CidrRange[] = []
  const errors: CidrInputError[] = []
  let count = 0

  input.split(/\r?\n/).forEach((line, lineIndex) => {
    for (const token of line.split(",")) {
      const value = token.trim()

      if (value.length === 0) {
        continue
      }

      count += 1

      const range = parseCidr(value)

      if (range === null) {
        errors.push({ group, line: lineIndex + 1, value })
        continue
      }

      ranges.push(range)
    }
  })

  return { ranges, errors, count }
}

function parseCidr(value: string): CidrRange | null {
  const separatorIndex = value.indexOf("/")

  if (separatorIndex <= 0 || separatorIndex !== value.lastIndexOf("/")) {
    return null
  }

  const address = parseIpAddress(value.slice(0, separatorIndex))
  const prefixText = value.slice(separatorIndex + 1)

  if (address === null || !/^\d+$/.test(prefixText)) {
    return null
  }

  const prefix = Number(prefixText)
  const bitSize = BIT_SIZE_BY_FAMILY[address.family]

  if (!Number.isInteger(prefix) || prefix < 0 || prefix > bitSize) {
    return null
  }

  const hostBits = bitSize - prefix
  const hostMask = hostBits === 0 ? 0n : (1n << BigInt(hostBits)) - 1n
  const maxValue = (1n << BigInt(bitSize)) - 1n
  const start = address.value & (maxValue ^ hostMask)

  return {
    family: address.family,
    start,
    end: start | hostMask,
  }
}

function mergeRangesByFamily(ranges: readonly CidrRange[]) {
  const sortedRanges = [...ranges].sort(compareRanges)
  const merged: CidrRange[] = []

  for (const range of sortedRanges) {
    const previous = merged.at(-1)

    if (
      previous === undefined ||
      previous.family !== range.family ||
      range.start > previous.end + 1n
    ) {
      merged.push(range)
      continue
    }

    if (range.end > previous.end) {
      merged[merged.length - 1] = { ...previous, end: range.end }
    }
  }

  return merged
}

function compareRanges(first: CidrRange, second: CidrRange) {
  if (first.family !== second.family) {
    return first.family - second.family
  }

  if (first.start < second.start) {
    return -1
  }

  if (first.start > second.start) {
    return 1
  }

  if (first.end < second.end) {
    return -1
  }

  if (first.end > second.end) {
    return 1
  }

  return 0
}

function subtractRanges(
  mergeRanges: readonly CidrRange[],
  excludeRanges: readonly CidrRange[]
) {
  const result: CidrRange[] = []

  for (const range of mergeRanges) {
    let cursor = range.start

    for (const excluded of excludeRanges) {
      if (excluded.family !== range.family || excluded.end < cursor) {
        continue
      }

      if (excluded.start > range.end) {
        break
      }

      if (excluded.start > cursor) {
        result.push({
          family: range.family,
          start: cursor,
          end: excluded.start - 1n,
        })
      }

      if (excluded.end >= range.end) {
        cursor = range.end + 1n
        break
      }

      cursor = excluded.end + 1n
    }

    if (cursor <= range.end) {
      result.push({ family: range.family, start: cursor, end: range.end })
    }
  }

  return result
}

function resolveFamilyLabels(
  mergeRanges: readonly CidrRange[],
  excludeRanges: readonly CidrRange[],
  cidrs: readonly string[]
) {
  const families = new Set(
    [...mergeRanges, ...excludeRanges].map((range) => range.family)
  )

  if (cidrs.length === 0) {
    return [...families].sort().map((family) => `IPv${family}`)
  }

  return [...new Set(cidrs.map((cidr) => (cidr.includes(":") ? 6 : 4)))]
    .sort((first, second) => first - second)
    .map((family) => `IPv${family}`)
}

export { mergeAndExcludeCidrs }
export type { CidrInputError, CidrMergeExcludeResult }
