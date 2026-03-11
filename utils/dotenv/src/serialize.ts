import type { DotenvEntry, SerializeDotenvOptions } from './types'

export function maskDotenvValue(value: string): string {
  if (!value) return ''
  return '••••••'
}

export function toDotenvObject(
  entries: DotenvEntry[],
  options: SerializeDotenvOptions = {},
): Record<string, string> {
  const output: Record<string, string> = {}
  const maskValues = options.maskValues ?? false

  for (const entry of entries) {
    if (!entry.active) continue
    output[entry.key] = maskValues ? maskDotenvValue(entry.value) : entry.value
  }

  return output
}

export function serializeDotenv(
  entries: DotenvEntry[],
  options: SerializeDotenvOptions = {},
): string {
  const maskValues = options.maskValues ?? false

  return entries
    .filter((entry) => entry.active)
    .map((entry) => {
      const value = maskValues ? maskDotenvValue(entry.value) : entry.value
      return `${entry.key}=${formatDotenvValue(value, entry.quote)}`
    })
    .join('\n')
}

function formatDotenvValue(value: string, quote: DotenvEntry['quote']): string {
  if (quote === 'single') {
    return `'${value.replace(/'/g, "\\'")}'`
  }

  if (quote === 'double') {
    return `"${value
      .replace(/\\/g, '\\\\')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t')
      .replace(/"/g, '\\"')}"`
  }

  if (!value) return ''
  if (canUseBareValue(value)) return value

  return `"${value
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
    .replace(/"/g, '\\"')}"`
}

function canUseBareValue(value: string): boolean {
  return !/^\s|\s$|[\n\r\t"'#]/.test(value)
}
