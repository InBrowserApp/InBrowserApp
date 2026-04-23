import type { Warnings } from "curlconverter"

import { getTargetConfig, type CurlConverterRuntimeKey } from "./targets"

export type ConversionResult = Readonly<{
  output: string
  warnings: string[]
  error?: string
}>

const UNKNOWN_TARGET_ERROR = "Unsupported output language."
const FALLBACK_PARSE_ERROR = "Failed to parse cURL command."

type CurlConverterModule = typeof import("curlconverter")
type CurlTargetConverter = (curlCommand: string) => [unknown, Warnings]

let curlConverterModulePromise: Promise<CurlConverterModule> | undefined

function formatCurlWarnings(
  warnings: ReadonlyArray<readonly [string, string]>
) {
  return warnings.map(([code, message]) => `[${code}] ${message}`)
}

function isCurlTargetConverter(value: unknown): value is CurlTargetConverter {
  return typeof value === "function"
}

async function loadCurlConverterModule() {
  curlConverterModulePromise ??= import("curlconverter")
  return curlConverterModulePromise
}

async function resolveConverter(runtimeKey: CurlConverterRuntimeKey) {
  const module = await loadCurlConverterModule()

  if (!(runtimeKey in module)) {
    return undefined
  }

  const convert = module[runtimeKey as keyof CurlConverterModule]
  return isCurlTargetConverter(convert) ? convert : undefined
}

async function convertCurlToTarget(
  curlCommand: string,
  targetId: string
): Promise<ConversionResult> {
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
    const convert = await resolveConverter(target.runtimeKey)

    if (!convert) {
      return {
        output: "",
        warnings: [],
        error: UNKNOWN_TARGET_ERROR,
      }
    }

    const [result, warnings] = convert(trimmed)
    const output =
      typeof result === "string" ? result : JSON.stringify(result, null, 2)
    const transformed = target.transform ? target.transform(output) : output

    return {
      output: transformed,
      warnings: formatCurlWarnings(warnings),
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : FALLBACK_PARSE_ERROR

    return {
      output: "",
      warnings: [],
      error: message,
    }
  }
}

export { FALLBACK_PARSE_ERROR, UNKNOWN_TARGET_ERROR, convertCurlToTarget }
