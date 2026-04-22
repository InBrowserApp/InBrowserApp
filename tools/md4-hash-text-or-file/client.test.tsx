import { webcrypto } from "node:crypto"

import { md4 } from "hash-wasm"
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import Md4HashTextOrFileClient from "./client"

const messages = {
  meta: {
    name: "MD4 Hash Text or File",
    description: "Generate MD4 digests directly in your browser.",
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
} as const

const STORAGE_KEY = "tools:md4-hash-text-or-file:text"

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

function md4Hex(input: string) {
  return md4(input)
}

describe("Md4HashTextOrFileClient", () => {
  test("renders the default example and its digest", async () => {
    render(<Md4HashTextOrFileClient messages={messages} />)

    expect(getPlainTextInput().value).toBe("Hello, browser-native world!")
    expect(screen.getByText(messages.hashResultDescription)).toBeTruthy()

    expect(
      await screen.findByText(await md4Hex("Hello, browser-native world!"))
    ).toBeTruthy()
  })

  test("updates the text digest when the input changes", async () => {
    render(<Md4HashTextOrFileClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "test" },
    })

    expect(await screen.findByText(await md4Hex("test"))).toBeTruthy()
  })

  test("imports a file and renders its digest", async () => {
    render(<Md4HashTextOrFileClient messages={messages} />)

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
    expect(
      await screen.findByText(await md4Hex("hello from file"))
    ).toBeTruthy()
  })

  test("switches back to text mode after importing a file", async () => {
    render(<Md4HashTextOrFileClient messages={messages} />)

    const file = new File(["hello from file"], "demo.txt", {
      type: "text/plain",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await screen.findByText(await md4Hex("hello from file"))

    fireEvent.click(
      screen.getByRole("button", { name: messages.plainTextLabel })
    )

    expect(getPlainTextInput().value).toBe("Hello, browser-native world!")
    expect(
      await screen.findByText(await md4Hex("Hello, browser-native world!"))
    ).toBeTruthy()
  })

  test("restores the last stored text value", async () => {
    window.localStorage.setItem(STORAGE_KEY, "stored value")

    render(<Md4HashTextOrFileClient messages={messages} />)

    await waitFor(() => {
      expect(getPlainTextInput().value).toBe("stored value")
    })

    expect(await screen.findByText(await md4Hex("stored value"))).toBeTruthy()
  })

  test("persists plain text edits to local storage", () => {
    render(<Md4HashTextOrFileClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "persist me" },
    })

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("persist me")
  })
})
