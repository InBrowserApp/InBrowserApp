const DELIMITER_MODES = ["newline", "comma", "tab", "custom"] as const
const RESULT_KEYS = [
  "shared",
  "left-only",
  "right-only",
  "all-unique",
  "left-duplicates",
  "right-duplicates",
] as const

type DelimiterMode = (typeof DELIMITER_MODES)[number]
type ListResultKey = (typeof RESULT_KEYS)[number]

type ListComparerOptions = Readonly<{
  delimiterMode: DelimiterMode
  customDelimiter: string
  trimItems: boolean
  ignoreCase: boolean
  omitEmptyItems: boolean
  sortResults: boolean
}>

type DuplicateItem = Readonly<{
  value: string
  count: number
}>

type ParsedListSummary = Readonly<{
  totalCount: number
  uniqueCount: number
  duplicateCount: number
  uniqueItems: readonly string[]
  duplicateItems: readonly DuplicateItem[]
}>

type ListComparisonResult = Readonly<{
  left: ParsedListSummary
  right: ParsedListSummary
  sharedItems: readonly string[]
  leftOnlyItems: readonly string[]
  rightOnlyItems: readonly string[]
  allUniqueItems: readonly string[]
}>

type ParsedListInternal = ParsedListSummary & {
  order: readonly string[]
  displayByKey: ReadonlyMap<string, string>
  keySet: ReadonlySet<string>
}

function isDelimiterMode(value: string): value is DelimiterMode {
  return DELIMITER_MODES.includes(value as DelimiterMode)
}

function normalizeDelimiterMode(value: string): DelimiterMode {
  return isDelimiterMode(value) ? value : "newline"
}

function isListResultKey(value: string): value is ListResultKey {
  return RESULT_KEYS.includes(value as ListResultKey)
}

function normalizeResultKey(value: string): ListResultKey {
  return isListResultKey(value) ? value : "shared"
}

function splitListInput(
  input: string,
  delimiterMode: DelimiterMode | string,
  customDelimiter = "|"
) {
  if (!input) {
    return []
  }

  switch (normalizeDelimiterMode(delimiterMode)) {
    case "newline":
      return input.replace(/\r\n?/g, "\n").split("\n")
    case "comma":
      return input.split(",")
    case "tab":
      return input.split("\t")
    case "custom":
      return customDelimiter ? input.split(customDelimiter) : [input]
  }
}

function compareLists(
  leftInput: string,
  rightInput: string,
  options: ListComparerOptions,
  locale = "en"
): ListComparisonResult {
  const left = buildParsedList(leftInput, options, locale)
  const right = buildParsedList(rightInput, options, locale)
  const collator = createCollator(locale, options.ignoreCase)

  const sharedItems = sortIfNeeded(
    left.order
      .filter((key) => right.keySet.has(key))
      .map(
        (key) => left.displayByKey.get(key) ?? right.displayByKey.get(key) ?? ""
      ),
    options.sortResults,
    collator
  )

  const leftOnlyItems = sortIfNeeded(
    left.order
      .filter((key) => !right.keySet.has(key))
      .map((key) => left.displayByKey.get(key) ?? ""),
    options.sortResults,
    collator
  )

  const rightOnlyItems = sortIfNeeded(
    right.order
      .filter((key) => !left.keySet.has(key))
      .map((key) => right.displayByKey.get(key) ?? ""),
    options.sortResults,
    collator
  )

  const unionOrder = [
    ...left.order,
    ...right.order.filter((key) => !left.keySet.has(key)),
  ]
  const allUniqueItems = sortIfNeeded(
    unionOrder.map(
      (key) => left.displayByKey.get(key) ?? right.displayByKey.get(key) ?? ""
    ),
    options.sortResults,
    collator
  )

  return {
    left: toParsedListSummary(left),
    right: toParsedListSummary(right),
    sharedItems,
    leftOnlyItems,
    rightOnlyItems,
    allUniqueItems,
  }
}

function formatItemsForExport(items: readonly string[]) {
  return items.join("\n")
}

function formatDuplicateItemsForExport(items: readonly DuplicateItem[]) {
  return items.map((item) => `${item.value}\t${item.count}`).join("\n")
}

function buildParsedList(
  input: string,
  options: ListComparerOptions,
  locale: string
): ParsedListInternal {
  const values = splitListInput(
    input,
    options.delimiterMode,
    options.customDelimiter
  )
    .map((value) => (options.trimItems ? value.trim() : value))
    .filter((value) => (options.omitEmptyItems ? value.length > 0 : true))

  const displayByKey = new Map<string, string>()
  const countsByKey = new Map<string, number>()
  const order: string[] = []

  for (const value of values) {
    const key = normalizeValue(value, options.ignoreCase, locale)

    if (!displayByKey.has(key)) {
      displayByKey.set(key, value)
      order.push(key)
    }

    countsByKey.set(key, (countsByKey.get(key) ?? 0) + 1)
  }

  const collator = createCollator(locale, options.ignoreCase)
  const uniqueItems = sortIfNeeded(
    order.map((key) => displayByKey.get(key) ?? ""),
    options.sortResults,
    collator
  )
  const duplicateItems = sortDuplicateItems(
    order
      .filter((key) => (countsByKey.get(key) ?? 0) > 1)
      .map((key) => ({
        value: displayByKey.get(key) ?? "",
        count: countsByKey.get(key) ?? 0,
      })),
    options.sortResults,
    collator
  )

  return {
    totalCount: values.length,
    uniqueCount: order.length,
    duplicateCount: Math.max(0, values.length - order.length),
    uniqueItems,
    duplicateItems,
    order,
    displayByKey,
    keySet: new Set(order),
  }
}

function toParsedListSummary(parsed: ParsedListInternal): ParsedListSummary {
  return {
    totalCount: parsed.totalCount,
    uniqueCount: parsed.uniqueCount,
    duplicateCount: parsed.duplicateCount,
    uniqueItems: parsed.uniqueItems,
    duplicateItems: parsed.duplicateItems,
  }
}

function normalizeValue(value: string, ignoreCase: boolean, locale: string) {
  if (!ignoreCase) {
    return value
  }

  return value.toLocaleLowerCase(locale || undefined)
}

function createCollator(locale: string, ignoreCase: boolean) {
  return new Intl.Collator(locale || undefined, {
    numeric: true,
    sensitivity: ignoreCase ? "base" : "variant",
  })
}

function sortIfNeeded<T extends string>(
  values: readonly T[],
  shouldSort: boolean,
  collator: Intl.Collator
) {
  if (!shouldSort) {
    return [...values]
  }

  return [...values].sort((left, right) => collator.compare(left, right))
}

function sortDuplicateItems(
  values: readonly DuplicateItem[],
  shouldSort: boolean,
  collator: Intl.Collator
) {
  if (!shouldSort) {
    return [...values]
  }

  return [...values].sort((left, right) =>
    collator.compare(left.value, right.value)
  )
}

export type {
  DelimiterMode,
  ListComparerOptions,
  ListComparisonResult,
  ListResultKey,
  ParsedListSummary,
}
export {
  DELIMITER_MODES,
  RESULT_KEYS,
  compareLists,
  formatDuplicateItemsForExport,
  formatItemsForExport,
  normalizeDelimiterMode,
  normalizeResultKey,
  splitListInput,
}
