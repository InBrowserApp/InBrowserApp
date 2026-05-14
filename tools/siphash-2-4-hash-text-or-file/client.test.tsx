import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test } from "vitest"

import SipHash24HashTextOrFileClient from "./client"
import { hashSipHash24, parseSipHashKey } from "./core/siphash"

const messages = {
  meta: {
    name: "SipHash-2-4 Hash Text or File",
    description: "Generate SipHash-2-4 keyed hashes in your browser.",
  },
  configurationLabel: "Configuration",
  configurationDescription:
    "Set the 128-bit key used for the current SipHash-2-4 result.",
  keyLabel: "Key (Hex, 16 bytes)",
  keyDescription:
    "Use exactly 32 hexadecimal characters. A 0x prefix, spaces, colons, hyphens, and underscores are accepted.",
  keyPlaceholder: "0x000102030405060708090a0b0c0d0e0f",
  keyInvalidLabel:
    "Enter a 16-byte key as 32 hexadecimal characters. The 0x prefix is optional.",
  inputLabel: "Input",
  plainTextLabel: "Plain text",
  plainTextDescription:
    "Paste or type any UTF-8 text, including cache keys or request payloads.",
  importFromFileLabel: "Import from file",
  hashResultLabel: "Hash Result",
  hashResultDescription:
    "SipHash-2-4 output for the current text input and key.",
  emptyStateDescription:
    "Enter a valid 16-byte key and provide text or import a file to generate a SipHash-2-4 result.",
  fileHashErrorLabel: "Failed to hash file.",
  textHashErrorLabel: "Failed to hash text.",
  hexLabel: "Hexadecimal",
  base64Label: "Base64",
  decimalLabel: "Decimal",
  binaryLabel: "Binary",
  copyResultLabel: "Copy result",
  copiedLabel: "Copied",
} as const

const STORAGE_KEYS = {
  text: "tools:siphash-2-4-hash-text-or-file:text",
  key: "tools:siphash-2-4-hash-text-or-file:key",
} as const

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(cleanup)

function getPlainTextInput() {
  return screen.getByRole("textbox", {
    name: messages.plainTextLabel,
  }) as HTMLTextAreaElement
}

function getKeyInput() {
  return screen.getByLabelText(messages.keyLabel) as HTMLInputElement
}

function getFileInput() {
  return document.querySelector('input[type="file"]') as HTMLInputElement
}

async function expectedHex(text: string, keyInput: string) {
  const keyState = parseSipHashKey(keyInput)

  if (keyState.status !== "valid") {
    throw new Error("Expected test key to be valid.")
  }

  return (await hashSipHash24(new Blob([text]), keyState.key)).hex
}

describe("SipHash24HashTextOrFileClient", () => {
  test("renders the default example and its SipHash-2-4 output", async () => {
    render(<SipHash24HashTextOrFileClient messages={messages} />)

    expect(getKeyInput().value).toBe("0x000102030405060708090a0b0c0d0e0f")
    expect(getPlainTextInput().value).toBe("Hello, keyed hash tables!")
    expect(
      await screen.findByText(
        await expectedHex(
          "Hello, keyed hash tables!",
          "0x000102030405060708090a0b0c0d0e0f"
        )
      )
    ).toBeTruthy()
  })

  test("updates the hash when text and key change", async () => {
    render(<SipHash24HashTextOrFileClient messages={messages} />)

    fireEvent.change(getKeyInput(), {
      target: { value: "000102030405060708090a0b0c0d0e0f" },
    })
    fireEvent.change(getPlainTextInput(), {
      target: { value: "payload" },
    })

    expect(
      await screen.findByText(
        await expectedHex("payload", "000102030405060708090a0b0c0d0e0f")
      )
    ).toBeTruthy()
  })

  test("imports a file and renders the file hash", async () => {
    render(<SipHash24HashTextOrFileClient messages={messages} />)

    const file = new File(["hello from file"], "payload.txt", {
      type: "text/plain",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await waitFor(() => {
      expect(screen.getByText("payload.txt")).toBeTruthy()
    })

    expect(
      screen.queryByRole("textbox", { name: messages.plainTextLabel })
    ).toBeNull()
    expect(
      await screen.findByText(
        await expectedHex(
          "hello from file",
          "0x000102030405060708090a0b0c0d0e0f"
        )
      )
    ).toBeTruthy()
  })

  test("shows validation and idle states for missing or invalid keys", async () => {
    render(<SipHash24HashTextOrFileClient messages={messages} />)

    fireEvent.change(getKeyInput(), { target: { value: "" } })

    await waitFor(() => {
      expect(screen.getByText(messages.emptyStateDescription)).toBeTruthy()
    })

    fireEvent.change(getKeyInput(), { target: { value: "not-a-key" } })

    await waitFor(() => {
      expect(getKeyInput().getAttribute("aria-invalid")).toBe("true")
      expect(screen.getAllByText(messages.keyInvalidLabel)).toHaveLength(2)
    })
  })

  test("restores stored key and text values", async () => {
    window.localStorage.setItem(
      STORAGE_KEYS.key,
      "0f0e0d0c0b0a09080706050403020100"
    )
    window.localStorage.setItem(STORAGE_KEYS.text, "stored payload")

    render(<SipHash24HashTextOrFileClient messages={messages} />)

    await waitFor(() => {
      expect(getKeyInput().value).toBe("0f0e0d0c0b0a09080706050403020100")
      expect(getPlainTextInput().value).toBe("stored payload")
    })

    expect(
      await screen.findByText(
        await expectedHex("stored payload", "0f0e0d0c0b0a09080706050403020100")
      )
    ).toBeTruthy()
  })
})
