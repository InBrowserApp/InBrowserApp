import { CCError, type Warnings } from 'curlconverter'
import { getTargetConfig } from './targets'

type ConversionResult = {
  output: string
  warnings: string[]
  error?: string
}

const unknownTargetError = 'Unsupported output language.'

export function convertCurlToTarget(curlCommand: string, targetId: string): ConversionResult {
  const trimmed = curlCommand.trim()
  if (!trimmed) {
    return { output: '', warnings: [] }
  }

  const target = getTargetConfig(targetId)
  if (!target) {
    return { output: '', warnings: [], error: unknownTargetError }
  }

  try {
    const [result, warnings] = target.convert(trimmed)
    const output = typeof result === 'string' ? result : JSON.stringify(result, null, 2)
    const transformed = target.transform ? target.transform(output) : output

    return {
      output: transformed,
      warnings: formatCurlWarnings(warnings),
    }
  } catch (error) {
    const message =
      error instanceof CCError || error instanceof Error
        ? error.message
        : 'Failed to parse cURL command.'
    return {
      output: '',
      warnings: [],
      error: message,
    }
  }
}

function formatCurlWarnings(warnings: Warnings): string[] {
  return warnings.map(([code, message]) => `[${code}] ${message}`)
}
