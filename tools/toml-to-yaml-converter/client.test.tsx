import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import TomlToYamlConverterClient from "./client"
import { convertTomlToYamlText } from "./core/convert-toml-to-yaml"

const messages = {
  meta: {
    name: "TOML to YAML Converter",
    description:
      "Convert TOML to YAML. Paste TOML or import a file; preview, copy, and download.",
  },
  importFromFileLabel: "Import from file",
  downloadYamlLabel: "Download YAML",
  tomlLabel: "TOML",
  tomlDescription:
    "Paste TOML directly or import a .toml or .txt file from this device.",
  yamlLabel: "YAML",
  yamlDescription:
    "YAML output updates as soon as the input contains valid TOML.",
  yamlEmptyDescription:
    "Paste valid TOML on the left to preview the converted YAML here.",
  tomlPlaceholder: "Paste TOML here...",
  invalidTomlLabel: "Invalid TOML",
  copyYamlLabel: "Copy YAML",
  copiedLabel: "Copied",
} as const

const STORAGE_KEYS = {
  tomlText: "tools:toml-to-yaml-converter:toml-text",
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

function getTomlInput() {
  return screen.getByRole("textbox", {
    name: messages.tomlLabel,
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

describe("TomlToYamlConverterClient", () => {
  test("renders the default example and its converted YAML output", () => {
    render(<TomlToYamlConverterClient messages={messages} />)

    const tomlInput = getTomlInput()
    const yamlOutput = getYamlOutput()
    const result = convertTomlToYamlText(tomlInput.value)

    expect(screen.getByText(messages.tomlDescription)).toBeTruthy()
    expect(screen.getByText(messages.yamlDescription)).toBeTruthy()
    expect(tomlInput.value).toContain('title = "TOML Example"')
    expect(yamlOutput.textContent).toBe(
      result.state === "converted" ? result.yaml : ""
    )
    expect(yamlOutput.querySelector(".hljs")).toBeTruthy()
    expect(URL.createObjectURL).toHaveBeenCalled()
  })

  test("shows an error for invalid TOML and disables export actions", () => {
    render(<TomlToYamlConverterClient messages={messages} />)

    fireEvent.change(getTomlInput(), {
      target: { value: "[" },
    })

    const yamlOutput = getYamlOutput()
    const outputAlert = within(yamlOutput).getByRole("alert")
    const invalidResult = convertTomlToYamlText("[")

    expect(outputAlert.textContent).toContain(messages.invalidTomlLabel)
    expect(outputAlert.textContent).toContain(
      invalidResult.state === "error" ? invalidResult.message : ""
    )
    expect(yamlOutput.querySelector(".hljs")).toBeNull()
    expect(
      screen.getByRole("button", { name: messages.copyYamlLabel })
    ).toHaveProperty("disabled", true)
    expect(
      screen.getByRole("button", { name: messages.downloadYamlLabel })
    ).toHaveProperty("disabled", true)
  })

  test("clears the error state and output when the input is empty", () => {
    render(<TomlToYamlConverterClient messages={messages} />)

    fireEvent.change(getTomlInput(), {
      target: { value: "   " },
    })

    const yamlOutput = getYamlOutput()

    expect(screen.queryByText(messages.invalidTomlLabel)).toBeNull()
    expect(yamlOutput.textContent).not.toContain(messages.yamlDescription)
    expect(yamlOutput.textContent).toContain(messages.yamlEmptyDescription)
    expect(yamlOutput.querySelector(".hljs")).toBeNull()
  })

  test("imports TOML from a selected file", async () => {
    render(<TomlToYamlConverterClient messages={messages} />)

    const file = new File(['name = "demo"'], "demo.toml", {
      type: "application/toml",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await waitFor(() => {
      expect(getTomlInput().value).toBe('name = "demo"')
    })

    expect(getYamlOutput().textContent).toBe("name: demo\n")
  })

  test("restores the last stored input", () => {
    window.localStorage.setItem(STORAGE_KEYS.tomlText, 'saved = "yes"')

    render(<TomlToYamlConverterClient messages={messages} />)

    expect(getTomlInput().value).toBe('saved = "yes"')

    const result = convertTomlToYamlText('saved = "yes"')

    expect(getYamlOutput().textContent).toBe(
      result.state === "converted" ? result.yaml : ""
    )
  })

  test("persists edits to local storage", () => {
    render(<TomlToYamlConverterClient messages={messages} />)

    fireEvent.change(getTomlInput(), {
      target: { value: "persisted = true" },
    })

    expect(window.localStorage.getItem(STORAGE_KEYS.tomlText)).toBe(
      "persisted = true"
    )
  })

  test("revokes the previous download URL when output becomes invalid", () => {
    render(<TomlToYamlConverterClient messages={messages} />)

    fireEvent.change(getTomlInput(), {
      target: { value: "[" },
    })

    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:converted-yaml")
  })
})
