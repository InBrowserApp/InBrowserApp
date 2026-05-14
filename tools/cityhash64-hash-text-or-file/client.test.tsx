import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test } from "vitest"

import CityHash64HashTextOrFileClient from "./client"

const messages = {
  meta: {
    name: "CityHash64 Hash Text or File",
    description: "Generate CityHash64 hashes for text input or file uploads.",
  },
  inputLabel: "Input",
  plainTextLabel: "Plain text",
  plainTextDescription:
    "Paste or type any UTF-8 text, including emoji and non-Latin characters.",
  importFromFileLabel: "Import from file",
  seedSectionLabel: "Seed",
  seedLabel: "Seed (optional)",
  seedDescription:
    "Leave blank for standard CityHash64. Enter a decimal or 0x hexadecimal seed to calculate the seeded variant.",
  seedPlaceholder: "Optional decimal or 0x hex seed",
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

const STORAGE_KEY = "tools:cityhash64-hash-text-or-file:text"

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

function CityHex(input: string) {
  switch (input) {
    case "Hello from CityHash64 in the browser.":
      return "28db5604b771b148"
    case "test":
      return "f5b107bb17b4a9b2"
    case "hello from file":
      return "0701b177e3822a8a"
    case "stored value":
      return "78b78b49ac00cb37"
    default:
      throw new Error(`Missing CityHash64 vector for ${input}`)
  }
}

function seededCityHex(input: string, seed: string) {
  if (input === "test" && seed === "1") {
    return "662d07d4d0588afa"
  }

  throw new Error(
    `Missing seeded CityHash64 vector for ${input} with seed ${seed}`
  )
}

describe("CityHash64HashTextOrFileClient", () => {
  test("renders the default example and its digest", async () => {
    render(<CityHash64HashTextOrFileClient messages={messages} />)

    expect(getPlainTextInput().value).toBe(
      "Hello from CityHash64 in the browser."
    )
    expect(screen.getByText(messages.hashResultDescription)).toBeTruthy()

    expect(
      await screen.findByText(CityHex("Hello from CityHash64 in the browser."))
    ).toBeTruthy()
  })

  test("updates the text digest when the input changes", async () => {
    render(<CityHash64HashTextOrFileClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "test" },
    })

    expect(await screen.findByText(CityHex("test"))).toBeTruthy()
  })

  test("imports a file and renders its digest", async () => {
    render(<CityHash64HashTextOrFileClient messages={messages} />)

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
    expect(await screen.findByText(CityHex("hello from file"))).toBeTruthy()
  })

  test("switches back to text mode after importing a file", async () => {
    render(<CityHash64HashTextOrFileClient messages={messages} />)

    const file = new File(["hello from file"], "demo.txt", {
      type: "text/plain",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await screen.findByText(CityHex("hello from file"))

    fireEvent.click(
      screen.getByRole("button", { name: messages.plainTextLabel })
    )

    expect(getPlainTextInput().value).toBe(
      "Hello from CityHash64 in the browser."
    )
    expect(
      await screen.findByText(CityHex("Hello from CityHash64 in the browser."))
    ).toBeTruthy()
  })

  test("restores the last stored text value", async () => {
    window.localStorage.setItem(STORAGE_KEY, "stored value")

    render(<CityHash64HashTextOrFileClient messages={messages} />)

    await waitFor(() => {
      expect(getPlainTextInput().value).toBe("stored value")
    })

    expect(await screen.findByText(CityHex("stored value"))).toBeTruthy()
  })

  test("persists plain text edits to local storage", () => {
    render(<CityHash64HashTextOrFileClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "persist me" },
    })

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("persist me")
  })

  test("updates the digest when the seed changes", async () => {
    render(<CityHash64HashTextOrFileClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "test" },
    })
    fireEvent.change(getSeedInput(), {
      target: { value: "1" },
    })

    expect(await screen.findByText(seededCityHex("test", "1"))).toBeTruthy()
  })

  test("shows a validation error for invalid seed input", async () => {
    render(<CityHash64HashTextOrFileClient messages={messages} />)

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
