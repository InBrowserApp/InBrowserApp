import { webcrypto } from "node:crypto"

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import Ripemd320HashTextOrFileClient from "./client"

const messages = {
  meta: {
    name: "RIPEMD-320 Hash Text or File",
    description: "Generate RIPEMD-320 digests directly in your browser.",
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

const STORAGE_KEY = "tools:ripemd320-hash-text-or-file:text"
const EXPECTED_DIGESTS = {
  defaultText:
    "654d2e350db007ba550dd6f70462402dd297f863c1aba0ecc95bb854ca794740dedbac1f6f597492",
  test: "3b0a2e841e589cf583634a5dd265d2b5d497c4cc44b241e34e0f62d03e98c1b9dc72970b9bc20eb5",
  file: "64c699ec2d7cc6e787cf0b543ac22ffc6cebd7581d68cc75673853e8674fe0ab68627c7823e23356",
  stored:
    "e01afff05c0cf980647e584abe70696b2848c81a826aa0c895ba6e9f6c17f1467fad175938adbfd8",
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

describe("Ripemd320HashTextOrFileClient", () => {
  test("renders the default example and its digest", async () => {
    render(<Ripemd320HashTextOrFileClient messages={messages} />)

    expect(getPlainTextInput().value).toBe("Hello, browser-native world!")
    expect(screen.getByText(messages.hashResultDescription)).toBeTruthy()
    expect(await screen.findByText(EXPECTED_DIGESTS.defaultText)).toBeTruthy()
  })

  test("updates the text digest when the input changes", async () => {
    render(<Ripemd320HashTextOrFileClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "test" },
    })

    expect(await screen.findByText(EXPECTED_DIGESTS.test)).toBeTruthy()
  })

  test("imports a file and renders its digest", async () => {
    render(<Ripemd320HashTextOrFileClient messages={messages} />)

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
    render(<Ripemd320HashTextOrFileClient messages={messages} />)

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

    render(<Ripemd320HashTextOrFileClient messages={messages} />)

    await waitFor(() => {
      expect(getPlainTextInput().value).toBe("stored value")
    })

    expect(await screen.findByText(EXPECTED_DIGESTS.stored)).toBeTruthy()
  })

  test("persists plain text edits to local storage", () => {
    render(<Ripemd320HashTextOrFileClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "persist me" },
    })

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("persist me")
  })
})
