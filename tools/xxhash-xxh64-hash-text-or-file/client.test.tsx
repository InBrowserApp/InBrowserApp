import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test } from "vitest"

import XxHashHashTextOrFileClient from "./client"

const messages = {
  meta: {
    name: "xxHash (XXH64) Hash Text or File",
    description:
      "Generate xxHash XXH64 hashes directly in your browser for text or files.",
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

const STORAGE_KEY = "tools:xxhash-xxh64-hash-text-or-file:text"

beforeEach(() => {
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

function xxhashHex(input: string) {
  switch (input) {
    case "Hello, browser-native xxHash world!":
      return "77d17f2e69617075"
    case "test":
      return "4fdcca5ddb678139"
    case "hello from file":
      return "d2058aa6a041138e"
    case "stored value":
      return "e059c5a9c6deaab4"
    default:
      throw new Error(`Missing xxHash vector for ${input}`)
  }
}

describe("XxHashHashTextOrFileClient", () => {
  test("renders the default example and its digest", async () => {
    render(<XxHashHashTextOrFileClient messages={messages} />)

    expect(getPlainTextInput().value).toBe(
      "Hello, browser-native xxHash world!"
    )
    expect(screen.getByText(messages.hashResultDescription)).toBeTruthy()

    expect(
      await screen.findByText(xxhashHex("Hello, browser-native xxHash world!"))
    ).toBeTruthy()
  })

  test("updates the text digest when the input changes", async () => {
    render(<XxHashHashTextOrFileClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "test" },
    })

    expect(await screen.findByText(xxhashHex("test"))).toBeTruthy()
  })

  test("imports a file and renders its digest", async () => {
    render(<XxHashHashTextOrFileClient messages={messages} />)

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
    expect(await screen.findByText(xxhashHex("hello from file"))).toBeTruthy()
  })

  test("switches back to text mode after importing a file", async () => {
    render(<XxHashHashTextOrFileClient messages={messages} />)

    const file = new File(["hello from file"], "demo.txt", {
      type: "text/plain",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await screen.findByText(xxhashHex("hello from file"))

    fireEvent.click(
      screen.getByRole("button", { name: messages.plainTextLabel })
    )

    expect(getPlainTextInput().value).toBe(
      "Hello, browser-native xxHash world!"
    )
    expect(
      await screen.findByText(xxhashHex("Hello, browser-native xxHash world!"))
    ).toBeTruthy()
  })

  test("restores the last stored text value", async () => {
    window.localStorage.setItem(STORAGE_KEY, "stored value")

    render(<XxHashHashTextOrFileClient messages={messages} />)

    await waitFor(() => {
      expect(getPlainTextInput().value).toBe("stored value")
    })

    expect(await screen.findByText(xxhashHex("stored value"))).toBeTruthy()
  })

  test("persists plain text edits to local storage", () => {
    render(<XxHashHashTextOrFileClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "persist me" },
    })

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("persist me")
  })
})
