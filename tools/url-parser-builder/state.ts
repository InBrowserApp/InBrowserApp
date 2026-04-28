import { RESET_URL, SAMPLE_URL } from "./constants"
import { buildUrlFromDraft, parseUrlToDraft } from "./core/url-builder"

import type {
  UrlBuilderDraft,
  UrlQueryRow,
  UrlParserBuilderMessages,
} from "./types"

type BuilderState = Omit<UrlBuilderDraft, "queryEntries"> & {
  queryRows: readonly UrlQueryRow[]
}

type UrlEditorState = Readonly<{
  builder: BuilderState
  urlInput: string
  parseError: boolean
  nextRowId: number
}>

type UrlEditorAction =
  | Readonly<{ type: "input-changed"; value: string }>
  | Readonly<{
      type: "field-changed"
      field:
        | "protocol"
        | "username"
        | "password"
        | "hostname"
        | "port"
        | "pathname"
        | "fragment"
      value: string
    }>
  | Readonly<{ type: "query-added" }>
  | Readonly<{
      type: "query-updated"
      id: string
      field: "key" | "value"
      value: string
    }>
  | Readonly<{ type: "query-removed"; id: string }>
  | Readonly<{ type: "load-sample" }>
  | Readonly<{ type: "reset" }>

const sampleDraft = (() => {
  const parsed = parseUrlToDraft(SAMPLE_URL)

  if (!parsed.ok) {
    throw new Error("Sample URL must stay valid")
  }

  return parsed.draft
})()

function createQueryRows(
  entries: readonly UrlBuilderDraft["queryEntries"][number][],
  nextRowId: number
) {
  let currentRowId = nextRowId

  const queryRows = entries.map((entry) => {
    const row = {
      id: `query-${currentRowId}`,
      key: entry.key,
      value: entry.value,
    }

    currentRowId += 1

    return row
  })

  return { queryRows, nextRowId: currentRowId }
}

function builderFromDraft(draft: UrlBuilderDraft, nextRowId: number) {
  const rows = createQueryRows(draft.queryEntries, nextRowId)

  return {
    builder: {
      protocol: draft.protocol,
      username: draft.username,
      password: draft.password,
      hostname: draft.hostname,
      port: draft.port,
      pathname: draft.pathname,
      fragment: draft.fragment,
      queryRows: rows.queryRows,
    },
    nextRowId: rows.nextRowId,
  }
}

function draftFromBuilder(builder: BuilderState): UrlBuilderDraft {
  return {
    protocol: builder.protocol,
    username: builder.username,
    password: builder.password,
    hostname: builder.hostname,
    port: builder.port,
    pathname: builder.pathname,
    fragment: builder.fragment,
    queryEntries: builder.queryRows.map(({ key, value }) => ({ key, value })),
  }
}

function createEditorState(urlInput: string, nextRowId = 0): UrlEditorState {
  const parsed = parseUrlToDraft(urlInput)

  if (!parsed.ok) {
    const builderState = builderFromDraft(sampleDraft, nextRowId)

    return {
      builder: builderState.builder,
      urlInput,
      parseError: true,
      nextRowId: builderState.nextRowId,
    }
  }

  const builderState = builderFromDraft(parsed.draft, nextRowId)

  return {
    builder: builderState.builder,
    urlInput,
    parseError: false,
    nextRowId: builderState.nextRowId,
  }
}

function applyBuilderUpdate(
  state: UrlEditorState,
  builder: BuilderState
): UrlEditorState {
  const buildResult = buildUrlFromDraft(draftFromBuilder(builder))

  if (!buildResult.ok) {
    return { ...state, builder }
  }

  return {
    ...state,
    builder,
    urlInput: buildResult.url,
    parseError: false,
  }
}

function editorReducer(
  state: UrlEditorState,
  action: UrlEditorAction
): UrlEditorState {
  switch (action.type) {
    case "input-changed": {
      const parsed = parseUrlToDraft(action.value)

      if (!parsed.ok) {
        return {
          ...state,
          urlInput: action.value,
          parseError: true,
        }
      }

      return createEditorState(action.value, state.nextRowId)
    }

    case "field-changed":
      return applyBuilderUpdate(state, {
        ...state.builder,
        [action.field]: action.value,
      })

    case "query-added":
      return applyBuilderUpdate(
        {
          ...state,
          nextRowId: state.nextRowId + 1,
        },
        {
          ...state.builder,
          queryRows: [
            ...state.builder.queryRows,
            { id: `query-${state.nextRowId}`, key: "", value: "" },
          ],
        }
      )

    case "query-updated":
      return applyBuilderUpdate(state, {
        ...state.builder,
        queryRows: state.builder.queryRows.map((row) =>
          row.id === action.id ? { ...row, [action.field]: action.value } : row
        ),
      })

    case "query-removed":
      return applyBuilderUpdate(state, {
        ...state.builder,
        queryRows: state.builder.queryRows.filter(
          (row) => row.id !== action.id
        ),
      })

    case "load-sample":
      return createEditorState(SAMPLE_URL, state.nextRowId)

    case "reset":
      return createEditorState(RESET_URL, state.nextRowId)
  }
}

function buildErrorDescription(
  messages: UrlParserBuilderMessages,
  buildError:
    | "missing-protocol"
    | "missing-hostname"
    | "invalid-port"
    | "invalid-url"
) {
  switch (buildError) {
    case "missing-protocol":
      return messages.missingProtocolDescription
    case "missing-hostname":
      return messages.missingHostnameDescription
    case "invalid-port":
      return messages.invalidPortDescription
    case "invalid-url":
      return messages.invalidBuildDescription
  }
}

export {
  buildErrorDescription,
  createEditorState,
  draftFromBuilder,
  editorReducer,
}
