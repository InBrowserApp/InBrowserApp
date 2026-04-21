import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test } from "vitest"

import MurmurHash3HashTextOrFileClient from "./client"

const messages = {
  meta: {
    name: "MurmurHash3 (x86 32-bit) Hash Text or File",
    description:
      "Generate MurmurHash3 x86 32-bit hash for text input or file upload.",
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

const STORAGE_KEY = "tools:murmurhash3-x86-32-hash-text-or-file:text"

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

function murmurHex(input: string) {
  switch (input) {
    case "I will not buy this record, it is scratched.":
      return "a8d02b9a"
    case "test":
      return "ba6bd213"
    case "hello from file":
      return "68c95e7b"
    case "stored value":
      return "3e06ef3f"
    default:
      throw new Error(`Missing MurmurHash3 vector for ${input}`)
  }
}

function seededMurmurHex(input: string, seed: string) {
  if (input === "test" && seed === "1") {
    return "99c02ae2"
  }

  throw new Error(
    `Missing seeded MurmurHash3 vector for ${input} with seed ${seed}`
  )
}

describe("MurmurHash3HashTextOrFileClient", () => {
  test("renders the default example and its digest", async () => {
    render(<MurmurHash3HashTextOrFileClient messages={messages} />)

    expect(getPlainTextInput().value).toBe(
      "I will not buy this record, it is scratched."
    )
    expect(screen.getByText(messages.hashResultDescription)).toBeTruthy()

    expect(
      await screen.findByText(
        murmurHex("I will not buy this record, it is scratched.")
      )
    ).toBeTruthy()
  })

  test("updates the text digest when the input changes", async () => {
    render(<MurmurHash3HashTextOrFileClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "test" },
    })

    expect(await screen.findByText(murmurHex("test"))).toBeTruthy()
  })

  test("imports a file and renders its digest", async () => {
    render(<MurmurHash3HashTextOrFileClient messages={messages} />)

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
    expect(await screen.findByText(murmurHex("hello from file"))).toBeTruthy()
  })

  test("switches back to text mode after importing a file", async () => {
    render(<MurmurHash3HashTextOrFileClient messages={messages} />)

    const file = new File(["hello from file"], "demo.txt", {
      type: "text/plain",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await screen.findByText(murmurHex("hello from file"))

    fireEvent.click(
      screen.getByRole("button", { name: messages.plainTextLabel })
    )

    expect(getPlainTextInput().value).toBe(
      "I will not buy this record, it is scratched."
    )
    expect(
      await screen.findByText(
        murmurHex("I will not buy this record, it is scratched.")
      )
    ).toBeTruthy()
  })

  test("restores the last stored text value", async () => {
    window.localStorage.setItem(STORAGE_KEY, "stored value")

    render(<MurmurHash3HashTextOrFileClient messages={messages} />)

    await waitFor(() => {
      expect(getPlainTextInput().value).toBe("stored value")
    })

    expect(await screen.findByText(murmurHex("stored value"))).toBeTruthy()
  })

  test("persists plain text edits to local storage", () => {
    render(<MurmurHash3HashTextOrFileClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "persist me" },
    })

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("persist me")
  })

  test("updates the digest when the seed changes", async () => {
    render(<MurmurHash3HashTextOrFileClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "test" },
    })
    fireEvent.change(getSeedInput(), {
      target: { value: "1" },
    })

    expect(await screen.findByText(seededMurmurHex("test", "1"))).toBeTruthy()
  })

  test("shows a validation error for invalid seed input", async () => {
    render(<MurmurHash3HashTextOrFileClient messages={messages} />)

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
