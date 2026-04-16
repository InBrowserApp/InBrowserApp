import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import Blake3HashTextOrFileClient from "./client"

const hashBlake3Mock = vi.hoisted(() =>
  vi.fn(async (source: Blob, options: { keyBase64?: string }) => {
    const text = await source.text()

    if (options.keyBase64 === "***") {
      throw new Error("BLAKE3_INVALID_KEY_BASE64")
    }

    return {
      hex: `hex:${text}:${options.keyBase64 ?? ""}`,
      base64: `base64:${text}:${options.keyBase64 ?? ""}`,
      decimal: "123",
      binary: "1010",
    }
  })
)

vi.mock("./core/blake3", () => ({
  BLAKE3_MAX_OUTPUT_LENGTH: 256,
  BLAKE3_MIN_OUTPUT_LENGTH: 8,
  BLAKE3_OUTPUT_LENGTH_STEP: 8,
  INVALID_BLAKE3_KEY_BASE64_ERROR: "BLAKE3_INVALID_KEY_BASE64",
  hashBlake3: hashBlake3Mock,
}))

const messages = {
  meta: {
    name: "BLAKE3 Hash Text or File",
    description: "Generate BLAKE3 digests directly in your browser.",
  },
  configurationLabel: "BLAKE3 Configuration",
  outputLengthLabel: "Output Length",
  keyLabel: "BLAKE3 Key (Base64)",
  keyPlaceholder: "Optional 32-byte key for keyed hashing (Base64 encoded)",
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
  invalidBase64Title: "The Base64 value is not valid yet.",
  invalidBase64Description:
    "Check for missing padding, unexpected characters, or partially pasted data.",
} as const

const STORAGE_KEY = "tools:blake3-hash-text-or-file:text"

beforeEach(() => {
  window.localStorage.clear()
  hashBlake3Mock.mockClear()
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

function getKeyInput() {
  return screen.getByRole("textbox", {
    name: messages.keyLabel,
  }) as HTMLInputElement
}

describe("Blake3HashTextOrFileClient", () => {
  test("renders the default example and its digest", async () => {
    render(<Blake3HashTextOrFileClient messages={messages} />)

    expect(getPlainTextInput().value).toBe("Hello, browser-native world!")
    expect(screen.getByText(messages.hashResultDescription)).toBeTruthy()

    expect(
      await screen.findByText("hex:Hello, browser-native world!:")
    ).toBeTruthy()
  })

  test("updates the digest when the keyed hash input changes", async () => {
    render(<Blake3HashTextOrFileClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "test" },
    })

    fireEvent.change(getKeyInput(), {
      target: { value: "a2V5" },
    })

    expect(await screen.findByText("hex:test:a2V5")).toBeTruthy()
  })

  test("shows a localized alert when the key is not valid Base64", async () => {
    render(<Blake3HashTextOrFileClient messages={messages} />)

    fireEvent.change(getKeyInput(), {
      target: { value: "***" },
    })

    expect(await screen.findByText(messages.invalidBase64Title)).toBeTruthy()
    expect(screen.getByText(messages.invalidBase64Description)).toBeTruthy()
  })

  test("imports a file and renders its digest", async () => {
    render(<Blake3HashTextOrFileClient messages={messages} />)

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
    expect(await screen.findByText("hex:hello from file:")).toBeTruthy()
  })

  test("switches back to text mode after importing a file", async () => {
    render(<Blake3HashTextOrFileClient messages={messages} />)

    const file = new File(["hello from file"], "demo.txt", {
      type: "text/plain",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await screen.findByText("hex:hello from file:")

    fireEvent.click(
      screen.getByRole("button", { name: messages.plainTextLabel })
    )

    expect(getPlainTextInput().value).toBe("Hello, browser-native world!")
    expect(
      await screen.findByText("hex:Hello, browser-native world!:")
    ).toBeTruthy()
  })

  test("restores the last stored text value", async () => {
    window.localStorage.setItem(STORAGE_KEY, "stored value")

    render(<Blake3HashTextOrFileClient messages={messages} />)

    await waitFor(() => {
      expect(getPlainTextInput().value).toBe("stored value")
    })

    expect(await screen.findByText("hex:stored value:")).toBeTruthy()
  })

  test("persists plain text edits to local storage", () => {
    render(<Blake3HashTextOrFileClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "persist me" },
    })

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("persist me")
  })
})
