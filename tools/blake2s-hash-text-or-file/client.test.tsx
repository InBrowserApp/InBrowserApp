import { createHash } from "node:crypto"

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test } from "vitest"

import Blake2sHashTextOrFileClient from "./client"

const messages = {
  meta: {
    name: "BLAKE2s Hash Text or File",
    description: "Generate BLAKE2s digests directly in your browser.",
  },
  configurationLabel: "BLAKE2s Configuration",
  outputLengthLabel: "Output Length",
  keyLabel: "BLAKE2 Key (Base64)",
  keyPlaceholder: "Optional key for keyed hashing (Base64 encoded)",
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

const STORAGE_KEY = "tools:blake2s-hash-text-or-file:text"

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

function getKeyInput() {
  return screen.getByRole("textbox", {
    name: messages.keyLabel,
  }) as HTMLInputElement
}

function blake2sHex(input: string) {
  return createHash("blake2s256").update(input).digest("hex")
}

const KEYED_TEST_DIGEST =
  "2fc31698bc218ccc20185a737c14a42ef60eb168973300ca81f96db522a1f6c8"

describe("Blake2sHashTextOrFileClient", () => {
  test("renders the default example and its digest", async () => {
    render(<Blake2sHashTextOrFileClient messages={messages} />)

    expect(getPlainTextInput().value).toBe("Hello, browser-native world!")
    expect(screen.getByText(messages.hashResultDescription)).toBeTruthy()

    expect(
      await screen.findByText(blake2sHex("Hello, browser-native world!"))
    ).toBeTruthy()
  })

  test("updates the digest when the keyed hash input changes", async () => {
    render(<Blake2sHashTextOrFileClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "test" },
    })

    fireEvent.change(getKeyInput(), {
      target: { value: "a2V5" },
    })

    expect(await screen.findByText(KEYED_TEST_DIGEST)).toBeTruthy()
  })

  test("shows a localized alert when the key is not valid Base64", async () => {
    render(<Blake2sHashTextOrFileClient messages={messages} />)

    fireEvent.change(getKeyInput(), {
      target: { value: "***" },
    })

    expect(await screen.findByText(messages.invalidBase64Title)).toBeTruthy()
    expect(screen.getByText(messages.invalidBase64Description)).toBeTruthy()
  })

  test("imports a file and renders its digest", async () => {
    render(<Blake2sHashTextOrFileClient messages={messages} />)

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
    expect(await screen.findByText(blake2sHex("hello from file"))).toBeTruthy()
  })

  test("switches back to text mode after importing a file", async () => {
    render(<Blake2sHashTextOrFileClient messages={messages} />)

    const file = new File(["hello from file"], "demo.txt", {
      type: "text/plain",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await screen.findByText(blake2sHex("hello from file"))

    fireEvent.click(
      screen.getByRole("button", { name: messages.plainTextLabel })
    )

    expect(getPlainTextInput().value).toBe("Hello, browser-native world!")
    expect(
      await screen.findByText(blake2sHex("Hello, browser-native world!"))
    ).toBeTruthy()
  })

  test("restores the last stored text value", async () => {
    window.localStorage.setItem(STORAGE_KEY, "stored value")

    render(<Blake2sHashTextOrFileClient messages={messages} />)

    await waitFor(() => {
      expect(getPlainTextInput().value).toBe("stored value")
    })

    expect(await screen.findByText(blake2sHex("stored value"))).toBeTruthy()
  })

  test("persists plain text edits to local storage", () => {
    render(<Blake2sHashTextOrFileClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "persist me" },
    })

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("persist me")
  })
})
