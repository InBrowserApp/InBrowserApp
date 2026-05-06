import { webcrypto } from "node:crypto"

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import Ripemd128HashTextOrFileClient from "./client"

const messages = {
  meta: {
    name: "RIPEMD-128 Hash Text or File",
    description: "Generate RIPEMD-128 digests directly in your browser.",
  },
  inputLabel: "Input",
  plainTextLabel: "Plain text",
  plainTextDescription:
    "Paste or type any UTF-8 text, including emoji and non-Latin characters.",
  importFromFileLabel: "Import from file",
  hashResultLabel: "Hash Result",
  hashResultDescription: "Hash result for the current text input.",
  hexLabel: "Hexadecimal",
  base64Label: "Base64",
  decimalLabel: "Decimal",
  binaryLabel: "Binary",
  copyResultLabel: "Copy result",
  copiedLabel: "Copied",
  hashTextError: "Failed to hash text.",
  hashFileError: "Failed to hash file.",
} as const

const STORAGE_KEY = "tools:ripemd128-hash-text-or-file:text"
const EXPECTED_DIGESTS = {
  defaultText: "067dfce67d518d3f1315cbe2abaa40b5",
  test: "f1abb5083c9ff8a9dbbca9cd2b11fead",
  file: "f274568310ce60f4d0d2f5568a70c68f",
  stored: "a1d882824fcfbbf0f64af158a48fc0a9",
} as const

beforeEach(() => {
  vi.stubGlobal("crypto", webcrypto)
  window.localStorage.clear()
})

afterEach(cleanup)

function getPlainTextInput() {
  return screen.getByRole("textbox", {
    name: messages.plainTextLabel,
  }) as HTMLTextAreaElement
}

function getFileInput() {
  return document.querySelector('input[type="file"]') as HTMLInputElement
}

describe("Ripemd128HashTextOrFileClient", () => {
  test("renders the default example and its digest", async () => {
    render(<Ripemd128HashTextOrFileClient messages={messages} />)

    expect(getPlainTextInput().value).toBe("Hello, browser-native world!")
    expect(screen.getByText(messages.hashResultDescription)).toBeTruthy()
    expect(await screen.findByText(EXPECTED_DIGESTS.defaultText)).toBeTruthy()
  })

  test("updates the text digest when the input changes", async () => {
    render(<Ripemd128HashTextOrFileClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "test" },
    })

    expect(await screen.findByText(EXPECTED_DIGESTS.test)).toBeTruthy()
  })

  test("imports a file and renders its digest", async () => {
    render(<Ripemd128HashTextOrFileClient messages={messages} />)

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
    expect(await screen.findByText(EXPECTED_DIGESTS.file)).toBeTruthy()
  })

  test("switches back to text mode after importing a file", async () => {
    render(<Ripemd128HashTextOrFileClient messages={messages} />)

    const file = new File(["hello from file"], "demo.txt", {
      type: "text/plain",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await screen.findByText(EXPECTED_DIGESTS.file)

    fireEvent.click(
      screen.getByRole("button", { name: messages.plainTextLabel })
    )

    expect(getPlainTextInput().value).toBe("Hello, browser-native world!")
    expect(await screen.findByText(EXPECTED_DIGESTS.defaultText)).toBeTruthy()
  })

  test("restores the last stored text value", async () => {
    window.localStorage.setItem(STORAGE_KEY, "stored value")

    render(<Ripemd128HashTextOrFileClient messages={messages} />)

    await waitFor(() => {
      expect(getPlainTextInput().value).toBe("stored value")
    })

    expect(await screen.findByText(EXPECTED_DIGESTS.stored)).toBeTruthy()
  })

  test("persists plain text edits to local storage", () => {
    render(<Ripemd128HashTextOrFileClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "persist me" },
    })

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("persist me")
  })
})
