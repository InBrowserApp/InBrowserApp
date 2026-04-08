import { search as jmespathSearch } from "jmespath"

type ParsedJson =
  | { value: unknown }
  | {
      error: string
    }
  | Record<string, never>

type JmespathEvaluation =
  | { state: "empty" }
  | { state: "json-error"; error: string }
  | { state: "query-error"; error: string }
  | {
      state: "ready"
      formattedResult: string
      result: unknown
      resultCount: number
    }

function parseJsonText(input: string): ParsedJson {
  if (!input.trim()) {
    return {}
  }

  try {
    return { value: JSON.parse(input) }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return { error: message }
  }
}

function countJmespathResults(result: unknown): number {
  if (Array.isArray(result)) {
    return result.length
  }

  if (result === null || result === undefined) {
    return 0
  }

  return 1
}

function formatJmespathResult(result: unknown): string {
  return JSON.stringify(result ?? null, null, 2)
}

function evaluateJmespathText(
  jsonText: string,
  queryText: string
): JmespathEvaluation {
  if (!jsonText.trim() || !queryText.trim()) {
    return { state: "empty" }
  }

  const parsedJson = parseJsonText(jsonText)

  if ("error" in parsedJson) {
    return {
      state: "json-error",
      error: parsedJson.error,
    }
  }

  if (!("value" in parsedJson)) {
    return { state: "empty" }
  }

  try {
    const result = jmespathSearch(parsedJson.value, queryText.trim()) ?? null

    return {
      state: "ready",
      result,
      resultCount: countJmespathResults(result),
      formattedResult: formatJmespathResult(result),
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)

    return {
      state: "query-error",
      error: message,
    }
  }
}

export {
  countJmespathResults,
  evaluateJmespathText,
  formatJmespathResult,
  parseJsonText,
}
export type { JmespathEvaluation }
