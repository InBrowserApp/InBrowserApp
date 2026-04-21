import { createHash } from "node:crypto"

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test } from "vitest"

import Shake128HashTextOrFileClient from "./client"

const messages = {
  meta: {
    name: "SHAKE128 (FIPS 202) Hash Text or File",
    description:
      "Generate SHAKE128 (FIPS 202) digests directly in your browser.",
  },
  inputLabel: "Input",
  plainTextLabel: "Plain text",
  plainTextDescription:
    "Paste or type any UTF-8 text, including emoji and non-Latin characters.",
  importFromFileLabel: "Import from file",
  outputLengthLabel: "Output Length",
  outputLengthPlaceholder: "e.g. 256 (bits)",
  outputLengthInvalid: "Enter a multiple of 8 between 8 and 65536.",
  hashTextError: "Failed to hash text.",
  hashFileError: "Failed to hash file.",
  hashResultLabel: "Hash Result",
  hashResultDescription: "Hash result for the current text input.",
  hexLabel: "Hexadecimal",
  base64Label: "Base64",
  decimalLabel: "Decimal",
  binaryLabel: "Binary",
  copyResultLabel: "Copy result",
  copiedLabel: "Copied",
} as const

const STORAGE_KEY = "tools:shake128-hash-text-or-file:text"

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(cleanup)

function getPlainTextInput() {
  return screen.getByRole("textbox", {
    name: messages.plainTextLabel,
  }) as HTMLTextAreaElement
}

function getOutputLengthInput() {
  return screen.getByRole("textbox", {
    name: messages.outputLengthLabel,
  }) as HTMLInputElement
}

function getFileInput() {
  return document.querySelector('input[type="file"]') as HTMLInputElement
}

function shake128Hex(input: string, outputBits = 256) {
  return createHash("shake128", {
    outputLength: outputBits / 8,
  })
    .update(input)
    .digest("hex")
}

describe("Shake128HashTextOrFileClient", () => {
  test("renders the default example and its digest", async () => {
    render(<Shake128HashTextOrFileClient messages={messages} />)

    expect(getPlainTextInput().value).toBe("Hello, browser-native world!")
    expect(getOutputLengthInput().value).toBe("256")
    expect(screen.getByText(messages.hashResultDescription)).toBeTruthy()

    expect(
      await screen.findByText(shake128Hex("Hello, browser-native world!"))
    ).toBeTruthy()
  })

  test("updates the digest when the output length changes", async () => {
    render(<Shake128HashTextOrFileClient messages={messages} />)

    fireEvent.change(getOutputLengthInput(), {
      target: { value: "512" },
    })

    expect(
      await screen.findByText(shake128Hex("Hello, browser-native world!", 512))
    ).toBeTruthy()
  })

  test("shows validation feedback for an invalid output length", async () => {
    render(<Shake128HashTextOrFileClient messages={messages} />)

    fireEvent.change(getOutputLengthInput(), {
      target: { value: "7" },
    })

    const errors = await screen.findAllByText(messages.outputLengthInvalid)
    expect(errors).toHaveLength(2)
  })

  test("imports a file and renders its digest", async () => {
    render(<Shake128HashTextOrFileClient messages={messages} />)

    const file = new File(["hello from file"], "demo.txt", {
      type: "text/plain",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await waitFor(() => {
      expect(screen.getByText("demo.txt")).toBeTruthy()
    })

    expect(
      screen.queryByRole("textbox", { name: messages.plainTextLabel })
    ).toBeNull()
    expect(await screen.findByText(shake128Hex("hello from file"))).toBeTruthy()
  })

  test("switches back to text mode after importing a file", async () => {
    render(<Shake128HashTextOrFileClient messages={messages} />)

    const file = new File(["hello from file"], "demo.txt", {
      type: "text/plain",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await screen.findByText(shake128Hex("hello from file"))

    fireEvent.click(
      screen.getByRole("button", { name: messages.plainTextLabel })
    )

    expect(getPlainTextInput().value).toBe("Hello, browser-native world!")
    expect(
      await screen.findByText(shake128Hex("Hello, browser-native world!"))
    ).toBeTruthy()
  })

  test("restores the last stored text value", async () => {
    window.localStorage.setItem(STORAGE_KEY, "stored value")

    render(<Shake128HashTextOrFileClient messages={messages} />)

    await waitFor(() => {
      expect(getPlainTextInput().value).toBe("stored value")
    })

    expect(await screen.findByText(shake128Hex("stored value"))).toBeTruthy()
  })

  test("shows a localized fallback error when hashing fails", async () => {
    const originalArrayBuffer = Blob.prototype.arrayBuffer

    Blob.prototype.arrayBuffer = () =>
      Promise.reject(new Error("simulated failure"))

    try {
      render(<Shake128HashTextOrFileClient messages={messages} />)

      expect(await screen.findByText(messages.hashTextError)).toBeTruthy()
    } finally {
      Blob.prototype.arrayBuffer = originalArrayBuffer
    }
  })

  test("persists plain text edits to local storage", () => {
    render(<Shake128HashTextOrFileClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "persist me" },
    })

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("persist me")
  })
})
