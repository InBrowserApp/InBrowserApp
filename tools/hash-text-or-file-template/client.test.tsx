import { createHash, webcrypto } from "node:crypto"

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import HashTextOrFileTemplateClient from "./client"

const messages = {
  meta: {
    name: "Hash Text or File",
    description: "Generate browser-native SHA digests for text or files.",
  },
  algorithmLabel: "Algorithm",
  algorithmDescription:
    "Choose a browser-native SHA algorithm. Use SHA-256 or stronger for new integrity checks.",
  algorithmLabels: {
    "SHA-1": "SHA-1",
    "SHA-256": "SHA-256",
    "SHA-384": "SHA-384",
    "SHA-512": "SHA-512",
  },
  inputLabel: "Input",
  plainTextLabel: "Plain text",
  plainTextDescription:
    "Paste or type UTF-8 text, or import a file to hash its bytes.",
  importFromFileLabel: "Import from file",
  hashResultLabel: "Hash Result",
  hashResultDescription: "Digest for the current input and algorithm.",
  emptyResultLabel: "Enter text or import a file to generate a digest.",
  hashErrorMessage: "Failed to hash the current input.",
  hexLabel: "Hexadecimal",
  base64Label: "Base64",
  decimalLabel: "Decimal",
  binaryLabel: "Binary",
  copyResultLabel: "Copy result",
  copiedLabel: "Copied",
} as const

const STORAGE_KEYS = {
  algorithm: "tools:hash-text-or-file-template:algorithm",
  text: "tools:hash-text-or-file-template:text",
} as const

beforeEach(() => {
  vi.stubGlobal("crypto", webcrypto)
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

function hashHex(algorithm: string, input: string) {
  return createHash(algorithm).update(input).digest("hex")
}

describe("HashTextOrFileTemplateClient", () => {
  test("renders the default SHA-256 example and its digest", async () => {
    render(<HashTextOrFileTemplateClient messages={messages} />)

    expect(getPlainTextInput().value).toBe("Hello, browser-native world!")
    expect(screen.getByText(messages.hashResultDescription)).toBeTruthy()

    expect(
      await screen.findByText(hashHex("sha256", "Hello, browser-native world!"))
    ).toBeTruthy()
  })

  test("changes the digest algorithm", async () => {
    render(<HashTextOrFileTemplateClient messages={messages} />)

    fireEvent.click(screen.getByRole("radio", { name: "SHA-512" }))

    expect(
      await screen.findByText(hashHex("sha512", "Hello, browser-native world!"))
    ).toBeTruthy()
    expect(window.localStorage.getItem(STORAGE_KEYS.algorithm)).toBe("SHA-512")
  })

  test("updates the text digest when the input changes", async () => {
    render(<HashTextOrFileTemplateClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "test" },
    })

    expect(await screen.findByText(hashHex("sha256", "test"))).toBeTruthy()
  })

  test("imports a file and renders its digest", async () => {
    render(<HashTextOrFileTemplateClient messages={messages} />)

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
      await screen.findByText(hashHex("sha256", "hello from file"))
    ).toBeTruthy()
  })

  test("switches back to text mode after importing a file", async () => {
    render(<HashTextOrFileTemplateClient messages={messages} />)

    const file = new File(["hello from file"], "demo.txt", {
      type: "text/plain",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await screen.findByText(hashHex("sha256", "hello from file"))

    fireEvent.click(
      screen.getByRole("button", { name: messages.plainTextLabel })
    )

    expect(getPlainTextInput().value).toBe("Hello, browser-native world!")
    expect(
      await screen.findByText(hashHex("sha256", "Hello, browser-native world!"))
    ).toBeTruthy()
  })

  test("restores the last stored text and algorithm", async () => {
    window.localStorage.setItem(STORAGE_KEYS.algorithm, "SHA-384")
    window.localStorage.setItem(STORAGE_KEYS.text, "stored value")

    render(<HashTextOrFileTemplateClient messages={messages} />)

    await waitFor(() => {
      expect(getPlainTextInput().value).toBe("stored value")
    })

    expect(
      await screen.findByText(hashHex("sha384", "stored value"))
    ).toBeTruthy()
  })

  test("persists plain text edits to local storage", () => {
    render(<HashTextOrFileTemplateClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "persist me" },
    })

    expect(window.localStorage.getItem(STORAGE_KEYS.text)).toBe("persist me")
  })

  test("renders an empty state when text input is cleared", async () => {
    render(<HashTextOrFileTemplateClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "" },
    })

    await waitFor(() => {
      expect(screen.getByText(messages.emptyResultLabel)).toBeTruthy()
    })
  })

  test("renders a Web Crypto error state", async () => {
    vi.stubGlobal("crypto", {})

    render(<HashTextOrFileTemplateClient messages={messages} />)

    expect(
      await screen.findByText("SHA-256 hashing requires Web Crypto support.")
    ).toBeTruthy()
  })
})
