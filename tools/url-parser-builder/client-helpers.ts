import {
  getExampleUrl,
  parseUrlInput,
  type UrlBuildErrorCode,
  type UrlDraft,
  type UrlExampleKey,
  type UrlParseErrorCode,
  type UrlQueryParam,
} from "./core/url"
import type { EditableUrlDraft, UrlParserBuilderMessages } from "./types"

function resolveDefaultParsedResult(defaultExampleKey: UrlExampleKey) {
  const result = parseUrlInput(getExampleUrl(defaultExampleKey))

  if (!result.ok) {
    throw new Error("Default URL parser example must be valid.")
  }

  return result
}

function toEditableDraft(
  draft: UrlDraft,
  nextRowId: () => string
): EditableUrlDraft {
  return {
    ...draft,
    queryParams: draft.queryParams.map((queryParam) => ({
      id: nextRowId(),
      ...queryParam,
    })),
  }
}

function stripQueryRowIds(draft: EditableUrlDraft): UrlDraft<UrlQueryParam> {
  return {
    ...draft,
    queryParams: draft.queryParams.map(({ key, value }) => ({ key, value })),
  }
}

function resolveExampleKey(value: string): UrlExampleKey | null {
  if (value === getExampleUrl("api")) {
    return "api"
  }

  if (value === getExampleUrl("auth")) {
    return "auth"
  }

  if (value === getExampleUrl("campaign")) {
    return "campaign"
  }

  return null
}

function resolveInvalidDraftField(code: UrlBuildErrorCode | null) {
  switch (code) {
    case "missing-protocol":
    case "invalid-protocol":
      return "protocol"
    case "missing-hostname":
      return "hostname"
    case "invalid-port":
      return "port"
    default:
      return null
  }
}

function getParseErrorMessage(
  code: UrlParseErrorCode,
  messages: UrlParserBuilderMessages
) {
  switch (code) {
    case "empty-input":
      return messages.invalidUrlEmptyDescription
    case "relative-url":
      return messages.invalidUrlRelativeDescription
    case "invalid-url":
      return messages.invalidUrlMalformedDescription
  }
}

function getBuildErrorMessage(
  code: UrlBuildErrorCode,
  messages: UrlParserBuilderMessages
) {
  switch (code) {
    case "missing-protocol":
      return messages.missingProtocolError
    case "invalid-protocol":
      return messages.invalidProtocolError
    case "missing-hostname":
      return messages.missingHostnameError
    case "invalid-port":
      return messages.invalidPortError
  }
}

export {
  getBuildErrorMessage,
  getParseErrorMessage,
  resolveDefaultParsedResult,
  resolveExampleKey,
  resolveInvalidDraftField,
  stripQueryRowIds,
  toEditableDraft,
}
