import { webcrypto } from "node:crypto"

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import Ripemd256HashTextOrFileClient from "./client"

const messages = {
  meta: {
    name: "RIPEMD-256 Hash Text or File",
    description: "Generate RIPEMD-256 digests directly in your browser.",
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

const STORAGE_KEY = "tools:ripemd256-hash-text-or-file:text"
const EXPECTED_DIGESTS = {
  defaultText:
    "6a07dfec76362449f762d6ed1436586cf6f22e444b6da79785bce9e51e4276c9",
  test: "fe0289110d07daeee9d9500e14c57787d9083f6ba10e6bcb256f86bb4fe7b981",
  file: "6f83953841887258f0aa84a88a49f93eb3acf3487cf284e2bd50fe8c654a2063",
  stored: "41df14432a23c7d5c2e881ce5c866db5f56119cc09432c2b8010cc0ab4d72bec",
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

describe("Ripemd256HashTextOrFileClient", () => {
  test("renders the default example and its digest", async () => {
    render(<Ripemd256HashTextOrFileClient messages={messages} />)

    expect(getPlainTextInput().value).toBe("Hello, browser-native world!")
    expect(screen.getByText(messages.hashResultDescription)).toBeTruthy()
    expect(await screen.findByText(EXPECTED_DIGESTS.defaultText)).toBeTruthy()
  })

  test("updates the text digest when the input changes", async () => {
    render(<Ripemd256HashTextOrFileClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "test" },
    })

    expect(await screen.findByText(EXPECTED_DIGESTS.test)).toBeTruthy()
  })

  test("imports a file and renders its digest", async () => {
    render(<Ripemd256HashTextOrFileClient messages={messages} />)

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
    render(<Ripemd256HashTextOrFileClient messages={messages} />)

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

    render(<Ripemd256HashTextOrFileClient messages={messages} />)

    await waitFor(() => {
      expect(getPlainTextInput().value).toBe("stored value")
    })

    expect(await screen.findByText(EXPECTED_DIGESTS.stored)).toBeTruthy()
  })

  test("persists plain text edits to local storage", () => {
    render(<Ripemd256HashTextOrFileClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "persist me" },
    })

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("persist me")
  })
})
