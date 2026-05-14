import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test } from "vitest"

import HighwayHashTextOrFileClient from "./client"
import {
  hashHighwayHash,
  parseHighwayHashKey,
  type HighwayHashOutputSize,
} from "./core/highwayhash"

const messages = {
  meta: {
    name: "HighwayHash Hash Text or File",
    description: "Generate HighwayHash keyed hashes in your browser.",
  },
  configurationLabel: "Configuration",
  configurationDescription:
    "Choose the digest size and optional 256-bit key for the current HighwayHash result.",
  outputSizeLabel: "Output size",
  outputSize64Label: "64-bit",
  outputSize128Label: "128-bit",
  outputSize256Label: "256-bit",
  keyLabel: "Key (Hex, 32 bytes, optional)",
  keyDescription:
    "Use exactly 64 hexadecimal characters. A 0x prefix, spaces, colons, hyphens, and underscores are accepted. Leave blank to use the library default key.",
  keyPlaceholder:
    "0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
  keyInvalidLabel:
    "Enter a 32-byte key as 64 hexadecimal characters. The 0x prefix is optional.",
  inputLabel: "Input",
  plainTextLabel: "Plain text",
  plainTextDescription:
    "Paste or type any UTF-8 text, including cache keys, object IDs, or request payloads.",
  importFromFileLabel: "Import from file",
  hashResultLabel: "Hash Result",
  hashResultDescription:
    "HighwayHash output for the current text input, key, and output size.",
  emptyStateDescription:
    "Provide text or import a file to generate a HighwayHash result.",
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
  text: "tools:highwayhash-hash-text-or-file:text",
  key: "tools:highwayhash-hash-text-or-file:key",
  outputSize: "tools:highwayhash-hash-text-or-file:output-size",
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

async function expectedHex(
  text: string | Blob,
  keyInput: string,
  outputSize: HighwayHashOutputSize
) {
  const keyState = parseHighwayHashKey(keyInput)

  if (keyState.status === "invalid") {
    throw new Error("Expected test key to be valid.")
  }

  return (
    await hashHighwayHash(text instanceof Blob ? text : new Blob([text]), {
      outputSize,
      key: keyState.key,
    })
  ).hex
}

describe("HighwayHashTextOrFileClient", () => {
  test("renders the default example and its HighwayHash output", async () => {
    render(<HighwayHashTextOrFileClient messages={messages} />)

    expect(getKeyInput().value).toBe(messages.keyPlaceholder)
    expect(getPlainTextInput().value).toBe("Hello, keyed HighwayHash world!")
    expect(
      await screen.findByText(
        await expectedHex(
          "Hello, keyed HighwayHash world!",
          messages.keyPlaceholder,
          64
        )
      )
    ).toBeTruthy()
  })

  test("updates the hash when text, key, and output size change", async () => {
    render(<HighwayHashTextOrFileClient messages={messages} />)

    const key =
      "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f"

    fireEvent.change(getKeyInput(), { target: { value: key } })
    fireEvent.change(getPlainTextInput(), { target: { value: "payload" } })
    fireEvent.click(
      screen.getByRole("radio", { name: messages.outputSize128Label })
    )

    expect(
      await screen.findByText(await expectedHex("payload", key, 128))
    ).toBeTruthy()
  })

  test("imports a file and renders the file hash", async () => {
    render(<HighwayHashTextOrFileClient messages={messages} />)

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
        await expectedHex(file, messages.keyPlaceholder, 64)
      )
    ).toBeTruthy()
  })

  test("shows validation and idle states", async () => {
    render(<HighwayHashTextOrFileClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), { target: { value: "" } })

    await waitFor(() => {
      expect(screen.getByText(messages.emptyStateDescription)).toBeTruthy()
    })

    fireEvent.change(getPlainTextInput(), { target: { value: "payload" } })
    fireEvent.change(getKeyInput(), { target: { value: "not-a-key" } })

    await waitFor(() => {
      expect(getKeyInput().getAttribute("aria-invalid")).toBe("true")
      expect(screen.getAllByText(messages.keyInvalidLabel)).toHaveLength(2)
    })
  })

  test("restores stored key, text, and output size values", async () => {
    const key =
      "1f1e1d1c1b1a191817161514131211100f0e0d0c0b0a09080706050403020100"

    window.localStorage.setItem(STORAGE_KEYS.key, key)
    window.localStorage.setItem(STORAGE_KEYS.text, "stored payload")
    window.localStorage.setItem(STORAGE_KEYS.outputSize, "256")

    render(<HighwayHashTextOrFileClient messages={messages} />)

    await waitFor(() => {
      expect(getKeyInput().value).toBe(key)
      expect(getPlainTextInput().value).toBe("stored payload")
    })

    expect(
      await screen.findByText(await expectedHex("stored payload", key, 256))
    ).toBeTruthy()
  })
})
