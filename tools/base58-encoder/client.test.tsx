import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import Base58EncoderClient from "./client"
import { encodeBase58, getBase58Alphabet } from "./core/base58"

const encoder = new TextEncoder()
const messages = {
  meta: {
    name: "Base58 Encoder",
    description:
      "Encode text or files to Base58 for data transport, storage, and web development.",
  },
  options: "Options",
  alphabet: "Alphabet",
  alphabetBitcoin: "Bitcoin",
  alphabetFlickr: "Flickr",
  alphabetRipple: "Ripple (XRP)",
  inputTitle: "Input",
  inputPlaceholder: "Enter text to encode...",
  outputTitle: "Base58 Encoded",
  outputPlaceholder: "Base58 output will appear here...",
  download: "Download Base58",
  readFailed: "Failed to read file",
  loadSample: "Load sample",
  clearLabel: "Clear",
  copyLabel: "Copy",
  copiedLabel: "Copied",
  importFromFileLabel: "Import from file",
} as const

const STORAGE_KEYS = {
  alphabet: "tools:base58-encoder:alphabet",
  text: "tools:base58-encoder:text",
} as const

beforeEach(() => {
  const NativeURL = globalThis.URL

  class MockURL extends NativeURL {}

  Object.assign(MockURL, {
    createObjectURL: vi.fn(() => "blob:base58-output"),
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

function getInputTextarea() {
  return screen.getByRole("textbox", {
    name: messages.inputTitle,
  }) as HTMLTextAreaElement
}

function getOutputTextarea() {
  return screen.getByRole("textbox", {
    name: messages.outputTitle,
  }) as HTMLTextAreaElement
}

function selectAlphabet(option: string) {
  fireEvent.click(screen.getByRole("combobox", { name: messages.alphabet }))
  fireEvent.click(screen.getByRole("option", { name: option }))
}

describe("Base58EncoderClient", () => {
  test("renders the default example and encoded output", async () => {
    render(<Base58EncoderClient messages={messages} />)

    expect(getInputTextarea().value).toBe("Hello World")

    await waitFor(() => {
      expect(getOutputTextarea().value).toBe("JxF12TrwUP45BMd")
    })

    expect(URL.createObjectURL).toHaveBeenCalled()
  })

  test("updates the output when the alphabet changes", async () => {
    render(<Base58EncoderClient messages={messages} />)

    selectAlphabet(messages.alphabetFlickr)

    await waitFor(() => {
      expect(getOutputTextarea().value).toBe(
        encodeBase58(encoder.encode("Hello World"), {
          alphabet: getBase58Alphabet("flickr"),
        })
      )
    })
  })

  test("imports a file and encodes its contents", async () => {
    render(<Base58EncoderClient messages={messages} />)

    const file = new File(["Hello World"], "hello.txt", {
      type: "text/plain",
    })

    fireEvent.change(document.querySelector('input[type="file"]')!, {
      target: { files: [file] },
    })

    await waitFor(() => {
      expect(screen.getByText("hello.txt")).toBeTruthy()
    })

    expect(await screen.findByDisplayValue("JxF12TrwUP45BMd")).toBeTruthy()
    expect(
      screen.getByRole("link", { name: messages.download })
    ).toHaveProperty("download", "hello.b58")
  })

  test("clears the text and output", async () => {
    render(<Base58EncoderClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: messages.clearLabel }))

    await waitFor(() => {
      expect(
        screen.queryByRole("textbox", { name: messages.outputTitle })
      ).toBeNull()
    })

    expect(screen.getByText(messages.outputPlaceholder)).toBeTruthy()
    expect(
      screen.getByRole("button", { name: messages.download })
    ).toHaveProperty("disabled", true)
  })

  test("restores stored text and alphabet", async () => {
    window.localStorage.setItem(STORAGE_KEYS.text, "stored value")
    window.localStorage.setItem(STORAGE_KEYS.alphabet, "ripple")

    render(<Base58EncoderClient messages={messages} />)

    await waitFor(() => {
      expect(getInputTextarea().value).toBe("stored value")
    })

    expect(
      screen.getByRole("combobox", { name: messages.alphabet }).textContent
    ).toContain(messages.alphabetRipple)

    await waitFor(() => {
      expect(getOutputTextarea().value).toBe(
        encodeBase58(encoder.encode("stored value"), {
          alphabet: getBase58Alphabet("ripple"),
        })
      )
    })
  })

  test("persists text and alphabet changes", async () => {
    render(<Base58EncoderClient messages={messages} />)

    fireEvent.change(getInputTextarea(), {
      target: { value: "persist me" },
    })
    selectAlphabet(messages.alphabetFlickr)

    await waitFor(() => {
      expect(window.localStorage.getItem(STORAGE_KEYS.text)).toBe("persist me")
      expect(window.localStorage.getItem(STORAGE_KEYS.alphabet)).toBe("flickr")
    })
  })

  test("shows a file read error", async () => {
    render(<Base58EncoderClient messages={messages} />)

    const file = new File(["broken"], "broken.txt", {
      type: "text/plain",
    })

    Object.defineProperty(file, "arrayBuffer", {
      value: () => Promise.reject(new Error("broken")),
    })

    fireEvent.change(document.querySelector('input[type="file"]')!, {
      target: { files: [file] },
    })

    expect(await screen.findByText(messages.readFailed)).toBeTruthy()
  })

  test("reloads the sample text", async () => {
    render(<Base58EncoderClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: messages.clearLabel }))
    fireEvent.click(screen.getByRole("button", { name: messages.loadSample }))

    await waitFor(() => {
      expect(getInputTextarea().value).toBe("Hello World")
      expect(getOutputTextarea().value).toBe("JxF12TrwUP45BMd")
    })
  })
})
