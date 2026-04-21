import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test } from "vitest"

import XxHashXxh3128HashTextOrFileClient from "./client"
import { hashXxHashXxh3128, parseSeedInput } from "./core/xxhash"

const messages = {
  meta: {
    name: "xxHash (XXH3 128) Hash Text or File",
    description:
      "Generate xxHash XXH3 128 hashes directly in your browser for text or files.",
  },
  inputLabel: "Input",
  plainTextLabel: "Plain text",
  plainTextDescription:
    "Paste or type any UTF-8 text, including emoji and non-Latin characters.",
  importFromFileLabel: "Import from file",
  seedLabel: "Seed (optional)",
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

const STORAGE_KEY = "tools:xxhash-xxh3-128-hash-text-or-file:text"

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

async function xxh3128Hex(input: string, seedInput = "0") {
  const seed = parseSeedInput(seedInput)

  if (!seed.isValid) {
    throw new Error("Seed must be valid to calculate a digest")
  }

  const digest = await hashXxHashXxh3128(new Blob([input]), seed)

  return digest.hex
}

describe("XxHashXxh3128HashTextOrFileClient", () => {
  test("renders the default example and its digest", async () => {
    render(<XxHashXxh3128HashTextOrFileClient messages={messages} />)

    expect(getPlainTextInput().value).toBe(
      "Hello, browser-native xxHash XXH3 128 world!"
    )
    expect(getSeedInput().value).toBe("0")
    expect(screen.getByText(messages.hashResultDescription)).toBeTruthy()

    expect(
      await screen.findByText(
        await xxh3128Hex("Hello, browser-native xxHash XXH3 128 world!")
      )
    ).toBeTruthy()
  })

  test("updates the digest when the seed changes", async () => {
    render(<XxHashXxh3128HashTextOrFileClient messages={messages} />)

    fireEvent.change(getSeedInput(), {
      target: { value: "0x1234" },
    })

    expect(
      await screen.findByText(
        await xxh3128Hex(
          "Hello, browser-native xxHash XXH3 128 world!",
          "0x1234"
        )
      )
    ).toBeTruthy()
  })

  test("shows a validation error for invalid seed input", async () => {
    render(<XxHashXxh3128HashTextOrFileClient messages={messages} />)

    const previousDigest = await xxh3128Hex(
      "Hello, browser-native xxHash XXH3 128 world!"
    )

    fireEvent.change(getSeedInput(), {
      target: { value: "nope" },
    })

    expect(await screen.findAllByText(messages.seedInvalid)).toHaveLength(2)

    await waitFor(() => {
      expect(screen.queryByText(previousDigest)).toBeNull()
    })
  })

  test("imports a file and renders its digest", async () => {
    render(<XxHashXxh3128HashTextOrFileClient messages={messages} />)

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
      await screen.findByText(await xxh3128Hex("hello from file"))
    ).toBeTruthy()
  })

  test("switches back to text mode after importing a file", async () => {
    render(<XxHashXxh3128HashTextOrFileClient messages={messages} />)

    const file = new File(["hello from file"], "demo.txt", {
      type: "text/plain",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await screen.findByText(await xxh3128Hex("hello from file"))

    fireEvent.click(
      screen.getByRole("button", { name: messages.plainTextLabel })
    )

    expect(getPlainTextInput().value).toBe(
      "Hello, browser-native xxHash XXH3 128 world!"
    )
    expect(
      await screen.findByText(
        await xxh3128Hex("Hello, browser-native xxHash XXH3 128 world!")
      )
    ).toBeTruthy()
  })

  test("restores the last stored text value", async () => {
    window.localStorage.setItem(STORAGE_KEY, "stored value")

    render(<XxHashXxh3128HashTextOrFileClient messages={messages} />)

    await waitFor(() => {
      expect(getPlainTextInput().value).toBe("stored value")
    })

    expect(
      await screen.findByText(await xxh3128Hex("stored value"))
    ).toBeTruthy()
  })

  test("persists plain text edits to local storage", () => {
    render(<XxHashXxh3128HashTextOrFileClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "persist me" },
    })

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("persist me")
  })
})
