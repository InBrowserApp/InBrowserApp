import { createHash, webcrypto } from "node:crypto"

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import SriHashGeneratorClient from "./client"

const messages = {
  meta: {
    name: "SRI Hash Generator",
    description: "Generate SRI hashes directly in your browser.",
  },
  inputLabel: "Input",
  plainTextLabel: "Plain text",
  plainTextDescription:
    "Paste or type any UTF-8 text, including file contents or inline scripts.",
  importFromFileLabel: "Import from file",
  hashResultLabel: "Hash Result",
  hashResultDescription: "Hash result for the current text input.",
  sha256SriLabel: "SHA-256 SRI",
  sha384SriLabel: "SHA-384 SRI",
  sha512SriLabel: "SHA-512 SRI",
  copyResultLabel: "Copy result",
  copiedLabel: "Copied",
} as const

const STORAGE_KEY = "tools:sri-hash-generator:text"

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

function createSriHash(
  algorithm: "sha256" | "sha384" | "sha512",
  input: string
) {
  return `${algorithm}-${createHash(algorithm).update(input).digest("base64")}`
}

describe("SriHashGeneratorClient", () => {
  test("renders the default example and its SRI hashes", async () => {
    render(<SriHashGeneratorClient messages={messages} />)

    expect(getPlainTextInput().value).toBe("console.log('Hello, SRI!')")
    expect(screen.getByText(messages.hashResultDescription)).toBeTruthy()

    expect(
      await screen.findByText(
        createSriHash("sha256", "console.log('Hello, SRI!')")
      )
    ).toBeTruthy()
    expect(
      screen.getByText(createSriHash("sha384", "console.log('Hello, SRI!')"))
    ).toBeTruthy()
    expect(
      screen.getByText(createSriHash("sha512", "console.log('Hello, SRI!')"))
    ).toBeTruthy()
  })

  test("updates the SRI hashes when the input changes", async () => {
    render(<SriHashGeneratorClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "test" },
    })

    expect(
      await screen.findByText(createSriHash("sha256", "test"))
    ).toBeTruthy()
    expect(screen.getByText(createSriHash("sha384", "test"))).toBeTruthy()
    expect(screen.getByText(createSriHash("sha512", "test"))).toBeTruthy()
  })

  test("imports a file and renders its SRI hashes", async () => {
    render(<SriHashGeneratorClient messages={messages} />)

    const file = new File(["hello from file"], "demo.js", {
      type: "application/javascript",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await waitFor(() => {
      expect(screen.getByText("demo.js")).toBeTruthy()
    })

    expect(
      screen.queryByRole("textbox", { name: messages.plainTextLabel })
    ).toBeNull()
    expect(
      await screen.findByText(createSriHash("sha256", "hello from file"))
    ).toBeTruthy()
    expect(
      screen.getByText(createSriHash("sha384", "hello from file"))
    ).toBeTruthy()
    expect(
      screen.getByText(createSriHash("sha512", "hello from file"))
    ).toBeTruthy()
  })

  test("switches back to text mode after importing a file", async () => {
    render(<SriHashGeneratorClient messages={messages} />)

    const file = new File(["hello from file"], "demo.js", {
      type: "application/javascript",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await screen.findByText(createSriHash("sha256", "hello from file"))

    fireEvent.click(
      screen.getByRole("button", { name: messages.plainTextLabel })
    )

    expect(getPlainTextInput().value).toBe("console.log('Hello, SRI!')")
    expect(
      await screen.findByText(
        createSriHash("sha256", "console.log('Hello, SRI!')")
      )
    ).toBeTruthy()
  })

  test("restores the last stored text value", async () => {
    window.localStorage.setItem(STORAGE_KEY, "stored value")

    render(<SriHashGeneratorClient messages={messages} />)

    await waitFor(() => {
      expect(getPlainTextInput().value).toBe("stored value")
    })

    expect(
      await screen.findByText(createSriHash("sha256", "stored value"))
    ).toBeTruthy()
  })

  test("persists plain text edits to local storage", () => {
    render(<SriHashGeneratorClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "persist me" },
    })

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("persist me")
  })
})
