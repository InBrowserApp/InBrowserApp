import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { whirlpool } from "hash-wasm"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import WhirlpoolHashTextOrFileClient from "./client"
import * as hashCore from "./core/whirlpool"

const messages = {
  meta: {
    name: "Whirlpool Hash Text or File",
    description: "Generate Whirlpool digests directly in your browser.",
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

const STORAGE_KEY = "tools:whirlpool-hash-text-or-file:text"

beforeEach(() => {
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

async function whirlpoolHex(input: string) {
  return whirlpool(new Uint8Array(new TextEncoder().encode(input)))
}

describe("WhirlpoolHashTextOrFileClient", () => {
  test("renders the default example and its digest", async () => {
    render(<WhirlpoolHashTextOrFileClient messages={messages} />)

    expect(getPlainTextInput().value).toBe("Hello, browser-native world!")
    expect(screen.getByText(messages.hashResultDescription)).toBeTruthy()

    expect(
      await screen.findByText(
        await whirlpoolHex("Hello, browser-native world!")
      )
    ).toBeTruthy()
  })

  test("updates the text digest when the input changes", async () => {
    render(<WhirlpoolHashTextOrFileClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "test" },
    })

    expect(await screen.findByText(await whirlpoolHex("test"))).toBeTruthy()
  })

  test("imports a file and renders its digest", async () => {
    render(<WhirlpoolHashTextOrFileClient messages={messages} />)

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
      await screen.findByText(await whirlpoolHex("hello from file"))
    ).toBeTruthy()
  })

  test("switches back to text mode after importing a file", async () => {
    render(<WhirlpoolHashTextOrFileClient messages={messages} />)

    const file = new File(["hello from file"], "demo.txt", {
      type: "text/plain",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await screen.findByText(await whirlpoolHex("hello from file"))

    fireEvent.click(
      screen.getByRole("button", { name: messages.plainTextLabel })
    )

    expect(getPlainTextInput().value).toBe("Hello, browser-native world!")
    expect(
      await screen.findByText(
        await whirlpoolHex("Hello, browser-native world!")
      )
    ).toBeTruthy()
  })

  test("restores the last stored text value", async () => {
    window.localStorage.setItem(STORAGE_KEY, "stored value")

    render(<WhirlpoolHashTextOrFileClient messages={messages} />)

    await waitFor(() => {
      expect(getPlainTextInput().value).toBe("stored value")
    })

    expect(
      await screen.findByText(await whirlpoolHex("stored value"))
    ).toBeTruthy()
  })

  test("persists plain text edits to local storage", () => {
    render(<WhirlpoolHashTextOrFileClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "persist me" },
    })

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("persist me")
  })

  test("uses localized fallbacks for unknown text and file failures", async () => {
    vi.spyOn(hashCore, "hashWhirlpool").mockRejectedValue({
      message: "unknown",
    })
    const localizedMessages = {
      ...messages,
      fileHashError: "ファイルのハッシュ計算に失敗しました。",
      textHashError: "テキストのハッシュ計算に失敗しました。",
    }

    render(<WhirlpoolHashTextOrFileClient messages={localizedMessages} />)

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
    vi.spyOn(hashCore, "hashWhirlpool").mockRejectedValue(
      new Error("Input read failed")
    )

    render(<WhirlpoolHashTextOrFileClient messages={messages} />)

    expect(await screen.findByText("Input read failed")).toBeTruthy()
  })
})
