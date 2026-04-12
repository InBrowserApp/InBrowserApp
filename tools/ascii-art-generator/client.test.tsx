import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import * as asciiArt from "./core/ascii-art"
import AsciiArtGeneratorClient from "./client"

const messages = {
  meta: {
    name: "ASCII Art Generator",
    description: "Turn short text into browser-rendered ASCII banners.",
  },
  inputTitle: "Draft a banner in ASCII",
  inputDescription:
    "Paste one or more short lines, then switch fonts and alignment for a browser-only banner preview.",
  inputPlaceholder: "Type a headline, label, release note, or terminal banner…",
  loadSample: "Load sample",
  clearText: "Clear text",
  optionsTitle: "Banner settings",
  optionsDescription:
    "Pick a font family, nudge the alignment, and set the target width for the output block.",
  fontLabel: "Font",
  alignLabel: "Alignment",
  widthLabel: "Target width",
  widthHint: "Clamped between 40 and 160 columns.",
  leftAlign: "Left",
  centerAlign: "Center",
  rightAlign: "Right",
  metricsTitle: "Banner snapshot",
  metricsDescription:
    "Quick sizing details before you paste the block into docs, terminals, or README files.",
  fontMetric: "Font",
  alignMetric: "Alignment",
  widthMetric: "Width",
  linesMetric: "Lines",
  widestLineMetric: "Widest line",
  charactersMetric: "Characters",
  outputTitle: "ASCII output",
  outputDescription:
    "Copy the block as plain text or download it when the layout feels right.",
  outputEmptyTitle: "Add text to render a banner",
  outputEmptyDescription:
    "Each non-empty line becomes a FIGlet-style block, and blank lines stay blank so multi-line layouts are easy to stage.",
  renderingLabel: "Rendering banner…",
  renderErrorTitle: "Could not render this banner",
  copyLabel: "Copy ASCII art",
  copiedLabel: "Copied",
  downloadLabel: "Download .txt",
} as const

beforeEach(() => {
  const NativeURL = globalThis.URL

  class MockURL extends NativeURL {}

  Object.assign(MockURL, {
    createObjectURL: vi.fn(() => "blob:ascii-art"),
    revokeObjectURL: vi.fn(),
  })

  vi.stubGlobal("URL", MockURL)
})

afterEach(() => {
  cleanup()
  window.localStorage.clear()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe("AsciiArtGeneratorClient", () => {
  test("renders the empty state by default", () => {
    render(<AsciiArtGeneratorClient messages={messages} />)

    expect(
      (screen.getByLabelText(messages.inputTitle) as HTMLTextAreaElement).value
    ).toBe("")
    expect(screen.getByText(messages.outputEmptyTitle)).toBeTruthy()
    expect(
      screen.getByRole("button", { name: messages.downloadLabel })
    ).toHaveProperty("disabled", true)
  })

  test("loads sample text and renders downloadable output", async () => {
    render(<AsciiArtGeneratorClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: messages.loadSample }))

    await waitFor(() => {
      expect(
        (screen.getByLabelText(messages.outputTitle) as HTMLTextAreaElement)
          .value.length
      ).toBeGreaterThan(0)
    })

    expect(URL.createObjectURL).toHaveBeenCalled()
    expect(
      screen.getByRole("link", { name: messages.downloadLabel })
    ).toBeTruthy()
  })

  test("restores and persists local storage values", async () => {
    window.localStorage.setItem(
      "tools:ascii-art-generator:text",
      "Stored banner"
    )
    window.localStorage.setItem(
      "tools:ascii-art-generator:options",
      JSON.stringify({
        font: "Small",
        align: "right",
        width: 72,
      })
    )

    render(<AsciiArtGeneratorClient messages={messages} />)

    await waitFor(() => {
      expect(
        (screen.getByLabelText(messages.inputTitle) as HTMLTextAreaElement)
          .value
      ).toBe("Stored banner")
    })

    fireEvent.change(screen.getByLabelText(messages.widthLabel), {
      target: { value: "64" },
    })

    await waitFor(() => {
      expect(
        window.localStorage.getItem("tools:ascii-art-generator:options")
      ).toContain('"width":64')
    })
  })

  test("updates font and alignment controls", async () => {
    render(<AsciiArtGeneratorClient messages={messages} />)

    fireEvent.click(screen.getByRole("combobox", { name: messages.fontLabel }))
    fireEvent.click(screen.getByRole("option", { name: "Small" }))
    fireEvent.click(screen.getByRole("combobox", { name: messages.alignLabel }))
    fireEvent.click(screen.getByRole("option", { name: messages.rightAlign }))

    await waitFor(() => {
      const storedOptions = window.localStorage.getItem(
        "tools:ascii-art-generator:options"
      )

      expect(storedOptions).toContain('"font":"Small"')
      expect(storedOptions).toContain('"align":"right"')
    })
  })

  test("clears the current text and revokes the previous download URL", async () => {
    render(<AsciiArtGeneratorClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: messages.loadSample }))

    await waitFor(() => {
      expect(
        (screen.getByLabelText(messages.outputTitle) as HTMLTextAreaElement)
          .value.length
      ).toBeGreaterThan(0)
    })

    fireEvent.click(screen.getByRole("button", { name: messages.clearText }))

    await waitFor(() => {
      expect(
        (screen.getByLabelText(messages.inputTitle) as HTMLTextAreaElement)
          .value
      ).toBe("")
    })

    expect(screen.getByText(messages.outputEmptyTitle)).toBeTruthy()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:ascii-art")
  })

  test("shows an error alert when rendering fails", async () => {
    vi.spyOn(asciiArt, "renderAsciiArt").mockImplementation(() => {
      throw new Error("boom")
    })

    render(<AsciiArtGeneratorClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.inputTitle), {
      target: { value: "Crash" },
    })

    await waitFor(() => {
      expect(screen.getByText(messages.renderErrorTitle)).toBeTruthy()
    })

    expect(screen.getByText("boom")).toBeTruthy()
  })
})
