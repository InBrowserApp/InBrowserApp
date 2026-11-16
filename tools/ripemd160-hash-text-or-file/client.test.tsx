import { createHash, webcrypto } from "node:crypto"

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import Ripemd160HashTextOrFileClient from "./client"
import * as hashCore from "./core/ripemd160"

const messages = {
  meta: {
    name: "RIPEMD-160 Hash Text or File",
    description: "Generate RIPEMD-160 digests directly in your browser.",
  },
  inputLabel: "Input",
  plainTextLabel: "Plain text",
  plainTextDescription:
    "Paste or type any UTF-8 text, including emoji and non-Latin characters.",
  importFromFileLabel: "Import from file",
  fileHashError: "Failed to hash file.",
  textHashError: "Failed to hash text.",
  hashResultLabel: "Hash Result",
  hashResultDescription: "Hash result for the current text input.",
  hexLabel: "Hexadecimal",
  base64Label: "Base64",
  decimalLabel: "Decimal",
  binaryLabel: "Binary",
  copyResultLabel: "Copy result",
  copiedLabel: "Copied",
} as const

const STORAGE_KEY = "tools:ripemd160-hash-text-or-file:text"

beforeEach(() => {
  vi.stubGlobal("crypto", webcrypto)
  window.localStorage.clear()
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

function getPlainTextInput() {
  return screen.getByRole("textbox", {
    name: messages.plainTextLabel,
  }) as HTMLTextAreaElement
}

function getFileInput() {
  return document.querySelector('input[type="file"]') as HTMLInputElement
}

function ripemd160Hex(input: string) {
  return createHash("ripemd160").update(input).digest("hex")
}

describe("Ripemd160HashTextOrFileClient", () => {
  test("renders the default example and its digest", async () => {
    render(<Ripemd160HashTextOrFileClient messages={messages} />)

    expect(getPlainTextInput().value).toBe("Hello, browser-native world!")
    expect(screen.getByText(messages.hashResultDescription)).toBeTruthy()

    expect(
      await screen.findByText(ripemd160Hex("Hello, browser-native world!"))
    ).toBeTruthy()
  })

  test("updates the text digest when the input changes", async () => {
    render(<Ripemd160HashTextOrFileClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "test" },
    })

    expect(await screen.findByText(ripemd160Hex("test"))).toBeTruthy()
  })

  test("imports a file and renders its digest", async () => {
    render(<Ripemd160HashTextOrFileClient messages={messages} />)

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
      await screen.findByText(ripemd160Hex("hello from file"))
    ).toBeTruthy()
  })

  test("switches back to text mode after importing a file", async () => {
    render(<Ripemd160HashTextOrFileClient messages={messages} />)

    const file = new File(["hello from file"], "demo.txt", {
      type: "text/plain",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await screen.findByText(ripemd160Hex("hello from file"))

    fireEvent.click(
      screen.getByRole("button", { name: messages.plainTextLabel })
    )

    expect(getPlainTextInput().value).toBe("Hello, browser-native world!")
    expect(
      await screen.findByText(ripemd160Hex("Hello, browser-native world!"))
    ).toBeTruthy()
  })

  test("restores the last stored text value", async () => {
    window.localStorage.setItem(STORAGE_KEY, "stored value")

    render(<Ripemd160HashTextOrFileClient messages={messages} />)

    await waitFor(() => {
      expect(getPlainTextInput().value).toBe("stored value")
    })

    expect(await screen.findByText(ripemd160Hex("stored value"))).toBeTruthy()
  })

  test("persists plain text edits to local storage", () => {
    render(<Ripemd160HashTextOrFileClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "persist me" },
    })

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("persist me")
  })

  test("uses localized fallbacks for unknown text and file failures", async () => {
    vi.spyOn(hashCore, "hashRipemd160").mockRejectedValue({
      message: "unknown",
    })
    const localizedMessages = {
      ...messages,
      fileHashError: "ファイルのハッシュ計算に失敗しました。",
      textHashError: "テキストのハッシュ計算に失敗しました。",
    }

    render(<Ripemd160HashTextOrFileClient messages={localizedMessages} />)

    expect(
      await screen.findByText(localizedMessages.textHashError)
    ).toBeTruthy()

    fireEvent.change(getFileInput(), {
      target: { files: [new File(["content"], "broken.txt")] },
    })

    expect(
      await screen.findByText(localizedMessages.fileHashError)
    ).toBeTruthy()
    expect(screen.queryByText(localizedMessages.textHashError)).toBeNull()
  })

  test("preserves Error messages from failed hashing", async () => {
    vi.spyOn(hashCore, "hashRipemd160").mockRejectedValue(
      new Error("Input read failed")
    )

    render(<Ripemd160HashTextOrFileClient messages={messages} />)

    expect(await screen.findByText("Input read failed")).toBeTruthy()
  })
})
