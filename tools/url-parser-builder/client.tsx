import { useEffect, useRef, useState } from "react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { TriangleAlert } from "@workspace/ui/icons"

import { UrlAuthorityCard } from "./components/url-authority-card"
import { UrlDiagnosticsCard } from "./components/url-diagnostics-card"
import { UrlInputCard } from "./components/url-input-card"
import { UrlQueryCard } from "./components/url-query-card"
import { UrlRouteCard } from "./components/url-route-card"
import {
  getBuildErrorMessage,
  getParseErrorMessage,
  resolveDefaultParsedResult,
  resolveExampleKey,
  resolveInvalidDraftField,
  stripQueryRowIds,
  toEditableDraft,
} from "./client-helpers"
import {
  buildUrlFromDraft,
  describeUrl,
  getExampleUrl,
  parseUrlInput,
  type UrlBuildErrorCode,
  type UrlExampleKey,
  type UrlParseErrorCode,
} from "./core/url"
import type { EditableUrlDraft, UrlParserBuilderMessages } from "./types"

type TextDraftField = Exclude<keyof EditableUrlDraft, "queryParams">

type UrlParserBuilderClientProps = Readonly<{
  messages: UrlParserBuilderMessages
}>

const STORAGE_KEY = "tools:url-parser-builder:url"
const DEFAULT_EXAMPLE_KEY = "api" satisfies UrlExampleKey
const DEFAULT_PARSED_RESULT = resolveDefaultParsedResult(DEFAULT_EXAMPLE_KEY)

function UrlParserBuilderClient({ messages }: UrlParserBuilderClientProps) {
  const queryIdRef = useRef(0)
  const [rawInput, setRawInput] = useState(DEFAULT_PARSED_RESULT.normalizedUrl)
  const [lastValidUrl, setLastValidUrl] = useState(
    DEFAULT_PARSED_RESULT.normalizedUrl
  )
  const [draft, setDraft] = useState(() =>
    toEditableDraft(DEFAULT_PARSED_RESULT.draft, nextQueryRowId)
  )
  const [activeExample, setActiveExample] = useState<UrlExampleKey | null>(
    DEFAULT_EXAMPLE_KEY
  )
  const [parseErrorCode, setParseErrorCode] =
    useState<UrlParseErrorCode | null>(null)
  const [buildErrorCode, setBuildErrorCode] =
    useState<UrlBuildErrorCode | null>(null)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    const storedValue = window.localStorage.getItem(STORAGE_KEY)

    if (!storedValue) {
      return
    }

    applyRawInput(storedValue)
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(STORAGE_KEY, rawInput)
  }, [rawInput])

  const diagnostics = describeUrl(lastValidUrl)
  const invalidDraftField = resolveInvalidDraftField(buildErrorCode)

  function nextQueryRowId() {
    const id = queryIdRef.current
    queryIdRef.current += 1
    return `query-${id}`
  }

  function applyRawInput(nextInput: string) {
    setRawInput(nextInput)
    setBuildErrorCode(null)

    const parsedResult = parseUrlInput(nextInput)

    if (!parsedResult.ok) {
      setParseErrorCode(parsedResult.code)
      return
    }

    setDraft(toEditableDraft(parsedResult.draft, nextQueryRowId))
    setLastValidUrl(parsedResult.normalizedUrl)
    setParseErrorCode(null)
    setActiveExample(resolveExampleKey(parsedResult.normalizedUrl))
  }

  function applyDraft(nextDraft: EditableUrlDraft) {
    setDraft(nextDraft)

    const buildResult = buildUrlFromDraft(stripQueryRowIds(nextDraft))

    if (!buildResult.ok) {
      setBuildErrorCode(buildResult.code)
      return
    }

    setRawInput(buildResult.normalizedUrl)
    setLastValidUrl(buildResult.normalizedUrl)
    setParseErrorCode(null)
    setBuildErrorCode(null)
    setActiveExample(resolveExampleKey(buildResult.normalizedUrl))
  }

  function updateTextField(field: TextDraftField, value: string) {
    applyDraft({
      ...draft,
      [field]: value,
    })
  }

  function updateQueryParam(id: string, field: "key" | "value", value: string) {
    applyDraft({
      ...draft,
      queryParams: draft.queryParams.map((queryParam) =>
        queryParam.id === id
          ? {
              ...queryParam,
              [field]: value,
            }
          : queryParam
      ),
    })
  }

  function addQueryParam() {
    applyDraft({
      ...draft,
      queryParams: [
        ...draft.queryParams,
        {
          id: nextQueryRowId(),
          key: "",
          value: "",
        },
      ],
    })
  }

  function removeQueryParam(id: string) {
    applyDraft({
      ...draft,
      queryParams: draft.queryParams.filter(
        (queryParam) => queryParam.id !== id
      ),
    })
  }

  function applyExample(key: UrlExampleKey) {
    applyRawInput(getExampleUrl(key))
  }

  function handleReset() {
    applyExample(DEFAULT_EXAMPLE_KEY)
  }

  return (
    <div className="grid gap-6">
      {parseErrorCode ? (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>{messages.invalidUrlTitle}</AlertTitle>
          <AlertDescription>
            {getParseErrorMessage(parseErrorCode, messages)}
          </AlertDescription>
        </Alert>
      ) : null}

      {buildErrorCode ? (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>{messages.builderErrorTitle}</AlertTitle>
          <AlertDescription>
            {getBuildErrorMessage(buildErrorCode, messages)}
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <UrlInputCard
          activeExample={activeExample}
          rawInput={rawInput}
          invalid={parseErrorCode !== null}
          messages={messages}
          onInputChange={applyRawInput}
          onReset={handleReset}
          onSelectExample={applyExample}
        />
        <UrlDiagnosticsCard
          diagnostics={diagnostics}
          normalizedUrl={lastValidUrl}
          messages={messages}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,0.8fr)_minmax(0,1.15fr)]">
        <UrlAuthorityCard
          draft={draft}
          invalidField={invalidDraftField}
          messages={messages}
          onFieldChange={updateTextField}
        />
        <UrlRouteCard
          draft={draft}
          messages={messages}
          onFieldChange={updateTextField}
        />
        <UrlQueryCard
          queryParams={draft.queryParams}
          messages={messages}
          onAddQueryParam={addQueryParam}
          onChangeQueryParam={updateQueryParam}
          onRemoveQueryParam={removeQueryParam}
        />
      </div>
    </div>
  )
}

export default UrlParserBuilderClient
