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
    name: "xxHash (XXH3 64) Hash Text or File",
    description:
      "Generate xxHash XXH3 64 hashes directly in your browser for text or files.",
  },
  inputLabel: "Input",
  plainTextLabel: "Plain text",
  plainTextDescription:
    "Paste or type any UTF-8 text, including emoji and non-Latin characters.",
  importFromFileLabel: "Import from file",
  seedSectionLabel: "Seed",
  seedLabel: "Seed (Optional)",
  seedPlaceholder: "0 or 0x...",
  seedInvalid: "Enter a decimal number or a 0x hex value.",
  hashResultLabel: "Hash Result",
  hashResultDescription: "Hash result for the current text input.",
  hexLabel: "Hexadecimal",
  base64Label: "Base64",
  decimalLabel: "Decimal",
  binaryLabel: "Binary",
  copyResultLabel: "Copy result",
  copiedLabel: "Copied",
} as const

const STORAGE_KEY = "tools:xxhash-xxh3-64-hash-text-or-file:text"

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(cleanup)

function getPlainTextInput() {
  return screen.getByRole("textbox", {
    name: messages.plainTextLabel,
  }) as HTMLTextAreaElement
}

function getSeedInput() {
  return screen.getByRole("textbox", {
    name: messages.seedLabel,
  }) as HTMLInputElement
}

function getFileInput() {
  return document.querySelector('input[type="file"]') as HTMLInputElement
}

function xxhashHex(input: string) {
  switch (input) {
    case "Hello, browser-native XXH3 world!":
      return "bdc6b218003a5bad"
    case "test":
      return "9ec9f7918d7dfc40"
    case "hello from file":
      return "8b91e73996f46d27"
    case "stored value":
      return "a74584fc69efb2f1"
    default:
      throw new Error(`Missing xxHash vector for ${input}`)
  }
}

function seededXxhashHex(input: string, seed: string) {
  if (input === "test" && seed === "1") {
    return "5b00338b1c0982b5"
  }

  throw new Error(`Missing seeded xxHash vector for ${input} with seed ${seed}`)
}

describe("XxHashHashTextOrFileClient", () => {
  test("renders the default example and its digest", async () => {
    render(<XxHashHashTextOrFileClient messages={messages} />)

    expect(getPlainTextInput().value).toBe("Hello, browser-native XXH3 world!")
    expect(screen.getByText(messages.hashResultDescription)).toBeTruthy()

    expect(
      await screen.findByText(xxhashHex("Hello, browser-native XXH3 world!"))
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

    expect(getPlainTextInput().value).toBe("Hello, browser-native XXH3 world!")
    expect(
      await screen.findByText(xxhashHex("Hello, browser-native XXH3 world!"))
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

  test("updates the digest when the seed changes", async () => {
    render(<XxHashHashTextOrFileClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "test" },
    })
    fireEvent.change(getSeedInput(), {
      target: { value: "1" },
    })

    expect(await screen.findByText(seededXxhashHex("test", "1"))).toBeTruthy()
  })

  test("shows a validation error for invalid seed input", async () => {
    render(<XxHashHashTextOrFileClient messages={messages} />)

    fireEvent.change(getSeedInput(), {
      target: { value: "oops" },
    })

    await waitFor(() => {
      expect(screen.getAllByText(messages.seedInvalid).length).toBeGreaterThan(
        0
      )
    })
  })
})
