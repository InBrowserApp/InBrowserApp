import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test } from "vitest"

import KeccakHashTextOrFileClient from "./client"

const messages = {
  meta: {
    name: "Keccak Hash Text or File",
    description: "Generate Keccak digests directly in your browser.",
  },
  inputLabel: "Input",
  plainTextLabel: "Plain text",
  plainTextDescription:
    "Paste or type any UTF-8 text, including emoji and non-Latin characters.",
  importFromFileLabel: "Import from file",
  outputLengthLabel: "Output Length",
  hashResultLabel: "Hash Result",
  hashResultDescription: "Hash result for the current text input.",
  hexLabel: "Hexadecimal",
  base64Label: "Base64",
  decimalLabel: "Decimal",
  binaryLabel: "Binary",
  copyResultLabel: "Copy result",
  copiedLabel: "Copied",
} as const

const STORAGE_KEY = "tools:keccak-hash-text-or-file:text"

const DIGESTS = {
  defaultText256:
    "2f447ac723d151aed93e8f1792b04abaeaf5ab6ef8cd0f326ec33eac58cc7efc",
  defaultText512:
    "1f557ab1528c151cbcabd9f9a271bdd813dfc34fac35dfb57350c5567676b4340763707bebcd6739ca1a1deb9d9a63190d4b9c32fcc081ab9ac46339c5b136a3",
  test256: "9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658",
  file256: "5169e68ade6a9ad10e1ae6e3b75edc6011553536046a78de689c6a2cfe055a9f",
  stored256: "a280e36abc2f0a57a0375e715378861d70db2212910a7d538736be3cbc7cc5f1",
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

function getFileInput() {
  return document.querySelector('input[type="file"]') as HTMLInputElement
}

describe("KeccakHashTextOrFileClient", () => {
  test("renders the default example and its Keccak-256 digest", async () => {
    render(<KeccakHashTextOrFileClient messages={messages} />)

    expect(getPlainTextInput().value).toBe("Hello, browser-native world!")
    expect(screen.getByText(messages.hashResultDescription)).toBeTruthy()

    expect(await screen.findByText(DIGESTS.defaultText256)).toBeTruthy()
  })

  test("updates the text digest when the input changes", async () => {
    render(<KeccakHashTextOrFileClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "test" },
    })

    expect(await screen.findByText(DIGESTS.test256)).toBeTruthy()
  })

  test("shows the idle placeholder when the input becomes empty", async () => {
    render(<KeccakHashTextOrFileClient messages={messages} />)

    await screen.findByText(DIGESTS.defaultText256)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "" },
    })

    expect(
      await screen.findAllByText(messages.plainTextDescription)
    ).toHaveLength(2)
  })

  test("updates the digest when the output length changes", async () => {
    render(<KeccakHashTextOrFileClient messages={messages} />)

    await screen.findByText(DIGESTS.defaultText256)

    fireEvent.click(screen.getByRole("button", { name: "512" }))

    expect(await screen.findByText(DIGESTS.defaultText512)).toBeTruthy()
  })

  test("ignores empty file selections", async () => {
    render(<KeccakHashTextOrFileClient messages={messages} />)

    fireEvent.change(getFileInput(), {
      target: { files: [] },
    })

    expect(getPlainTextInput().value).toBe("Hello, browser-native world!")
    expect(await screen.findByText(DIGESTS.defaultText256)).toBeTruthy()
  })

  test("imports a file and renders its digest", async () => {
    render(<KeccakHashTextOrFileClient messages={messages} />)

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
    expect(await screen.findByText(DIGESTS.file256)).toBeTruthy()
  })

  test("formats kilobyte-sized files in the input summary", async () => {
    render(<KeccakHashTextOrFileClient messages={messages} />)

    const file = new File(["x".repeat(1536)], "notes.txt", {
      type: "text/plain",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    expect(await screen.findByText("notes.txt")).toBeTruthy()
    expect(screen.getByText("1.5 KB")).toBeTruthy()
  })

  test("shows an error for unreadable files and formats megabyte sizes", async () => {
    render(<KeccakHashTextOrFileClient messages={messages} />)

    const brokenFile = {
      name: "broken.bin",
      size: 2 * 1024 * 1024,
      arrayBuffer() {
        return Promise.reject(new Error("Broken file"))
      },
    } as unknown as File

    fireEvent.change(getFileInput(), {
      target: { files: [brokenFile] },
    })

    expect(await screen.findByText("broken.bin")).toBeTruthy()
    expect(screen.getByText("2.0 MB")).toBeTruthy()
    expect(await screen.findByText("Broken file")).toBeTruthy()
  })

  test("switches back to text mode after importing a file", async () => {
    render(<KeccakHashTextOrFileClient messages={messages} />)

    const file = new File(["hello from file"], "demo.txt", {
      type: "text/plain",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await screen.findByText(DIGESTS.file256)

    fireEvent.click(
      screen.getByRole("button", { name: messages.plainTextLabel })
    )

    expect(getPlainTextInput().value).toBe("Hello, browser-native world!")
    expect(await screen.findByText(DIGESTS.defaultText256)).toBeTruthy()
  })

  test("restores the last stored text value", async () => {
    window.localStorage.setItem(STORAGE_KEY, "stored value")

    render(<KeccakHashTextOrFileClient messages={messages} />)

    await waitFor(() => {
      expect(getPlainTextInput().value).toBe("stored value")
    })

    expect(await screen.findByText(DIGESTS.stored256)).toBeTruthy()
  })

  test("persists plain text edits to local storage", () => {
    render(<KeccakHashTextOrFileClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "persist me" },
    })

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("persist me")
  })
})
