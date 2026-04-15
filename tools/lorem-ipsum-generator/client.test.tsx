import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import LoremIpsumGeneratorClient from "./client"

const messages = {
  meta: {
    name: "Lorem Ipsum Generator",
    description: "Generate placeholder text with multiple output modes.",
  },
  optionsTitle: "Options",
  wordsLabel: "Words",
  sentencesLabel: "Sentences",
  paragraphsLabel: "Paragraphs",
  countLabel: "Count",
  localeLabel: "Locale",
  resultsTitle: "Results",
  resultsPlaceholder: "Generated text will appear here...",
  copyResultsLabel: "Copy result",
  copiedLabel: "Copied",
  downloadResultsLabel: "Download",
  regenerateLabel: "Regenerate",
} as const

beforeEach(() => {
  const NativeURL = globalThis.URL

  class MockURL extends NativeURL {}

  Object.assign(MockURL, {
    createObjectURL: vi.fn(() => "blob:lorem-ipsum-results"),
    revokeObjectURL: vi.fn(),
  })

  vi.stubGlobal("URL", MockURL)
  window.localStorage.clear()
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function getResultsTextarea() {
  return screen.getByLabelText(messages.resultsTitle) as HTMLTextAreaElement
}

describe("LoremIpsumGeneratorClient", () => {
  test("renders the default paragraphs batch and download link", async () => {
    render(<LoremIpsumGeneratorClient messages={messages} />)

    expect(screen.getByLabelText(messages.countLabel)).toHaveProperty(
      "value",
      "3"
    )

    await waitFor(() => {
      expect(getResultsTextarea().value).toContain("\n\n")
    })

    expect(
      screen.getByRole("link", { name: messages.downloadResultsLabel })
    ).toHaveProperty("download", "lorem-ipsum-paragraphs-3-en.txt")
  })

  test("updates output when mode and count change", async () => {
    render(<LoremIpsumGeneratorClient messages={messages} />)

    await waitFor(() => {
      expect(getResultsTextarea().value).not.toBe("")
    })

    const previousOutput = getResultsTextarea().value

    fireEvent.click(screen.getByRole("radio", { name: messages.wordsLabel }))
    fireEvent.change(screen.getByLabelText(messages.countLabel), {
      target: { value: "5" },
    })

    await waitFor(() => {
      expect(getResultsTextarea().value).not.toBe(previousOutput)
      expect(getResultsTextarea().value).not.toContain("\n\n")
    })

    expect(
      screen.getByRole("link", { name: messages.downloadResultsLabel })
    ).toHaveProperty("download", "lorem-ipsum-words-5-en.txt")
  })

  test("restores saved settings from localStorage", async () => {
    window.localStorage.setItem("tools:lorem-ipsum-generator:mode", "sentences")
    window.localStorage.setItem("tools:lorem-ipsum-generator:count", "4")
    window.localStorage.setItem("tools:lorem-ipsum-generator:locale", "ja")

    render(<LoremIpsumGeneratorClient messages={messages} />)

    await waitFor(() => {
      expect(screen.getByLabelText(messages.countLabel)).toHaveProperty(
        "value",
        "4"
      )
      expect(
        screen.getByRole("radio", { name: messages.sentencesLabel })
      ).toHaveProperty("dataset.state", "on")
    })

    expect(
      screen.getByRole("combobox", { name: messages.localeLabel }).textContent
    ).toContain("日本語")
    expect(
      screen.getByRole("link", { name: messages.downloadResultsLabel })
    ).toHaveProperty("download", "lorem-ipsum-sentences-4-ja.txt")
  })

  test("regenerates a fresh batch on demand", async () => {
    render(<LoremIpsumGeneratorClient messages={messages} />)

    await waitFor(() => {
      expect(getResultsTextarea().value).not.toBe("")
    })

    const previousOutput = getResultsTextarea().value

    fireEvent.click(
      screen.getByRole("button", { name: messages.regenerateLabel })
    )

    await waitFor(() => {
      expect(getResultsTextarea().value).not.toBe(previousOutput)
    })
  })
})
