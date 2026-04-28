import { startTransition, useEffect, useReducer } from "react"

import { SAMPLE_URL, STORAGE_KEY } from "./constants"
import {
  buildUrlFromDraft,
  countPathSegments,
  countQueryEntries,
  getHostDisplay,
  getOriginDisplay,
} from "./core/url-builder"
import { UrlAuthorityCard } from "./components/url-authority-card"
import { UrlInputCard } from "./components/url-input-card"
import { UrlMetrics } from "./components/url-metrics"
import { UrlPathCard } from "./components/url-path-card"
import { UrlPreviewCard } from "./components/url-preview-card"
import { UrlQueryCard } from "./components/url-query-card"
import {
  buildErrorDescription,
  createEditorState,
  draftFromBuilder,
  editorReducer,
} from "./state"

import type { UrlParserBuilderMessages } from "./types"

type UrlParserBuilderClientProps = Readonly<{
  messages: UrlParserBuilderMessages
}>

function UrlParserBuilderClient({ messages }: UrlParserBuilderClientProps) {
  const [state, dispatch] = useReducer(editorReducer, undefined, () =>
    createEditorState(SAMPLE_URL)
  )

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedUrl = window.localStorage.getItem(STORAGE_KEY)

    if (storedUrl !== null) {
      dispatch({ type: "input-changed", value: storedUrl })
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEY, state.urlInput)
  }, [state.urlInput])

  const draft = draftFromBuilder(state.builder)
  const buildResult = buildUrlFromDraft(draft)

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.95fr)]">
        <UrlInputCard
          messages={messages}
          value={state.urlInput}
          isValid={!state.parseError}
          showParseError={state.parseError}
          onChange={(value) => {
            dispatch({ type: "input-changed", value })
          }}
          onLoadSample={() => {
            startTransition(() => {
              dispatch({ type: "load-sample" })
            })
          }}
          onReset={() => {
            startTransition(() => {
              dispatch({ type: "reset" })
            })
          }}
        />

        <UrlPreviewCard
          messages={messages}
          finalUrl={state.parseError || !buildResult.ok ? "" : buildResult.url}
          buildErrorDescription={
            state.parseError || buildResult.ok
              ? null
              : buildErrorDescription(messages, buildResult.error)
          }
        />
      </div>

      <UrlMetrics
        messages={messages}
        origin={getOriginDisplay(draft)}
        host={getHostDisplay(draft)}
        pathSegments={countPathSegments(draft.pathname)}
        queryCount={countQueryEntries(draft.queryEntries)}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <UrlAuthorityCard
          messages={messages}
          protocol={state.builder.protocol}
          username={state.builder.username}
          password={state.builder.password}
          hostname={state.builder.hostname}
          port={state.builder.port}
          onFieldChange={(field, value) => {
            dispatch({ type: "field-changed", field, value })
          }}
        />

        <UrlPathCard
          messages={messages}
          pathname={state.builder.pathname}
          fragment={state.builder.fragment}
          onFieldChange={(field, value) => {
            dispatch({ type: "field-changed", field, value })
          }}
        />
      </div>

      <UrlQueryCard
        messages={messages}
        queryRows={state.builder.queryRows}
        onAdd={() => {
          startTransition(() => {
            dispatch({ type: "query-added" })
          })
        }}
        onUpdate={(id, field, value) => {
          dispatch({ type: "query-updated", id, field, value })
        }}
        onRemove={(id) => {
          startTransition(() => {
            dispatch({ type: "query-removed", id })
          })
        }}
      />
    </div>
  )
}

export default UrlParserBuilderClient
