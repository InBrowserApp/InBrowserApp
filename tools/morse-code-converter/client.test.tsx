import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test } from "vitest"

import MorseCodeConverterClient from "./client"

const messages = {
  meta: {
    name: "Morse Code Converter",
    description:
      "Convert text to Morse code and back with browser-side playback.",
  },
  resultTitle: "Live result",
  resultDescription: "Review normalized text, Morse output, and playback.",
  textLabel: "Text",
  morseCodeLabel: "Morse Code",
  textPlaceholder: "Enter text to convert to Morse code",
  morsePlaceholder: "Enter Morse code (dots and dashes, / for word separator)",
  validLabel: "Valid Morse code",
  invalidLabel: "Invalid Morse code",
  invalidMorseCode: "Invalid Morse code",
  unsupportedTextMessage:
    "Only letters, digits, spaces, and common punctuation can be encoded.",
  loadSample: "Load sample",
  clearLabel: "Clear",
  copyLabel: "Copy",
  copiedLabel: "Copied",
  play: "Play",
  stop: "Stop",
} as const

describe("MorseCodeConverterClient", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

  test("renders the default sample state", () => {
    render(<MorseCodeConverterClient messages={messages} />)

    expect(screen.getAllByDisplayValue("HELLO WORLD").length).toBe(1)
    expect(
      screen.getAllByDisplayValue(".... . .-.. .-.. --- / .-- --- .-. .-.. -..")
        .length
    ).toBe(1)
    expect(screen.getByText(messages.validLabel)).toBeTruthy()
  })

  test("converts text input into morse code", async () => {
    render(<MorseCodeConverterClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.textLabel), {
      target: { value: "SOS" },
    })

    await waitFor(() => {
      expect(
        (screen.getByLabelText(messages.morseCodeLabel) as HTMLTextAreaElement)
          .value
      ).toBe("... --- ...")
    })
  })

  test("converts morse input into text", async () => {
    render(<MorseCodeConverterClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.morseCodeLabel), {
      target: { value: ".... .." },
    })

    await waitFor(() => {
      expect(
        (screen.getByLabelText(messages.textLabel) as HTMLTextAreaElement).value
      ).toBe("HI")
    })
  })

  test("shows invalid morse validation errors", async () => {
    render(<MorseCodeConverterClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.morseCodeLabel), {
      target: { value: ".... .. ......" },
    })

    await waitFor(() => {
      expect(screen.getAllByText(messages.invalidMorseCode).length).toBe(1)
    })
  })

  test("shows an error when text cannot be encoded at all", async () => {
    render(<MorseCodeConverterClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.textLabel), {
      target: { value: "🙂🙂" },
    })

    await waitFor(() => {
      expect(screen.getByText(messages.unsupportedTextMessage)).toBeTruthy()
    })
  })

  test("restores saved inputs and source from localStorage", async () => {
    window.localStorage.setItem(
      "tools:morse-code-converter:text-input",
      "HELLO"
    )
    window.localStorage.setItem(
      "tools:morse-code-converter:morse-input",
      ".... . .-.. .-.. ---"
    )
    window.localStorage.setItem(
      "tools:morse-code-converter:active-source",
      "morse"
    )

    render(<MorseCodeConverterClient messages={messages} />)

    await waitFor(() => {
      expect(
        (screen.getByLabelText(messages.textLabel) as HTMLTextAreaElement).value
      ).toBe("HELLO")
    })

    expect(
      (screen.getByLabelText(messages.morseCodeLabel) as HTMLTextAreaElement)
        .value
    ).toBe(".... . .-.. .-.. ---")
  })

  test("supports sample and clear actions", async () => {
    render(<MorseCodeConverterClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: messages.clearLabel }))

    await waitFor(() => {
      expect(
        (screen.getByLabelText(messages.textLabel) as HTMLTextAreaElement).value
      ).toBe("")
    })

    fireEvent.click(screen.getByRole("button", { name: messages.loadSample }))

    await waitFor(() => {
      expect(
        (screen.getByLabelText(messages.textLabel) as HTMLTextAreaElement).value
      ).toBe("HELLO WORLD")
    })
  })
})
