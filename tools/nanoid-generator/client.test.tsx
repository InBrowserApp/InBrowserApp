import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import NanoidGeneratorClient from "./client"

const messages = {
  meta: {
    name: "NanoID Generator",
    description: "Generate URL-safe NanoIDs in the browser.",
  },
  optionsTitle: "Options",
  optionsDescription:
    "Choose how many IDs to generate and which alphabet to use.",
  countLabel: "Count",
  lengthLabel: "Length",
  alphabetPresetLabel: "Alphabet preset",
  customAlphabetLabel: "Custom alphabet",
  customAlphabetPlaceholder: "Enter a custom alphabet…",
  alphabetTooShort: "Alphabet must contain at least 2 unique characters.",
  alphabetDuplicate: "Alphabet must not contain duplicate characters.",
  alphabetUniqueLabel: "Unique characters",
  alphabetDuplicatesLabel: "Duplicate characters",
  alphabetNoDuplicatesLabel: "None",
  resultsTitle: "Results",
  resultsDescription: "Generated IDs update as you edit the options.",
  resultsPlaceholder: "Generated NanoIDs will appear here…",
  copyResultsLabel: "Copy NanoIDs",
  copiedLabel: "Copied",
  downloadResultsLabel: "Download TXT",
  regenerateLabel: "Regenerate",
  presetUrlSafe: "URL-safe",
  presetAlphanumeric: "Alphanumeric",
  presetLowercase: "Lowercase",
  presetUppercase: "Uppercase",
  presetNumbers: "Numbers",
  presetHexLowercase: "Hex lowercase",
  presetHexUppercase: "Hex uppercase",
  presetCustom: "Custom",
} as const

let byteOffset = 0

beforeEach(() => {
  byteOffset = 0

  const NativeURL = globalThis.URL

  class MockURL extends NativeURL {}

  Object.assign(MockURL, {
    createObjectURL: vi.fn(() => "blob:nanoid-results"),
    revokeObjectURL: vi.fn(),
  })

  vi.stubGlobal("URL", MockURL)
  window.localStorage.clear()

  vi.spyOn(globalThis.crypto, "getRandomValues").mockImplementation((array) => {
    const values = array as Uint8Array

    for (let index = 0; index < values.length; index += 1) {
      values[index] = (byteOffset + index) % 256
    }

    byteOffset = (byteOffset + values.length) % 256
    return array
  })
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function getResultsTextarea() {
  return screen.getByLabelText(messages.resultsTitle) as HTMLTextAreaElement
}

describe("NanoidGeneratorClient", () => {
  test("renders default options and generates five IDs", async () => {
    render(<NanoidGeneratorClient messages={messages} />)

    expect(screen.getByLabelText(messages.countLabel)).toHaveProperty(
      "value",
      "5"
    )
    expect(screen.getByLabelText(messages.lengthLabel)).toHaveProperty(
      "value",
      "21"
    )

    await waitFor(() => {
      const lines = getResultsTextarea().value.trim().split("\n")

      expect(lines).toHaveLength(5)
      expect(lines.every((value) => value.length === 21)).toBe(true)
    })

    expect(URL.createObjectURL).toHaveBeenCalled()
  })

  test("switches to the numeric alphabet preset", async () => {
    render(<NanoidGeneratorClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("combobox", { name: messages.alphabetPresetLabel })
    )
    fireEvent.click(
      screen.getByRole("option", { name: messages.presetNumbers })
    )

    await waitFor(() => {
      const lines = getResultsTextarea().value.trim().split("\n")

      expect(lines[0]).toMatch(/^[0-9]+$/u)
    })
  })

  test("shows an error and clears output for duplicate custom alphabets", async () => {
    render(<NanoidGeneratorClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("combobox", { name: messages.alphabetPresetLabel })
    )
    fireEvent.click(screen.getByRole("option", { name: messages.presetCustom }))

    const customAlphabetInput = screen.getByLabelText(
      messages.customAlphabetLabel
    ) as HTMLInputElement
    fireEvent.change(customAlphabetInput, { target: { value: "aab" } })

    await waitFor(() => {
      expect(screen.getByText(messages.alphabetDuplicate)).toBeTruthy()
      expect(getResultsTextarea().value).toBe("")
    })

    expect(
      screen.getByRole("button", { name: messages.downloadResultsLabel })
    ).toHaveProperty("disabled", true)
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:nanoid-results")
  })

  test("generates IDs from a custom alphabet after the error is fixed", async () => {
    render(<NanoidGeneratorClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("combobox", { name: messages.alphabetPresetLabel })
    )
    fireEvent.click(screen.getByRole("option", { name: messages.presetCustom }))

    const customAlphabetInput = screen.getByLabelText(
      messages.customAlphabetLabel
    ) as HTMLInputElement
    fireEvent.change(customAlphabetInput, { target: { value: "ab" } })

    await waitFor(() => {
      const output = getResultsTextarea().value.replace(/\n/g, "")

      expect(output).toMatch(/^[ab]+$/u)
    })
  })

  test("restores saved settings from localStorage", async () => {
    window.localStorage.setItem("tools:nanoid-generator:count", "2")
    window.localStorage.setItem("tools:nanoid-generator:length", "4")
    window.localStorage.setItem(
      "tools:nanoid-generator:alphabet-preset",
      "numbers"
    )

    render(<NanoidGeneratorClient messages={messages} />)

    await waitFor(() => {
      expect(screen.getByLabelText(messages.countLabel)).toHaveProperty(
        "value",
        "2"
      )
      expect(screen.getByLabelText(messages.lengthLabel)).toHaveProperty(
        "value",
        "4"
      )
    })

    const lines = getResultsTextarea().value.trim().split("\n")
    expect(lines).toHaveLength(2)
    expect(lines.every((value) => /^[0-9]{4}$/u.test(value))).toBe(true)
  })

  test("persists changed values to localStorage", async () => {
    render(<NanoidGeneratorClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.countLabel), {
      target: { value: "3" },
    })
    fireEvent.change(screen.getByLabelText(messages.lengthLabel), {
      target: { value: "8" },
    })

    await waitFor(() => {
      expect(window.localStorage.getItem("tools:nanoid-generator:count")).toBe(
        "3"
      )
      expect(window.localStorage.getItem("tools:nanoid-generator:length")).toBe(
        "8"
      )
    })
  })

  test("regenerates a fresh batch when the button is clicked", async () => {
    render(<NanoidGeneratorClient messages={messages} />)

    await waitFor(() => {
      expect(getResultsTextarea().value).not.toBe("")
    })

    const before = getResultsTextarea().value

    fireEvent.click(screen.getByText(messages.regenerateLabel))

    await waitFor(() => {
      expect(getResultsTextarea().value).not.toBe(before)
    })
  })

  test("exposes the generated NanoIDs as a downloadable text file", async () => {
    render(<NanoidGeneratorClient messages={messages} />)

    await waitFor(() => {
      expect(getResultsTextarea().value).not.toBe("")
    })

    const downloadLink = screen.getByRole("link", {
      name: messages.downloadResultsLabel,
    })

    expect(downloadLink.getAttribute("href")).toBe("blob:nanoid-results")
    expect(downloadLink.getAttribute("download")).toBe("nanoid-5x21.txt")
  })
})
