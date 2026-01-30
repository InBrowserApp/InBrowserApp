import type { ParsedRun } from './types'
import { consumeValue } from './option-utils'

export function parseShortOptions(
  tokens: string[],
  index: number,
  data: ParsedRun,
  warnings: string[],
): number {
  const token = tokens[index]
  if (!token) {
    return index + 1
  }
  const short = token.slice(1)

  if (short.length > 1 && short.split('').every((char) => isShortFlag(char))) {
    for (const char of short.split('')) {
      applyShortFlag(char, data, warnings)
    }
    return index + 1
  }

  const option = short[0]
  const inlineValue = short.length > 1 ? short.slice(1) : undefined

  switch (option) {
    case 'p': {
      const result = consumeValue(tokens, index, inlineValue)
      if (result.value) {
        data.ports.push(result.value)
      } else {
        warnings.push('Missing value for -p.')
      }
      return result.nextIndex
    }
    case 'P': {
      warnings.push('Publish-all (-P) is not supported in Compose.')
      return index + 1
    }
    case 'e': {
      const result = consumeValue(tokens, index, inlineValue)
      if (result.value) {
        data.environment.push(result.value)
      } else {
        warnings.push('Missing value for -e.')
      }
      return result.nextIndex
    }
    case 'v': {
      const result = consumeValue(tokens, index, inlineValue)
      if (result.value) {
        data.volumes.push(result.value)
      } else {
        warnings.push('Missing value for -v.')
      }
      return result.nextIndex
    }
    case 'w': {
      const result = consumeValue(tokens, index, inlineValue)
      if (result.value) {
        data.workdir = result.value
      } else {
        warnings.push('Missing value for -w.')
      }
      return result.nextIndex
    }
    case 'u': {
      const result = consumeValue(tokens, index, inlineValue)
      if (result.value) {
        data.user = result.value
      } else {
        warnings.push('Missing value for -u.')
      }
      return result.nextIndex
    }
    case 'm': {
      const result = consumeValue(tokens, index, inlineValue)
      if (result.value) {
        data.memory = result.value
      } else {
        warnings.push('Missing value for -m.')
      }
      return result.nextIndex
    }
    case 'i':
    case 't':
    case 'd': {
      applyShortFlag(option, data, warnings)
      return index + 1
    }
    default: {
      if (inlineValue) {
        warnings.push(`Unsupported short flag -${option} was ignored with value ${inlineValue}.`)
        return index + 1
      }
      warnings.push(`Unsupported short flag -${option} was ignored.`)
      return index + 1
    }
  }
}

function isShortFlag(char: string): boolean {
  return ['i', 't', 'd'].includes(char)
}

function applyShortFlag(char: string, data: ParsedRun, warnings: string[]): void {
  if (char === 'i') {
    data.stdinOpen = true
    return
  }
  if (char === 't') {
    data.tty = true
    return
  }
  if (char === 'd') {
    warnings.push('Detach mode (-d) is ignored in Compose.')
  }
}
