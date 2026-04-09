import { useEffect } from "react"

import type { JsonDiffPathMessages, OperationOption } from "./types"
import type { JsonDiffOperation } from "../core/json-diff"
import { parseJsonWithError } from "../core/json-diff"

function parseStoredOperations(input: string) {
  try {
    const parsed = JSON.parse(input)

    if (!Array.isArray(parsed)) {
      return null
    }

    const validOperations = parsed.filter(
      (value): value is JsonDiffOperation =>
        value === "add" || value === "remove" || value === "replace"
    )

    return validOperations.length > 0 ? validOperations : null
  } catch {
    return null
  }
}

function formatJsonInput(input: string) {
  const parsed = parseJsonWithError(input)

  if (parsed.error || parsed.value === undefined) {
    return input
  }

  return JSON.stringify(parsed.value, null, 2)
}

function getOperationOptions(
  messages: JsonDiffPathMessages
): OperationOption[] {
  return [
    { label: messages.addLabel, value: "add" },
    { label: messages.removeLabel, value: "remove" },
    { label: messages.replaceLabel, value: "replace" },
  ]
}

function useLocalStorageItem(key: string, value: string) {
  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(key, value)
  }, [key, value])
}

export {
  formatJsonInput,
  getOperationOptions,
  parseStoredOperations,
  useLocalStorageItem,
}
