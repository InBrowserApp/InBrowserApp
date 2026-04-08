import { JSONPath, type JSONPathOptions } from "jsonpath-plus"

type ParsedJson =
  | { value: unknown }
  | {
      error: string
    }

type JsonpathEvaluation =
  | { state: "empty" }
  | { state: "json-error"; error: string }
  | { state: "query-error"; error: string }
  | {
      state: "ready"
      formattedPaths: string
      formattedValues: string
      matchCount: number
      paths: string[]
      values: unknown[]
    }

function parseJsonText(input: string): ParsedJson {
  try {
    return { value: JSON.parse(input) }
  } catch (error) {
    return { error: String(error) }
  }
}

function countJsonpathMatches(values: readonly unknown[]): number {
  return values.length
}

function formatJsonpathResults(results: readonly unknown[]): string {
  return JSON.stringify(results, null, 2)
}

function evaluateJsonpathText(
  jsonText: string,
  queryText: string
): JsonpathEvaluation {
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

  try {
    const path = queryText.trim()
    const json = parsedJson.value as JSONPathOptions["json"]
    const values = JSONPath<unknown[]>({
      path,
      json,
      resultType: "value",
      wrap: true,
    })
    const paths = JSONPath<string[]>({
      path,
      json,
      resultType: "path",
      wrap: true,
    })

    return {
      state: "ready",
      values,
      paths,
      matchCount: countJsonpathMatches(values),
      formattedValues: formatJsonpathResults(values),
      formattedPaths: formatJsonpathResults(paths),
    }
  } catch (error) {
    return {
      state: "query-error",
      error: String(error),
    }
  }
}

export {
  countJsonpathMatches,
  evaluateJsonpathText,
  formatJsonpathResults,
  parseJsonText,
}
export type { JsonpathEvaluation }
