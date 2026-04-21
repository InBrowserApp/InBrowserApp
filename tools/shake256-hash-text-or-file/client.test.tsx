import { createHash } from "node:crypto"

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test } from "vitest"

import Shake256HashTextOrFileClient from "./client"

const messages = {
  meta: {
    name: "SHAKE256 (FIPS 202) Hash Text or File",
    description:
      "Generate SHAKE256 (FIPS 202) digests directly in your browser.",
  },
  configurationLabel: "SHAKE256 Configuration",
  configurationDescription:
    "SHAKE256 is an extendable-output function, so you can choose a digest length that fits your workflow.",
  outputLengthLabel: "Output Length",
  outputLengthPlaceholder: "e.g. 512 (bits)",
  outputLengthDescription: "Enter any multiple of 8 bits between 8 and 65536.",
  outputLengthInvalid: "Enter a multiple of 8 between 8 and 65536.",
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
} as const

const STORAGE_KEY = "tools:shake256-hash-text-or-file:text"

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(cleanup)

function getPlainTextInput() {
  return screen.getByRole("textbox", {
    name: messages.plainTextLabel,
  }) as HTMLTextAreaElement
}

function getOutputLengthInput() {
  return screen.getByRole("spinbutton", {
    name: messages.outputLengthLabel,
  }) as HTMLInputElement
}

function getFileInput() {
  return document.querySelector('input[type="file"]') as HTMLInputElement
}

function shake256Hex(input: string, outputLength = 512) {
  return createHash("shake256", {
    outputLength: outputLength / 8,
  })
    .update(input)
    .digest("hex")
}

describe("Shake256HashTextOrFileClient", () => {
  test("renders the default example and its digest", async () => {
    render(<Shake256HashTextOrFileClient messages={messages} />)

    expect(getPlainTextInput().value).toBe("Hello, browser-native world!")
    expect(screen.getByText(messages.hashResultDescription)).toBeTruthy()

    expect(
      await screen.findByText(shake256Hex("Hello, browser-native world!"))
    ).toBeTruthy()
  })

  test("updates the text digest when the input changes", async () => {
    render(<Shake256HashTextOrFileClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "test" },
    })

    expect(await screen.findByText(shake256Hex("test"))).toBeTruthy()
  })

  test("updates the digest when the output length changes", async () => {
    render(<Shake256HashTextOrFileClient messages={messages} />)

    fireEvent.change(getOutputLengthInput(), {
      target: { value: "256" },
    })

    expect(
      await screen.findByText(shake256Hex("Hello, browser-native world!", 256))
    ).toBeTruthy()
  })

  test("shows a validation message for an invalid output length", async () => {
    render(<Shake256HashTextOrFileClient messages={messages} />)

    fireEvent.change(getOutputLengthInput(), {
      target: { value: "510" },
    })

    expect(screen.getByText(messages.outputLengthInvalid)).toBeTruthy()
    expect(
      await screen.findByText(shake256Hex("Hello, browser-native world!"))
    ).toBeTruthy()
  })

  test("imports a file and renders its digest", async () => {
    render(<Shake256HashTextOrFileClient messages={messages} />)

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
    expect(await screen.findByText(shake256Hex("hello from file"))).toBeTruthy()
  })

  test("switches back to text mode after importing a file", async () => {
    render(<Shake256HashTextOrFileClient messages={messages} />)

    const file = new File(["hello from file"], "demo.txt", {
      type: "text/plain",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await screen.findByText(shake256Hex("hello from file"))

    fireEvent.click(
      screen.getByRole("button", { name: messages.plainTextLabel })
    )

    expect(getPlainTextInput().value).toBe("Hello, browser-native world!")
    expect(
      await screen.findByText(shake256Hex("Hello, browser-native world!"))
    ).toBeTruthy()
  })

  test("restores the last stored text value", async () => {
    window.localStorage.setItem(STORAGE_KEY, "stored value")

    render(<Shake256HashTextOrFileClient messages={messages} />)

    await waitFor(() => {
      expect(getPlainTextInput().value).toBe("stored value")
    })

    expect(await screen.findByText(shake256Hex("stored value"))).toBeTruthy()
  })

  test("persists plain text edits to local storage", () => {
    render(<Shake256HashTextOrFileClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "persist me" },
    })

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("persist me")
  })
})
