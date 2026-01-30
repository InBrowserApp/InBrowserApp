import type { Token } from './types'

export function splitInputIntoBlocks(input: string): string[] {
  const lines = input.replace(/\r\n/g, '\n').split('\n')
  const blocks: string[] = []
  let buffer = ''

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      if (buffer) {
        blocks.push(buffer.trim())
        buffer = ''
      }
      continue
    }
    if (trimmed.startsWith('#')) {
      continue
    }
    if (trimmed.endsWith('\\')) {
      buffer += trimmed.slice(0, -1).trimEnd() + ' '
    } else {
      buffer += trimmed + ' '
    }
  }

  if (buffer.trim()) {
    blocks.push(buffer.trim())
  }

  return blocks
}

export function tokenize(input: string): { tokens: Token[]; error?: string } {
  const tokens: Token[] = []
  let current = ''
  let inSingle = false
  let inDouble = false
  let escape = false

  const flush = () => {
    if (current) {
      tokens.push({ type: 'word', value: current })
      current = ''
    }
  }

  for (let i = 0; i < input.length; i += 1) {
    const char = input.charAt(i)

    if (escape) {
      current += char
      escape = false
      continue
    }

    if (char === '\\' && !inSingle) {
      escape = true
      continue
    }

    if (char === "'" && !inDouble) {
      inSingle = !inSingle
      continue
    }

    if (char === '"' && !inSingle) {
      inDouble = !inDouble
      continue
    }

    if (!inSingle && !inDouble) {
      if (isWhitespace(char)) {
        flush()
        continue
      }

      if (char === '&' || char === '|' || char === ';') {
        flush()
        let op = char
        if ((char === '&' || char === '|') && input.charAt(i + 1) === char) {
          op = char + char
          i += 1
        }
        tokens.push({ type: 'op', value: op })
        continue
      }
    }

    current += char
  }

  if (escape) {
    current += '\\'
  }

  if (inSingle || inDouble) {
    return { tokens, error: 'Unclosed quote detected in docker run input.' }
  }

  flush()

  return { tokens }
}

export function splitCommands(tokens: Token[]): { commands: string[][]; operators: string[] } {
  const commands: string[][] = []
  const operators: string[] = []
  let current: string[] = []

  for (const token of tokens) {
    if (token.type === 'op') {
      if (current.length) {
        commands.push(current)
        current = []
      }
      operators.push(token.value)
      continue
    }
    current.push(token.value)
  }

  if (current.length) {
    commands.push(current)
  }

  return { commands, operators }
}

function isWhitespace(char: string): boolean {
  return /\s/.test(char)
}
