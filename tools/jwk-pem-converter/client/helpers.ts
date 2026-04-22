import { JwkPemError, parseJwkJson, type WarningEntry } from "../core/jwk-pem"

import type { JwkPemConverterMessages } from "./types"

type JwkParseState =
  | { state: "empty" }
  | { state: "parsed"; keys: JsonWebKey[] }
  | { state: "error"; error: JwkPemError }

function getJwkParseState(input: string): JwkParseState {
  if (input.trim() === "") {
    return { state: "empty" }
  }

  try {
    return { state: "parsed", keys: parseJwkJson(input) }
  } catch (error) {
    return {
      state: "error",
      error: normalizeJwkPemError(error, "errorInvalidJwk"),
    }
  }
}

function isJwkSet(
  jwk: JsonWebKey | { keys: JsonWebKey[] }
): jwk is { keys: JsonWebKey[] } {
  return "keys" in jwk
}

function normalizeJwkPemError(error: unknown, fallbackKey: string) {
  if (error instanceof JwkPemError) {
    return error
  }

  return new JwkPemError(fallbackKey)
}

function formatErrorMessage(
  messages: JwkPemConverterMessages,
  error: JwkPemError | null
) {
  if (!error) {
    return null
  }

  const template = messages[error.key as keyof JwkPemConverterMessages]
  return typeof template === "string"
    ? formatTemplate(template, error.params)
    : error.message
}

function formatWarningMessages(
  messages: JwkPemConverterMessages,
  warnings: readonly WarningEntry[]
) {
  return warnings.map((warning) => {
    const template = messages[warning.key as keyof JwkPemConverterMessages]

    return typeof template === "string"
      ? formatTemplate(template, warning.params)
      : warning.key
  })
}

function formatKeyLabel(
  messages: JwkPemConverterMessages,
  key: JsonWebKey,
  index: number
) {
  const type = key.kty ? key.kty : messages.unknownKey
  const detail = key.crv ? ` ${key.crv}` : ""
  const keyWithId = key as JsonWebKey & { kid?: string }
  const keyId =
    typeof keyWithId.kid === "string" && keyWithId.kid.trim() !== ""
      ? ` (${keyWithId.kid})`
      : ` #${index + 1}`

  return `${type}${detail}${keyId}`
}

function formatTemplate(
  template: string,
  params?: Readonly<Record<string, string>>
) {
  if (!params) {
    return template
  }

  return template.replaceAll(
    /\{(\w+)\}/g,
    (_, key: string) => params[key] ?? `{${key}}`
  )
}

export {
  formatErrorMessage,
  formatKeyLabel,
  formatWarningMessages,
  getJwkParseState,
  isJwkSet,
  normalizeJwkPemError,
}
export type { JwkParseState }
