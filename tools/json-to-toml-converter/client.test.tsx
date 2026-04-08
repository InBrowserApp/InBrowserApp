import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import JsonToTomlConverterClient from "./client"
import { convertJsonToTomlText } from "./core/convert-json-to-toml"

const messages = {
  meta: {
    name: "JSON to TOML Converter",
    description:
      "Convert JSON to TOML. Paste JSON or import a file; preview, copy, and download.",
  },
  importFromFileLabel: "Import from file",
  downloadTomlLabel: "Download TOML",
  jsonLabel: "JSON",
  jsonDescription:
    "Paste JSON directly or import a .json or .txt file from this device.",
  tomlLabel: "TOML",
  tomlDescription:
    "TOML output updates as soon as the input contains valid JSON.",
  tomlEmptyDescription:
    "Paste valid JSON on the left to preview the converted TOML here.",
  jsonPlaceholder: "Paste JSON here...",
  invalidJsonLabel: "Invalid JSON",
  copyTomlLabel: "Copy TOML",
  copiedLabel: "Copied",
} as const

const STORAGE_KEYS = {
  jsonText: "tools:json-to-toml-converter:json-text",
} as const

beforeEach(() => {
  vi.stubGlobal(
    "URL",
    Object.assign({}, globalThis.URL, {
      createObjectURL: vi.fn(() => "blob:converted-toml"),
      revokeObjectURL: vi.fn(),
    })
  )

  window.localStorage.clear()
})

afterEach(cleanup)

function getJsonInput() {
  return screen.getByRole("textbox", {
    name: messages.jsonLabel,
  }) as HTMLTextAreaElement
}

function getTomlOutput() {
  return screen.getByRole("region", {
    name: messages.tomlLabel,
  })
}

function getFileInput() {
  return document.querySelector('input[type="file"]') as HTMLInputElement
}

describe("JsonToTomlConverterClient", () => {
  test("renders the default example and its converted TOML output", () => {
    render(<JsonToTomlConverterClient messages={messages} />)

    const jsonInput = getJsonInput()
    const tomlOutput = getTomlOutput()

    expect(screen.getByText(messages.jsonDescription)).toBeTruthy()
    expect(screen.getByText(messages.tomlDescription)).toBeTruthy()
    expect(jsonInput.value).toContain('"title": "TOML Example"')
    expect(tomlOutput.textContent).toBe(
      convertJsonToTomlText(jsonInput.value).state === "converted"
        ? convertJsonToTomlText(jsonInput.value).toml
        : ""
    )
    expect(tomlOutput.querySelector(".hljs")).toBeTruthy()
    expect(URL.createObjectURL).toHaveBeenCalled()
  })

  test("shows an error for invalid JSON and disables export actions", () => {
    render(<JsonToTomlConverterClient messages={messages} />)

    fireEvent.change(getJsonInput(), {
      target: { value: "{" },
    })

    const tomlOutput = getTomlOutput()
    const outputAlert = within(tomlOutput).getByRole("alert")
    const invalidResult = convertJsonToTomlText("{")

    expect(outputAlert.textContent).toContain(messages.invalidJsonLabel)
    expect(outputAlert.textContent).toContain(
      invalidResult.state === "error" ? invalidResult.message : ""
    )
    expect(tomlOutput.querySelector(".hljs")).toBeNull()
    expect(
      screen.getByRole("button", { name: messages.copyTomlLabel })
    ).toHaveProperty("disabled", true)
    expect(
      screen.getByRole("button", { name: messages.downloadTomlLabel })
    ).toHaveProperty("disabled", true)
  })

  test("clears the error state and output when the input is empty", () => {
    render(<JsonToTomlConverterClient messages={messages} />)

    fireEvent.change(getJsonInput(), {
      target: { value: "   " },
    })

    const tomlOutput = getTomlOutput()

    expect(screen.queryByText(messages.invalidJsonLabel)).toBeNull()
    expect(tomlOutput.textContent).not.toContain(messages.tomlDescription)
    expect(tomlOutput.textContent).toContain(messages.tomlEmptyDescription)
    expect(tomlOutput.querySelector(".hljs")).toBeNull()
  })

  test("imports JSON from a selected file", async () => {
    render(<JsonToTomlConverterClient messages={messages} />)

    const file = new File(['{"name":"demo"}'], "demo.json", {
      type: "application/json",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await waitFor(() => {
      expect(getJsonInput().value).toBe('{"name":"demo"}')
    })

    const result = convertJsonToTomlText('{"name":"demo"}')

    expect(getTomlOutput().textContent).toBe(
      result.state === "converted" ? result.toml : ""
    )
  })

  test("restores the last stored input", () => {
    window.localStorage.setItem(STORAGE_KEYS.jsonText, '{"saved":true}')

    render(<JsonToTomlConverterClient messages={messages} />)

    expect(getJsonInput().value).toBe('{"saved":true}')

    const result = convertJsonToTomlText('{"saved":true}')

    expect(getTomlOutput().textContent).toBe(
      result.state === "converted" ? result.toml : ""
    )
  })

  test("persists edits to local storage", () => {
    render(<JsonToTomlConverterClient messages={messages} />)

    fireEvent.change(getJsonInput(), {
      target: { value: '{"persisted":true}' },
    })

    expect(window.localStorage.getItem(STORAGE_KEYS.jsonText)).toBe(
      '{"persisted":true}'
    )
  })

  test("revokes the previous download URL when output becomes invalid", () => {
    render(<JsonToTomlConverterClient messages={messages} />)

    fireEvent.change(getJsonInput(), {
      target: { value: "{" },
    })

    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:converted-toml")
  })
})
