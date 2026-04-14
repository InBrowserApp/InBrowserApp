import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

vi.mock("./client/font-loader", () => ({
  fontNames: ["Banner", "Standard", "Slant"],
  loadFont: vi.fn(async () => {}),
}))

vi.mock("./core/generate-ascii-art", () => {
  const DEFAULT_OPTIONS = {
    font: "Standard",
    align: "left",
    width: 100,
  } as const

  return {
    DEFAULT_OPTIONS,
    normalizeAsciiArtOptions: (
      options: Partial<{
        font: string
        align: string
        width: number | string
      }> = {}
    ) => ({
      font: options.font?.trim() || DEFAULT_OPTIONS.font,
      align:
        options.align === "center" || options.align === "right"
          ? options.align
          : DEFAULT_OPTIONS.align,
      width:
        typeof options.width === "number"
          ? Math.min(160, Math.max(40, Math.round(options.width)))
          : typeof options.width === "string" && options.width.trim()
            ? Math.min(
                160,
                Math.max(40, Math.round(Number.parseInt(options.width, 10)))
              )
            : DEFAULT_OPTIONS.width,
    }),
    renderAsciiArt: (
      text: string,
      options: {
        font?: string
        align?: string
        width?: number
      } = DEFAULT_OPTIONS
    ) =>
      text.trim()
        ? `[${options.font}|${options.align}|${options.width}] ${text}`
        : "",
  }
})

// eslint-disable-next-line import/first -- mocks must be set up before import
import AsciiArtGeneratorClient from "./client"
import { STORAGE_KEYS } from "./client/constants"

const messages = {
  meta: {
    name: "ASCII Art Generator",
    description: "Convert text to ASCII art.",
  },
  inputLabel: "Input text",
  inputDescription: "Type a word or phrase to turn into ASCII art.",
  inputPlaceholder: "Enter text to convert...",
  loadSample: "Load sample",
  clearText: "Clear text",
  fontLabel: "Font",
  fontDescription: "Pick a FIGlet font style for the output.",
  optionsLabel: "Layout options",
  optionsDescription: "Control alignment and banner width.",
  alignLabel: "Alignment",
  widthLabel: "Width",
  widthHint: "Clamped between 40 and 160 columns.",
  leftAlign: "Left",
  centerAlign: "Center",
  rightAlign: "Right",
  outputLabel: "ASCII art output",
  outputPlaceholder: "ASCII art will appear here...",
  downloadLabel: "Download .txt",
  copyLabel: "Copy",
  copiedLabel: "Copied",
} as const

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(cleanup)

describe("AsciiArtGeneratorClient", () => {
  test("renders placeholder output before text is entered", () => {
    render(<AsciiArtGeneratorClient messages={messages} />)

    expect(
      screen.getByRole("region", {
        name: messages.outputLabel,
      }).textContent
    ).toContain(messages.outputPlaceholder)
  })

  test("renders generated output when text changes", async () => {
    render(<AsciiArtGeneratorClient messages={messages} />)

    fireEvent.change(
      screen.getByRole("textbox", { name: messages.inputLabel }),
      { target: { value: "Ship" } }
    )

    await waitFor(() => {
      expect(
        screen.getByRole("region", {
          name: messages.outputLabel,
        }).textContent
      ).toContain("[Standard|left|100] Ship")
    })
  })

  test("loads the sample text and clears it again", async () => {
    render(<AsciiArtGeneratorClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: messages.loadSample }))

    await waitFor(() => {
      expect(
        (
          screen.getByRole("textbox", {
            name: messages.inputLabel,
          }) as HTMLTextAreaElement
        ).value
      ).toBe("Launch notes\nship today")
    })

    fireEvent.click(screen.getByRole("button", { name: messages.clearText }))

    await waitFor(() => {
      expect(
        (
          screen.getByRole("textbox", {
            name: messages.inputLabel,
          }) as HTMLTextAreaElement
        ).value
      ).toBe("")
    })
  })

  test("restores persisted text and layout options", async () => {
    window.localStorage.setItem(STORAGE_KEYS.text, "Restored")
    window.localStorage.setItem(STORAGE_KEYS.font, "Slant")
    window.localStorage.setItem(STORAGE_KEYS.align, "right")
    window.localStorage.setItem(STORAGE_KEYS.width, "120")

    render(<AsciiArtGeneratorClient messages={messages} />)

    await waitFor(() => {
      expect(
        (
          screen.getByRole("textbox", {
            name: messages.inputLabel,
          }) as HTMLTextAreaElement
        ).value
      ).toBe("Restored")
      expect(
        screen.getByRole("region", {
          name: messages.outputLabel,
        }).textContent
      ).toContain("[Slant|right|120] Restored")
    })
  })

  test("persists text and width changes to localStorage", async () => {
    render(<AsciiArtGeneratorClient messages={messages} />)

    fireEvent.change(
      screen.getByRole("textbox", { name: messages.inputLabel }),
      { target: { value: "Saved" } }
    )
    fireEvent.change(
      screen.getByRole("spinbutton", { name: messages.widthLabel }),
      {
        target: { value: "44" },
      }
    )

    await waitFor(() => {
      expect(window.localStorage.getItem(STORAGE_KEYS.text)).toBe("Saved")
      expect(window.localStorage.getItem(STORAGE_KEYS.width)).toBe("44")
    })
  })
})
