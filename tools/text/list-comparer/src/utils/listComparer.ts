export const DEFAULT_CUSTOM_DELIMITER = '|'
export const DEFAULT_DELIMITER_MODE = 'newline'
export const DEFAULT_LIST_COMPARER_TAB = 'common'

const delimiterModes = ['newline', 'comma', 'tab', 'custom'] as const
const listComparerTabs = [
  'common',
  'left-only',
  'right-only',
  'all-unique',
  'left-duplicates',
  'right-duplicates',
] as const

export type DelimiterMode = 'newline' | 'comma' | 'tab' | 'custom'
export type ListComparerTab =
  | 'common'
  | 'left-only'
  | 'right-only'
  | 'all-unique'
  | 'left-duplicates'
  | 'right-duplicates'

export interface ListComparerOptions {
  delimiterMode: DelimiterMode
  customDelimiter: string
  trimItems: boolean
  ignoreCase: boolean
  omitEmptyItems: boolean
  sortResults: boolean
}

export interface DuplicateItem {
  value: string
  count: number
}

export interface ParsedListSummary {
  totalCount: number
  uniqueCount: number
  duplicateCount: number
  uniqueItems: string[]
  duplicateItems: DuplicateItem[]
}

export interface ListComparisonResult {
  left: ParsedListSummary
  right: ParsedListSummary
  commonItems: string[]
  leftOnlyItems: string[]
  rightOnlyItems: string[]
  unionItems: string[]
}

type ParsedListInternal = ParsedListSummary & {
  order: string[]
  displayByKey: Map<string, string>
  keySet: Set<string>
}

export function isDelimiterMode(value: string): value is DelimiterMode {
  return delimiterModes.includes(value as DelimiterMode)
}

export function normalizeDelimiterMode(value: string): DelimiterMode {
  return isDelimiterMode(value) ? value : DEFAULT_DELIMITER_MODE
}

export function isListComparerTab(value: string): value is ListComparerTab {
  return listComparerTabs.includes(value as ListComparerTab)
}

export function normalizeListComparerTab(value: string): ListComparerTab {
  return isListComparerTab(value) ? value : DEFAULT_LIST_COMPARER_TAB
}

export function splitListInput(
  input: string,
  delimiterMode: DelimiterMode | string,
  customDelimiter = DEFAULT_CUSTOM_DELIMITER,
): string[] {
  if (!input) {
    return []
  }

  switch (normalizeDelimiterMode(delimiterMode)) {
    case 'newline':
      return input.replace(/\r\n?/g, '\n').split('\n')
    case 'comma':
      return input.split(',')
    case 'tab':
      return input.split('\t')
    case 'custom':
      return customDelimiter ? input.split(customDelimiter) : [input]
  }
}

export function parseListInput(
  input: string,
  options: ListComparerOptions,
  locale = 'en',
): ParsedListSummary {
  return buildParsedList(input, options, locale)
}

export function compareLists(
  leftInput: string,
  rightInput: string,
  options: ListComparerOptions,
  locale = 'en',
): ListComparisonResult {
  const left = buildParsedList(leftInput, options, locale)
  const right = buildParsedList(rightInput, options, locale)
  const collator = createCollator(locale, options.ignoreCase)

  const commonItems = sortIfNeeded(
    left.order
      .filter((key) => right.keySet.has(key))
      .map((key) => left.displayByKey.get(key) ?? right.displayByKey.get(key) ?? ''),
    options.sortResults,
    collator,
  )

  const leftOnlyItems = sortIfNeeded(
    left.order
      .filter((key) => !right.keySet.has(key))
      .map((key) => left.displayByKey.get(key) ?? ''),
    options.sortResults,
    collator,
  )

  const rightOnlyItems = sortIfNeeded(
    right.order
      .filter((key) => !left.keySet.has(key))
      .map((key) => right.displayByKey.get(key) ?? ''),
    options.sortResults,
    collator,
  )

  const unionOrder = [...left.order, ...right.order.filter((key) => !left.keySet.has(key))]
  const unionItems = sortIfNeeded(
    unionOrder.map((key) => left.displayByKey.get(key) ?? right.displayByKey.get(key) ?? ''),
    options.sortResults,
    collator,
  )

  return {
    left,
    right,
    commonItems,
    leftOnlyItems,
    rightOnlyItems,
    unionItems,
  }
}

export function formatItemsForExport(items: string[]): string {
  return items.join('\n')
}

export function formatDuplicateItemsForExport(items: DuplicateItem[]): string {
  return items.map((item) => `${item.value}\t${item.count}`).join('\n')
}

function buildParsedList(
  input: string,
  options: ListComparerOptions,
  locale: string,
): ParsedListInternal {
  const values = splitListInput(input, options.delimiterMode, options.customDelimiter)
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
    order.map((key) => displayByKey.get(key) ?? ''),
    options.sortResults,
    collator,
  )
  const duplicateItems = sortDuplicateItems(
    order
      .filter((key) => (countsByKey.get(key) ?? 0) > 1)
      .map((key) => ({
        value: displayByKey.get(key) ?? '',
        count: countsByKey.get(key) ?? 0,
      })),
    options.sortResults,
    collator,
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

function normalizeValue(value: string, ignoreCase: boolean, locale: string): string {
  if (!ignoreCase) {
    return value
  }

  return value.toLocaleLowerCase(locale || undefined)
}

function createCollator(locale: string, ignoreCase: boolean): Intl.Collator {
  return new Intl.Collator(locale || undefined, {
    numeric: true,
    sensitivity: ignoreCase ? 'base' : 'variant',
  })
}

function sortIfNeeded<T extends string>(
  values: T[],
  shouldSort: boolean,
  collator: Intl.Collator,
): T[] {
  if (!shouldSort) {
    return values
  }

  return [...values].sort((left, right) => collator.compare(left, right))
}

function sortDuplicateItems(
  values: DuplicateItem[],
  shouldSort: boolean,
  collator: Intl.Collator,
): DuplicateItem[] {
  if (!shouldSort) {
    return values
  }

  return [...values].sort((left, right) => collator.compare(left.value, right.value))
}
