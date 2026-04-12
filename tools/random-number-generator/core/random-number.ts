import type { HistoryEntry, NumberType, PresetOption } from "../types"

const DEFAULT_RANDOM_MIN = 1
const DEFAULT_RANDOM_MAX = 100
const DEFAULT_RANDOM_COUNT = 1
const DEFAULT_DECIMAL_PLACES = 2
const MAX_RANDOM_COUNT = 100
const MAX_DECIMAL_PLACES = 6
const MAX_HISTORY_ITEMS = 20

type RangeInfo = Readonly<{
  factor: number
  scaledMin: number
  scaledMax: number
  range: number
}>

type RandomNumberConfig = Readonly<{
  minValue: number | null
  maxValue: number | null
  count: number | null
  allowRepeat: boolean
  numberType: NumberType
  decimalPlaces: number | null
}>

type AddHistoryEntryOptions = Readonly<{
  createId?: () => string
}>

function normalizeRandomCount(value: number | null | undefined): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 1
  }

  return Math.min(Math.max(Math.floor(value), 1), MAX_RANDOM_COUNT)
}

function normalizeDecimalPlaces(value: number | null | undefined): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0
  }

  return Math.min(Math.max(Math.floor(value), 0), MAX_DECIMAL_PLACES)
}

function getInputPrecision(
  numberType: NumberType,
  decimalPlaces: number | null | undefined
) {
  return numberType === "decimal" ? normalizeDecimalPlaces(decimalPlaces) : 0
}

function getInputStep(
  numberType: NumberType,
  decimalPlaces: number | null | undefined
) {
  if (numberType !== "decimal") {
    return 1
  }

  return 1 / 10 ** normalizeDecimalPlaces(decimalPlaces)
}

function resolveRangeInfo(
  minValue: number | null,
  maxValue: number | null,
  numberType: NumberType,
  decimalPlaces: number | null | undefined
): RangeInfo | null {
  if (typeof minValue !== "number" || Number.isNaN(minValue)) {
    return null
  }

  if (typeof maxValue !== "number" || Number.isNaN(maxValue)) {
    return null
  }

  const normalizedPlaces = normalizeDecimalPlaces(decimalPlaces)
  const factor = numberType === "decimal" ? 10 ** normalizedPlaces : 1
  const scaledMin =
    numberType === "decimal"
      ? Math.ceil(minValue * factor)
      : Math.ceil(minValue)
  const scaledMax =
    numberType === "decimal"
      ? Math.floor(maxValue * factor)
      : Math.floor(maxValue)

  return {
    factor,
    scaledMin,
    scaledMax,
    range: scaledMax - scaledMin + 1,
  }
}

function hasRangeError(rangeInfo: RangeInfo | null) {
  return rangeInfo === null || rangeInfo.range <= 0
}

function hasCountError(
  rangeInfo: RangeInfo | null,
  allowRepeat: boolean,
  count: number | null | undefined
) {
  if (rangeInfo === null || allowRepeat) {
    return false
  }

  return normalizeRandomCount(count) > rangeInfo.range
}

function formatRandomNumber(
  value: number,
  numberType: NumberType,
  decimalPlaces: number | null | undefined
) {
  const normalizedValue = Object.is(value, -0) ? 0 : value

  if (numberType === "decimal") {
    return normalizedValue.toFixed(normalizeDecimalPlaces(decimalPlaces))
  }

  return String(normalizedValue)
}

function formatRandomNumbers(
  values: readonly number[],
  numberType: NumberType,
  decimalPlaces: number | null | undefined
) {
  return values.map((value) =>
    formatRandomNumber(value, numberType, decimalPlaces)
  )
}

function randomInt(min: number, max: number, randomFn: () => number) {
  return Math.floor(randomFn() * (max - min + 1)) + min
}

function generateRandomNumbers(
  config: RandomNumberConfig,
  randomFn: () => number = Math.random
) {
  const normalizedCount = normalizeRandomCount(config.count)
  const normalizedPlaces = normalizeDecimalPlaces(config.decimalPlaces)
  const rangeInfo = resolveRangeInfo(
    config.minValue,
    config.maxValue,
    config.numberType,
    normalizedPlaces
  )

  if (
    hasRangeError(rangeInfo) ||
    hasCountError(rangeInfo, config.allowRepeat, normalizedCount)
  ) {
    return []
  }

  const { factor, scaledMin, scaledMax } = rangeInfo as RangeInfo
  const results: number[] = []

  if (config.allowRepeat) {
    for (let index = 0; index < normalizedCount; index += 1) {
      results.push(randomInt(scaledMin, scaledMax, randomFn) / factor)
    }

    return results
  }

  const used = new Set<number>()

  while (results.length < normalizedCount) {
    const value = randomInt(scaledMin, scaledMax, randomFn)

    if (used.has(value)) {
      continue
    }

    used.add(value)
    results.push(value / factor)
  }

  return results
}

function createHistoryId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function addHistoryEntry(
  historyEntries: readonly HistoryEntry[],
  values: readonly string[],
  options: AddHistoryEntryOptions = {}
): HistoryEntry[] {
  if (values.length === 0) {
    return [...historyEntries]
  }

  const signature = values.join("|")
  const latest = historyEntries[0]

  if (latest && latest.values.join("|") === signature) {
    return [...historyEntries]
  }

  const entry = {
    id: (options.createId ?? createHistoryId)(),
    values: [...values],
  }

  return [entry, ...historyEntries].slice(0, MAX_HISTORY_ITEMS)
}

function applyPreset(preset: PresetOption) {
  switch (preset) {
    case "dice":
      return {
        minValue: 1,
        maxValue: 6,
        count: 1,
        allowRepeat: true,
        numberType: "integer",
      } as const
    case "ten":
      return {
        minValue: 1,
        maxValue: 10,
        count: 1,
        allowRepeat: true,
        numberType: "integer",
      } as const
    case "hundred":
      return {
        minValue: 1,
        maxValue: 100,
        count: 1,
        allowRepeat: true,
        numberType: "integer",
      } as const
    case "lotto":
      return {
        minValue: 1,
        maxValue: 49,
        count: 6,
        allowRepeat: false,
        numberType: "integer",
      } as const
  }
}

export {
  DEFAULT_DECIMAL_PLACES,
  DEFAULT_RANDOM_COUNT,
  DEFAULT_RANDOM_MAX,
  DEFAULT_RANDOM_MIN,
  MAX_HISTORY_ITEMS,
  addHistoryEntry,
  applyPreset,
  formatRandomNumber,
  formatRandomNumbers,
  generateRandomNumbers,
  getInputPrecision,
  getInputStep,
  hasCountError,
  hasRangeError,
  normalizeDecimalPlaces,
  normalizeRandomCount,
  resolveRangeInfo,
}
