import { CCError } from "curlconverter"

import { getTargetConfig } from "./targets"

type ConversionResult = Readonly<{
  output: string
  warnings: string[]
  error?: string
}>

const UNKNOWN_TARGET_ERROR = "Unsupported output language."
const FALLBACK_PARSE_ERROR = "Failed to parse cURL command."

function formatCurlWarnings(
  warnings: ReadonlyArray<readonly [string, string]>
) {
  return warnings.map(([code, message]) => `[${code}] ${message}`)
}

function convertCurlToTarget(
  curlCommand: string,
  targetId: string
): ConversionResult {
  const trimmed = curlCommand.trim()

  if (!trimmed) {
    return { output: "", warnings: [] }
  }

  const target = getTargetConfig(targetId)

  if (!target) {
    return {
      output: "",
      warnings: [],
      error: UNKNOWN_TARGET_ERROR,
    }
  }

  try {
    const [result, warnings] = target.convert(trimmed)
    const output =
      typeof result === "string" ? result : JSON.stringify(result, null, 2)
    const transformed = target.transform ? target.transform(output) : output

    return {
      output: transformed,
      warnings: formatCurlWarnings(warnings),
    }
  } catch (error) {
    const message =
      error instanceof CCError || error instanceof Error
        ? error.message
        : FALLBACK_PARSE_ERROR

    return {
      output: "",
      warnings: [],
      error: message,
    }
  }
}

export {
  FALLBACK_PARSE_ERROR,
  UNKNOWN_TARGET_ERROR,
  convertCurlToTarget,
  formatCurlWarnings,
}
export type { ConversionResult }
