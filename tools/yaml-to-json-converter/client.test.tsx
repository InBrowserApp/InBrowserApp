import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import YamlToJsonConverterClient from "./client"
import { convertYamlToJsonText } from "./core/convert-yaml-to-json"

const messages = {
  meta: {
    name: "YAML to JSON Converter",
    description:
      "Convert YAML to JSON. Paste YAML or import a file; preview, copy, and download.",
  },
  importFromFileLabel: "Import from file",
  downloadJsonLabel: "Download JSON",
  yamlLabel: "YAML",
  yamlDescription:
    "Paste YAML directly or import a .yaml or .txt file from this device.",
  jsonLabel: "JSON",
  jsonDescription:
    "JSON output updates as soon as the input contains valid YAML.",
  jsonEmptyDescription:
    "Paste valid YAML on the left to preview the converted JSON here.",
  yamlPlaceholder: "Paste YAML here...",
  invalidYamlLabel: "Invalid YAML",
  copyJsonLabel: "Copy JSON",
  copiedLabel: "Copied",
} as const

const STORAGE_KEYS = {
  yamlText: "tools:yaml-to-json-converter:yaml-text",
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

function getYamlInput() {
  return screen.getByRole("textbox", {
    name: messages.yamlLabel,
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

describe("YamlToJsonConverterClient", () => {
  test("renders the default example and its converted JSON output", () => {
    render(<YamlToJsonConverterClient messages={messages} />)

    const yamlInput = getYamlInput()
    const jsonOutput = getJsonOutput()
    const result = convertYamlToJsonText(yamlInput.value)

    expect(screen.getByText(messages.yamlDescription)).toBeTruthy()
    expect(screen.getByText(messages.jsonDescription)).toBeTruthy()
    expect(yamlInput.value).toContain("title: YAML Example")
    expect(jsonOutput.textContent).toBe(
      result.state === "converted" ? result.json : ""
    )
    expect(jsonOutput.querySelector(".hljs")).toBeTruthy()
    expect(URL.createObjectURL).toHaveBeenCalled()
  })

  test("shows an error for invalid YAML and disables export actions", () => {
    render(<YamlToJsonConverterClient messages={messages} />)

    fireEvent.change(getYamlInput(), {
      target: { value: "items: [1, 2" },
    })

    const jsonOutput = getJsonOutput()
    const outputAlert = within(jsonOutput).getByRole("alert")
    const invalidResult = convertYamlToJsonText("items: [1, 2")

    expect(outputAlert.textContent).toContain(messages.invalidYamlLabel)
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
    render(<YamlToJsonConverterClient messages={messages} />)

    fireEvent.change(getYamlInput(), {
      target: { value: "   " },
    })

    const jsonOutput = getJsonOutput()

    expect(screen.queryByText(messages.invalidYamlLabel)).toBeNull()
    expect(jsonOutput.textContent).not.toContain(messages.jsonDescription)
    expect(jsonOutput.textContent).toContain(messages.jsonEmptyDescription)
    expect(jsonOutput.querySelector(".hljs")).toBeNull()
  })

  test("imports YAML from a selected file", async () => {
    render(<YamlToJsonConverterClient messages={messages} />)

    const file = new File(["name: demo"], "demo.yaml", {
      type: "application/yaml",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await waitFor(() => {
      expect(getYamlInput().value).toBe("name: demo")
    })

    const result = convertYamlToJsonText("name: demo")

    expect(getJsonOutput().textContent).toBe(
      result.state === "converted" ? result.json : ""
    )
  })

  test("restores the last stored input", () => {
    window.localStorage.setItem(STORAGE_KEYS.yamlText, "saved: true")

    render(<YamlToJsonConverterClient messages={messages} />)

    expect(getYamlInput().value).toBe("saved: true")

    const result = convertYamlToJsonText("saved: true")

    expect(getJsonOutput().textContent).toBe(
      result.state === "converted" ? result.json : ""
    )
  })

  test("persists edits to local storage", () => {
    render(<YamlToJsonConverterClient messages={messages} />)

    fireEvent.change(getYamlInput(), {
      target: { value: "persisted: true" },
    })

    expect(window.localStorage.getItem(STORAGE_KEYS.yamlText)).toBe(
      "persisted: true"
    )
  })

  test("revokes the previous download URL when output becomes invalid", () => {
    render(<YamlToJsonConverterClient messages={messages} />)

    fireEvent.change(getYamlInput(), {
      target: { value: "items: [1, 2" },
    })

    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:converted-json")
  })
})
