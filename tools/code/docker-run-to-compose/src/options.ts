import type { ParsedRun } from './types'
import { parseLongOption } from './long-options'
import { parseShortOptions } from './short-options'

export function parseOption(
  tokens: string[],
  index: number,
  data: ParsedRun,
  warnings: string[],
): number {
  const token = tokens[index]
  if (!token) {
    return index + 1
  }
  if (token.startsWith('--')) {
    return parseLongOption(tokens, index, data, warnings)
  }
  return parseShortOptions(tokens, index, data, warnings)
}
