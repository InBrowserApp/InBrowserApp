import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import TomlToJsonConverterClient from "./client"
import { convertTomlToJsonText } from "./core/convert-toml-to-json"

const messages = {
  meta: {
    name: "TOML to JSON Converter",
    description:
      "Convert TOML to JSON. Paste TOML or import a file; preview, copy, and download.",
  },
  importFromFileLabel: "Import from file",
  downloadJsonLabel: "Download JSON",
  tomlLabel: "TOML",
  tomlDescription:
    "Paste TOML directly or import a .toml or .txt file from this device.",
  jsonLabel: "JSON",
  jsonDescription:
    "JSON output updates as soon as the input contains valid TOML.",
  jsonEmptyDescription:
    "Paste valid TOML on the left to preview the converted JSON here.",
  tomlPlaceholder: "Paste TOML here...",
  invalidTomlLabel: "Invalid TOML",
  copyJsonLabel: "Copy JSON",
  copiedLabel: "Copied",
} as const

const STORAGE_KEYS = {
  tomlText: "tools:toml-to-json-converter:toml-text",
} as const

beforeEach(() => {
  vi.stubGlobal(
    "URL",
    Object.assign({}, globalThis.URL, {
      createObjectURL: vi.fn(() => "blob:converted-json"),
      revokeObjectURL: vi.fn(),
    })
  )

  window.localStorage.clear()
})

afterEach(cleanup)

function getTomlInput() {
  return screen.getByRole("textbox", {
    name: messages.tomlLabel,
  }) as HTMLTextAreaElement
}

function getJsonOutput() {
  return screen.getByRole("region", {
    name: messages.jsonLabel,
  })
}

function getFileInput() {
  return document.querySelector('input[type="file"]') as HTMLInputElement
}

describe("TomlToJsonConverterClient", () => {
  test("renders the default example and its converted JSON output", () => {
    render(<TomlToJsonConverterClient messages={messages} />)

    const tomlInput = getTomlInput()
    const jsonOutput = getJsonOutput()
    const result = convertTomlToJsonText(tomlInput.value)

    expect(screen.getByText(messages.tomlDescription)).toBeTruthy()
    expect(screen.getByText(messages.jsonDescription)).toBeTruthy()
    expect(tomlInput.value).toContain('title = "TOML Example"')
    expect(jsonOutput.textContent).toBe(
      result.state === "converted" ? result.json : ""
    )
    expect(jsonOutput.querySelector(".hljs")).toBeTruthy()
    expect(URL.createObjectURL).toHaveBeenCalled()
  })

  test("shows an error for invalid TOML and disables export actions", () => {
    render(<TomlToJsonConverterClient messages={messages} />)

    fireEvent.change(getTomlInput(), {
      target: { value: "[" },
    })

    const jsonOutput = getJsonOutput()
    const outputAlert = within(jsonOutput).getByRole("alert")
    const invalidResult = convertTomlToJsonText("[")

    expect(outputAlert.textContent).toContain(messages.invalidTomlLabel)
    expect(outputAlert.textContent).toContain(
      invalidResult.state === "error" ? invalidResult.message : ""
    )
    expect(jsonOutput.querySelector(".hljs")).toBeNull()
    expect(
      screen.getByRole("button", { name: messages.copyJsonLabel })
    ).toHaveProperty("disabled", true)
    expect(
      screen.getByRole("button", { name: messages.downloadJsonLabel })
    ).toHaveProperty("disabled", true)
  })

  test("clears the error state and output when the input is empty", () => {
    render(<TomlToJsonConverterClient messages={messages} />)

    fireEvent.change(getTomlInput(), {
      target: { value: "   " },
    })

    const jsonOutput = getJsonOutput()

    expect(screen.queryByText(messages.invalidTomlLabel)).toBeNull()
    expect(jsonOutput.textContent).not.toContain(messages.jsonDescription)
    expect(jsonOutput.textContent).toContain(messages.jsonEmptyDescription)
    expect(jsonOutput.querySelector(".hljs")).toBeNull()
  })

  test("imports TOML from a selected file", async () => {
    render(<TomlToJsonConverterClient messages={messages} />)

    const file = new File(['name = "demo"'], "demo.toml", {
      type: "application/toml",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await waitFor(() => {
      expect(getTomlInput().value).toBe('name = "demo"')
    })

    const result = convertTomlToJsonText('name = "demo"')

    expect(getJsonOutput().textContent).toBe(
      result.state === "converted" ? result.json : ""
    )
  })

  test("restores the last stored input", () => {
    window.localStorage.setItem(STORAGE_KEYS.tomlText, "saved = true")

    render(<TomlToJsonConverterClient messages={messages} />)

    expect(getTomlInput().value).toBe("saved = true")

    const result = convertTomlToJsonText("saved = true")

    expect(getJsonOutput().textContent).toBe(
      result.state === "converted" ? result.json : ""
    )
  })

  test("persists edits to local storage", () => {
    render(<TomlToJsonConverterClient messages={messages} />)

    fireEvent.change(getTomlInput(), {
      target: { value: "persisted = true" },
    })

    expect(window.localStorage.getItem(STORAGE_KEYS.tomlText)).toBe(
      "persisted = true"
    )
  })

  test("revokes the previous download URL when output becomes invalid", () => {
    render(<TomlToJsonConverterClient messages={messages} />)

    fireEvent.change(getTomlInput(), {
      target: { value: "[" },
    })

    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:converted-json")
  })
})
