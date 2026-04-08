import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import YamlToTomlConverterClient from "./client"
import { convertYamlToTomlText } from "./core/convert-yaml-to-toml"

const messages = {
  meta: {
    name: "YAML to TOML Converter",
    description:
      "Convert YAML to TOML. Paste YAML or import a file; preview, copy, and download.",
  },
  importFromFileLabel: "Import from file",
  downloadTomlLabel: "Download TOML",
  yamlLabel: "YAML",
  yamlDescription:
    "Paste YAML directly or import a .yaml or .txt file from this device.",
  tomlLabel: "TOML",
  tomlDescription:
    "TOML output updates as soon as the input contains valid YAML.",
  tomlEmptyDescription:
    "Paste valid YAML on the left to preview the converted TOML here.",
  yamlPlaceholder: "Paste YAML here...",
  invalidYamlLabel: "Invalid YAML",
  copyTomlLabel: "Copy TOML",
  copiedLabel: "Copied",
} as const

const STORAGE_KEYS = {
  yamlText: "tools:yaml-to-toml-converter:yaml-text",
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

function getYamlInput() {
  return screen.getByRole("textbox", {
    name: messages.yamlLabel,
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

describe("YamlToTomlConverterClient", () => {
  test("renders the default example and its converted TOML output", () => {
    render(<YamlToTomlConverterClient messages={messages} />)

    const yamlInput = getYamlInput()
    const tomlOutput = getTomlOutput()
    const result = convertYamlToTomlText(yamlInput.value)

    expect(screen.getByText(messages.yamlDescription)).toBeTruthy()
    expect(screen.getByText(messages.tomlDescription)).toBeTruthy()
    expect(yamlInput.value).toContain("title: YAML Example")
    expect(tomlOutput.textContent).toBe(
      result.state === "converted" ? result.toml : ""
    )
    expect(tomlOutput.querySelector(".hljs")).toBeTruthy()
    expect(URL.createObjectURL).toHaveBeenCalled()
  })

  test("shows an error for invalid YAML and disables export actions", () => {
    render(<YamlToTomlConverterClient messages={messages} />)

    fireEvent.change(getYamlInput(), {
      target: { value: "items: [1, 2" },
    })

    const tomlOutput = getTomlOutput()
    const outputAlert = within(tomlOutput).getByRole("alert")
    const invalidResult = convertYamlToTomlText("items: [1, 2")

    expect(outputAlert.textContent).toContain(messages.invalidYamlLabel)
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
    render(<YamlToTomlConverterClient messages={messages} />)

    fireEvent.change(getYamlInput(), {
      target: { value: "   " },
    })

    const tomlOutput = getTomlOutput()

    expect(screen.queryByText(messages.invalidYamlLabel)).toBeNull()
    expect(tomlOutput.textContent).not.toContain(messages.tomlDescription)
    expect(tomlOutput.textContent).toContain(messages.tomlEmptyDescription)
    expect(tomlOutput.querySelector(".hljs")).toBeNull()
  })

  test("imports YAML from a selected file", async () => {
    render(<YamlToTomlConverterClient messages={messages} />)

    const file = new File(["name: demo"], "demo.yaml", {
      type: "application/yaml",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await waitFor(() => {
      expect(getYamlInput().value).toBe("name: demo")
    })

    const result = convertYamlToTomlText("name: demo")

    expect(getTomlOutput().textContent).toBe(
      result.state === "converted" ? result.toml : ""
    )
  })

  test("restores the last stored input", () => {
    window.localStorage.setItem(STORAGE_KEYS.yamlText, "saved: true")

    render(<YamlToTomlConverterClient messages={messages} />)

    expect(getYamlInput().value).toBe("saved: true")

    const result = convertYamlToTomlText("saved: true")

    expect(getTomlOutput().textContent).toBe(
      result.state === "converted" ? result.toml : ""
    )
  })

  test("persists edits to local storage", () => {
    render(<YamlToTomlConverterClient messages={messages} />)

    fireEvent.change(getYamlInput(), {
      target: { value: "persisted: true" },
    })

    expect(window.localStorage.getItem(STORAGE_KEYS.yamlText)).toBe(
      "persisted: true"
    )
  })

  test("revokes the previous download URL when output becomes invalid", () => {
    render(<YamlToTomlConverterClient messages={messages} />)

    fireEvent.change(getYamlInput(), {
      target: { value: "items: [1, 2" },
    })

    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:converted-toml")
  })
})
