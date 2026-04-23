import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import Base85EncoderClient from "./client"
import { encodeBase85 } from "./core/base85"

const encoder = new TextEncoder()
const DEFAULT_TEXT = "Base85 demo!"
const messages = {
  meta: {
    name: "Base85 Encoder",
    description:
      "Encode text or files to Base85 for data transport, storage, and web development.",
  },
  alphabet: "Alphabet",
  alphabetAscii85: "ASCII85",
  alphabetZ85: "Z85",
  inputTitle: "Input",
  inputPlaceholder: "Enter text to encode...",
  outputTitle: "Base85 Encoded",
  outputPlaceholder: "Base85 output will appear here...",
  download: "Download Base85",
  readFailed: "Failed to read file",
  invalidBase85: "Z85 requires the input length to be a multiple of 4 bytes.",
  loadSample: "Load sample",
  clearLabel: "Clear",
  copyLabel: "Copy",
  copiedLabel: "Copied",
  importFromFileLabel: "Import from file",
} as const

const STORAGE_KEYS = {
  alphabet: "tools:base85-encoder:alphabet",
  text: "tools:base85-encoder:text",
} as const

beforeEach(() => {
  const NativeURL = globalThis.URL

  class MockURL extends NativeURL {}

  Object.assign(MockURL, {
    createObjectURL: vi.fn(() => "blob:base85-output"),
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

describe("Base85EncoderClient", () => {
  test("renders the default example and encoded output", async () => {
    render(<Base85EncoderClient messages={messages} />)

    expect(getInputTextarea().value).toBe(DEFAULT_TEXT)

    await waitFor(() => {
      expect(getOutputTextarea().value).toBe(
        encodeBase85(encoder.encode(DEFAULT_TEXT))
      )
    })

    expect(URL.createObjectURL).toHaveBeenCalled()
  })

  test("updates the output when the alphabet changes", async () => {
    render(<Base85EncoderClient messages={messages} />)

    selectAlphabet(messages.alphabetZ85)

    await waitFor(() => {
      expect(getOutputTextarea().value).toBe(
        encodeBase85(encoder.encode(DEFAULT_TEXT), { variant: "z85" })
      )
    })
  })

  test("imports a file and encodes its contents", async () => {
    render(<Base85EncoderClient messages={messages} />)

    const file = new File(["HelloWorld!!"], "hello.txt", {
      type: "text/plain",
    })

    fireEvent.change(document.querySelector('input[type="file"]')!, {
      target: { files: [file] },
    })

    await waitFor(() => {
      expect(screen.getByText("hello.txt")).toBeTruthy()
    })

    expect(
      await screen.findByDisplayValue(
        encodeBase85(encoder.encode("HelloWorld!!"))
      )
    ).toBeTruthy()
    expect(
      screen.getByRole("link", { name: messages.download })
    ).toHaveProperty("download", "hello.a85")
  })

  test("clears the text and output", async () => {
    render(<Base85EncoderClient messages={messages} />)

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
    window.localStorage.setItem(STORAGE_KEYS.text, "HelloWorld!!")
    window.localStorage.setItem(STORAGE_KEYS.alphabet, "z85")

    render(<Base85EncoderClient messages={messages} />)

    await waitFor(() => {
      expect(getInputTextarea().value).toBe("HelloWorld!!")
    })

    expect(
      screen.getByRole("combobox", { name: messages.alphabet }).textContent
    ).toContain(messages.alphabetZ85)

    await waitFor(() => {
      expect(getOutputTextarea().value).toBe(
        encodeBase85(encoder.encode("HelloWorld!!"), { variant: "z85" })
      )
    })
  })

  test("persists text and alphabet changes", async () => {
    render(<Base85EncoderClient messages={messages} />)

    fireEvent.change(getInputTextarea(), {
      target: { value: DEFAULT_TEXT },
    })
    selectAlphabet(messages.alphabetZ85)

    await waitFor(() => {
      expect(window.localStorage.getItem(STORAGE_KEYS.text)).toBe(DEFAULT_TEXT)
      expect(window.localStorage.getItem(STORAGE_KEYS.alphabet)).toBe("z85")
    })
  })

  test("shows a file read error", async () => {
    render(<Base85EncoderClient messages={messages} />)

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

  test("shows a length error for Z85 input", async () => {
    render(<Base85EncoderClient messages={messages} />)

    fireEvent.change(getInputTextarea(), {
      target: { value: "abc" },
    })
    selectAlphabet(messages.alphabetZ85)

    expect(await screen.findByText(messages.invalidBase85)).toBeTruthy()
  })

  test("reloads the sample text", async () => {
    render(<Base85EncoderClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: messages.clearLabel }))
    fireEvent.click(screen.getByRole("button", { name: messages.loadSample }))

    await waitFor(() => {
      expect(getInputTextarea().value).toBe(DEFAULT_TEXT)
      expect(getOutputTextarea().value).toBe(
        encodeBase85(encoder.encode(DEFAULT_TEXT))
      )
    })
  })
})
