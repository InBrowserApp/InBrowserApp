import { longOptionHandlers } from "./long-option-actions"
import {
  handleUnsupportedLongOption,
  splitLongOptionFlag,
} from "./long-option-utils"
import type { ParsedRun } from "./types"

export function parseLongOption(
  tokens: string[],
  index: number,
  data: ParsedRun,
  warnings: string[]
): number {
  const token = tokens[index]
  if (!token) {
    return index + 1
  }

  const [flag, inlineValue] = splitLongOptionFlag(token)
  const handler = longOptionHandlers[flag]

  if (handler) {
    return handler({ tokens, index, flag, inlineValue, data, warnings })
  }

  return handleUnsupportedLongOption({
    tokens,
    index,
    flag,
    inlineValue,
    data,
    warnings,
  })
}
