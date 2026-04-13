import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

// Mock the font-loader module to avoid import.meta.glob
vi.mock("./client/font-loader", () => ({
  fontNames: ["Banner", "Standard"],
  loadFont: vi.fn(async () => {}),
}))

// eslint-disable-next-line import/first -- mock must be set up before import
import AsciiArtGeneratorClient from "./client"

const messages = {
  meta: {
    name: "ASCII Art Generator",
    description: "Convert text to ASCII art.",
  },
  inputLabel: "Input text",
  inputPlaceholder: "Enter text to convert...",
  fontLabel: "Font",
  fontSearchPlaceholder: "Search fonts...",
  outputLabel: "ASCII art output",
  outputPlaceholder: "ASCII art will appear here...",
  copyLabel: "Copy",
  copiedLabel: "Copied",
} as const

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(cleanup)

describe("AsciiArtGeneratorClient", () => {
  test("renders with default text and generates output", async () => {
    render(<AsciiArtGeneratorClient messages={messages} />)

    const input = screen.getByRole("textbox", {
      name: messages.inputLabel,
    }) as HTMLInputElement

    expect(input.value).toBe("Hello")

    await waitFor(() => {
      const output = screen.getByRole("region", {
        name: messages.outputLabel,
      })
      expect(output.textContent!.length).toBeGreaterThan(0)
    })
  })

  test("updates output when text changes", async () => {
    render(<AsciiArtGeneratorClient messages={messages} />)

    await waitFor(() => {
      const output = screen.getByRole("region", {
        name: messages.outputLabel,
      })
      expect(output.textContent!.length).toBeGreaterThan(0)
    })

    fireEvent.change(
      screen.getByRole("textbox", { name: messages.inputLabel }),
      { target: { value: "Hi" } }
    )

    await waitFor(() => {
      const output = screen.getByRole("region", {
        name: messages.outputLabel,
      })
      expect(output.textContent!.length).toBeGreaterThan(0)
    })
  })

  test("persists text to localStorage", async () => {
    render(<AsciiArtGeneratorClient messages={messages} />)

    fireEvent.change(
      screen.getByRole("textbox", { name: messages.inputLabel }),
      { target: { value: "Saved" } }
    )

    expect(window.localStorage.getItem("tools:ascii-art-generator:text")).toBe(
      "Saved"
    )
  })

  test("restores text from localStorage", async () => {
    window.localStorage.setItem("tools:ascii-art-generator:text", "Restored")

    render(<AsciiArtGeneratorClient messages={messages} />)

    await waitFor(() => {
      const input = screen.getByRole("textbox", {
        name: messages.inputLabel,
      }) as HTMLInputElement
      expect(input.value).toBe("Restored")
    })
  })

  test("shows empty output for empty text", async () => {
    render(<AsciiArtGeneratorClient messages={messages} />)

    fireEvent.change(
      screen.getByRole("textbox", { name: messages.inputLabel }),
      { target: { value: "" } }
    )

    await waitFor(() => {
      const output = screen.getByRole("region", {
        name: messages.outputLabel,
      })
      expect(output.textContent).toBe("")
    })
  })
})
