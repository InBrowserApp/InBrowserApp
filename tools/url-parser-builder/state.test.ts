import { describe, expect, test } from "vitest"

import meta from "./meta/en.json"
import messages from "./messages/en.json"
import { RESET_URL, SAMPLE_URL } from "./constants"
import {
  buildErrorDescription,
  createEditorState,
  draftFromBuilder,
  editorReducer,
} from "./state"

const localizedMessages = { meta, ...messages } as const

describe("url parser builder state", () => {
  test("falls back to the sample draft for invalid initial input", () => {
    const state = createEditorState("broken", 4)

    expect(state.parseError).toBe(true)
    expect(state.urlInput).toBe("broken")
    expect(state.builder.protocol).toBe("https")
    expect(state.builder.username).toBe("marina")
    expect(state.builder.password).toBe("teal waves")
    expect(state.builder.hostname).toBe("example.com")
    expect(state.builder.port).toBe("8443")
    expect(state.builder.queryRows.map(({ id }) => id)).toEqual([
      "query-4",
      "query-5",
      "query-6",
    ])
    expect(state.nextRowId).toBe(7)
  })

  test("preserves the last valid builder when the full URL input is invalid", () => {
    const initialState = createEditorState(RESET_URL)
    const nextState = editorReducer(initialState, {
      type: "input-changed",
      value: "broken",
    })

    expect(nextState.parseError).toBe(true)
    expect(nextState.urlInput).toBe("broken")
    expect(nextState.builder).toEqual(initialState.builder)
    expect(draftFromBuilder(nextState.builder)).toEqual(
      draftFromBuilder(initialState.builder)
    )
  })

  test("keeps the previous URL when a field edit produces an invalid draft", () => {
    const initialState = createEditorState(RESET_URL)
    const nextState = editorReducer(initialState, {
      type: "field-changed",
      field: "port",
      value: "abc",
    })

    expect(nextState.parseError).toBe(false)
    expect(nextState.urlInput).toBe(RESET_URL)
    expect(nextState.builder.port).toBe("abc")
  })

  test("handles query row updates and canned actions", () => {
    let state = createEditorState(RESET_URL)

    state = editorReducer(state, { type: "query-added" })
    expect(state.builder.queryRows).toHaveLength(1)

    const queryRowId = state.builder.queryRows[0]?.id
    expect(queryRowId).toBeTruthy()

    state = editorReducer(state, {
      type: "query-updated",
      id: queryRowId!,
      field: "key",
      value: "q",
    })
    state = editorReducer(state, {
      type: "query-updated",
      id: queryRowId!,
      field: "value",
      value: "coffee beans",
    })

    expect(state.urlInput).toBe("https://example.com/?q=coffee+beans")

    state = editorReducer(state, {
      type: "query-removed",
      id: queryRowId!,
    })
    expect(state.builder.queryRows).toHaveLength(0)
    expect(state.urlInput).toBe(RESET_URL)

    state = editorReducer(state, { type: "load-sample" })
    expect(state.urlInput).toBe(SAMPLE_URL)

    state = editorReducer(state, { type: "reset" })
    expect(state.urlInput).toBe(RESET_URL)
  })

  test("maps every build error to localized copy", () => {
    expect(buildErrorDescription(localizedMessages, "missing-protocol")).toBe(
      messages.missingProtocolDescription
    )
    expect(buildErrorDescription(localizedMessages, "missing-hostname")).toBe(
      messages.missingHostnameDescription
    )
    expect(buildErrorDescription(localizedMessages, "invalid-port")).toBe(
      messages.invalidPortDescription
    )
    expect(buildErrorDescription(localizedMessages, "invalid-url")).toBe(
      messages.invalidBuildDescription
    )
  })
})
