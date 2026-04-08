import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import JsonFormatterClient from "./client"

const messages = {
  meta: {
    name: "JSON Formatter",
    description: "Format and prettify JSON with proper indentation.",
  },
  importFromFileLabel: "Import from file",
  downloadJsonLabel: "Download JSON",
  rawJsonLabel: "Raw JSON",
  rawJsonDescription:
    "Paste JSON directly or import a .json or .txt file from this device.",
  formattedJsonLabel: "Formatted JSON",
  formattedJsonDescription:
    "Formatted output updates as soon as the input contains valid JSON.",
  jsonPlaceholder: "Paste your JSON here...",
  invalidJsonLabel: "Invalid JSON",
  indentSizeLabel: "Indent",
  copyJsonLabel: "Copy JSON",
  copiedLabel: "Copied",
} as const

const STORAGE_KEYS = {
  indentSize: "tools:json-formatter:indent-size",
  jsonText: "tools:json-formatter:json-text",
} as const

beforeEach(() => {
  vi.stubGlobal(
    "URL",
    Object.assign({}, globalThis.URL, {
      createObjectURL: vi.fn(() => "blob:formatted-json"),
      revokeObjectURL: vi.fn(),
    })
  )

  window.localStorage.clear()
})

afterEach(cleanup)

function getRawJsonInput() {
  return screen.getByRole("textbox", {
    name: messages.rawJsonLabel,
  }) as HTMLTextAreaElement
}

function getFormattedJsonInput() {
  return screen.getByRole("region", {
    name: messages.formattedJsonLabel,
  })
}

function getIndentInput() {
  return screen.getByRole("spinbutton", {
    name: messages.indentSizeLabel,
  }) as HTMLInputElement
}

function getFileInput() {
  return document.querySelector('input[type="file"]') as HTMLInputElement
}

describe("JsonFormatterClient", () => {
  test("renders the default example and its formatted output", () => {
    render(<JsonFormatterClient messages={messages} />)

    const rawJsonInput = getRawJsonInput()
    const formattedJsonOutput = getFormattedJsonInput()

    expect(rawJsonInput.value).toContain('"hello": "world"')
    expect(formattedJsonOutput.textContent).toBe(
      JSON.stringify(JSON.parse(rawJsonInput.value), null, 2)
    )
    expect(formattedJsonOutput.querySelector(".hljs-attr")).toBeTruthy()
    expect(URL.createObjectURL).toHaveBeenCalled()
  })

  test("shows an error for invalid JSON and disables export actions", () => {
    render(<JsonFormatterClient messages={messages} />)

    fireEvent.change(getRawJsonInput(), {
      target: { value: "{" },
    })

    expect(screen.getByText(messages.invalidJsonLabel)).toBeTruthy()
    expect(getFormattedJsonInput().querySelector(".hljs")).toBeNull()
    expect(
      screen.getByRole("button", { name: messages.copyJsonLabel })
    ).toHaveProperty("disabled", true)
    expect(
      screen.getByRole("button", { name: messages.downloadJsonLabel })
    ).toHaveProperty("disabled", true)
  })

  test("clears the error state and output when the input is empty", () => {
    render(<JsonFormatterClient messages={messages} />)

    fireEvent.change(getRawJsonInput(), {
      target: { value: "   " },
    })

    expect(screen.queryByText(messages.invalidJsonLabel)).toBeNull()
    expect(getFormattedJsonInput().querySelector(".hljs")).toBeNull()
  })

  test("updates formatting when the indent size changes", () => {
    render(<JsonFormatterClient messages={messages} />)

    fireEvent.change(getIndentInput(), {
      target: { value: "4" },
    })

    expect(getFormattedJsonInput().textContent).toContain(
      '\n    "hello": "world"'
    )
  })

  test("imports JSON from a selected file", async () => {
    render(<JsonFormatterClient messages={messages} />)

    const file = new File(['{"name":"demo"}'], "demo.json", {
      type: "application/json",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await waitFor(() => {
      expect(getRawJsonInput().value).toBe('{"name":"demo"}')
    })

    expect(getFormattedJsonInput().textContent).toBe('{\n  "name": "demo"\n}')
  })

  test("restores the last stored input and indent size", () => {
    window.localStorage.setItem(STORAGE_KEYS.jsonText, '{"saved":true}')
    window.localStorage.setItem(STORAGE_KEYS.indentSize, "4")

    render(<JsonFormatterClient messages={messages} />)

    expect(getRawJsonInput().value).toBe('{"saved":true}')
    expect(getIndentInput().value).toBe("4")
    expect(getFormattedJsonInput().textContent).toBe('{\n    "saved": true\n}')
  })

  test("persists edits to local storage", () => {
    render(<JsonFormatterClient messages={messages} />)

    fireEvent.change(getRawJsonInput(), {
      target: { value: '{"persisted":true}' },
    })
    fireEvent.change(getIndentInput(), {
      target: { value: "3" },
    })

    expect(window.localStorage.getItem(STORAGE_KEYS.jsonText)).toBe(
      '{"persisted":true}'
    )
    expect(window.localStorage.getItem(STORAGE_KEYS.indentSize)).toBe("3")
  })

  test("revokes the previous download URL when output becomes invalid", () => {
    render(<JsonFormatterClient messages={messages} />)

    fireEvent.change(getRawJsonInput(), {
      target: { value: "{" },
    })

    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:formatted-json")
  })
})
