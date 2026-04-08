import type { ParsedRun } from "./types"

type LongOptionContext = {
  tokens: string[]
  index: number
  flag: string
  inlineValue?: string
  data: ParsedRun
  warnings: string[]
}

type LongOptionHandler = (context: LongOptionContext) => number

function handleUnsupportedLongOption(context: LongOptionContext): number {
  const { flag, index, inlineValue, tokens, warnings } = context

  if (inlineValue) {
    warnings.push(`Unsupported flag ${flag} was ignored.`)
    return index + 1
  }

  const nextValue = tokens[index + 1]
  if (nextValue && !nextValue.startsWith("-")) {
    warnings.push(
      `Unsupported flag ${flag} was ignored with value ${nextValue}.`
    )
    return index + 2
  }

  warnings.push(`Unsupported flag ${flag} was ignored.`)
  return index + 1
}

function splitLongOptionFlag(flag: string): [string, string | undefined] {
  const splitIndex = flag.indexOf("=")
  if (splitIndex === -1) {
    return [flag, undefined]
  }
  return [flag.slice(0, splitIndex), flag.slice(splitIndex + 1)]
}

export { handleUnsupportedLongOption, splitLongOptionFlag }
export type { LongOptionHandler }
