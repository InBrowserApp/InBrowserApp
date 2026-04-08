import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import JsonToYamlConverterClient from "./client"
import { convertJsonToYamlText } from "./core/convert-json-to-yaml"

const messages = {
  meta: {
    name: "JSON to YAML Converter",
    description:
      "Convert JSON to YAML. Paste JSON or import a file; preview, copy, and download.",
  },
  importFromFileLabel: "Import from file",
  downloadYamlLabel: "Download YAML",
  jsonLabel: "JSON",
  yamlLabel: "YAML",
  jsonPlaceholder: "Paste JSON here...",
  invalidJsonLabel: "Invalid JSON",
  copyYamlLabel: "Copy YAML",
  copiedLabel: "Copied",
} as const

const STORAGE_KEYS = {
  jsonText: "tools:json-to-yaml-converter:json-text",
} as const

beforeEach(() => {
  vi.stubGlobal(
    "URL",
    Object.assign({}, globalThis.URL, {
      createObjectURL: vi.fn(() => "blob:converted-yaml"),
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

function getYamlOutput() {
  return screen.getByRole("region", {
    name: messages.yamlLabel,
  })
}

function getFileInput() {
  return document.querySelector('input[type="file"]') as HTMLInputElement
}

describe("JsonToYamlConverterClient", () => {
  test("renders the default example and its converted YAML output", () => {
    render(<JsonToYamlConverterClient messages={messages} />)

    const jsonInput = getJsonInput()
    const yamlOutput = getYamlOutput()

    expect(jsonInput.value).toContain('"hello": "world"')
    expect(yamlOutput.textContent).toBe(
      convertJsonToYamlText(jsonInput.value).state === "converted"
        ? convertJsonToYamlText(jsonInput.value).yaml
        : ""
    )
    expect(yamlOutput.querySelector(".hljs")).toBeTruthy()
    expect(URL.createObjectURL).toHaveBeenCalled()
  })

  test("shows an error for invalid JSON and disables export actions", () => {
    render(<JsonToYamlConverterClient messages={messages} />)

    fireEvent.change(getJsonInput(), {
      target: { value: "{" },
    })

    expect(screen.getByText(messages.invalidJsonLabel)).toBeTruthy()
    expect(getYamlOutput().querySelector(".hljs")).toBeNull()
    expect(
      screen.getByRole("button", { name: messages.copyYamlLabel })
    ).toHaveProperty("disabled", true)
    expect(
      screen.getByRole("button", { name: messages.downloadYamlLabel })
    ).toHaveProperty("disabled", true)
  })

  test("clears the error state and output when the input is empty", () => {
    render(<JsonToYamlConverterClient messages={messages} />)

    fireEvent.change(getJsonInput(), {
      target: { value: "   " },
    })

    expect(screen.queryByText(messages.invalidJsonLabel)).toBeNull()
    expect(getYamlOutput().querySelector(".hljs")).toBeNull()
  })

  test("imports JSON from a selected file", async () => {
    render(<JsonToYamlConverterClient messages={messages} />)

    const file = new File(['{"name":"demo"}'], "demo.json", {
      type: "application/json",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await waitFor(() => {
      expect(getJsonInput().value).toBe('{"name":"demo"}')
    })

    expect(getYamlOutput().textContent).toBe("name: demo\n")
  })

  test("restores the last stored input", () => {
    window.localStorage.setItem(STORAGE_KEYS.jsonText, '{"saved":true}')

    render(<JsonToYamlConverterClient messages={messages} />)

    expect(getJsonInput().value).toBe('{"saved":true}')
    expect(getYamlOutput().textContent).toBe("saved: true\n")
  })

  test("persists edits to local storage", () => {
    render(<JsonToYamlConverterClient messages={messages} />)

    fireEvent.change(getJsonInput(), {
      target: { value: '{"persisted":true}' },
    })

    expect(window.localStorage.getItem(STORAGE_KEYS.jsonText)).toBe(
      '{"persisted":true}'
    )
  })

  test("revokes the previous download URL when output becomes invalid", () => {
    render(<JsonToYamlConverterClient messages={messages} />)

    fireEvent.change(getJsonInput(), {
      target: { value: "{" },
    })

    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:converted-yaml")
  })
})
