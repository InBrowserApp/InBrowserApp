import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import Base58DecoderClient from "./client"
import { BASE58_ALPHABETS, encodeBase58 } from "./core/base58"

const messages = {
  meta: {
    name: "Base58 Decoder",
    description:
      "Decode Base58 text or files back to original data for transport, storage, and integration.",
  },
  optionsTitle: "Options",
  alphabetLabel: "Alphabet",
  alphabetBitcoinLabel: "Bitcoin",
  alphabetFlickrLabel: "Flickr",
  alphabetRippleLabel: "Ripple (XRP)",
  inputTitle: "Base58 Input",
  inputPlaceholder: "Enter Base58 text...",
  importFromFileLabel: "Import from file",
  decodedOutputTitle: "Decoded Output",
  decodedOutputEmptyDescription: "Decoded text will appear here...",
  downloadFileLabel: "Download file",
  previewTruncatedLabel: "Preview truncated",
  copyResultLabel: "Copy result",
  copiedLabel: "Copied",
  resetLabel: "Reset example",
  invalidBase58Title: "Invalid Base58 text",
  fileReadFailedTitle: "Failed to read file",
} as const

const STORAGE_KEYS = {
  text: "tools:base58-decoder:text",
  alphabet: "tools:base58-decoder:alphabet",
} as const

const encoder = new TextEncoder()

beforeEach(() => {
  let blobId = 0

  vi.stubGlobal(
    "URL",
    Object.assign({}, globalThis.URL, {
      createObjectURL: vi.fn(() => `blob:decoded-base58-${blobId++}`),
      revokeObjectURL: vi.fn(),
    })
  )

  window.localStorage.clear()
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function getInput() {
  return screen.getByRole("textbox", {
    name: messages.inputTitle,
  }) as HTMLTextAreaElement
}

function getOutput() {
  return screen.getByRole("region", {
    name: messages.decodedOutputTitle,
  })
}

function getFileInput() {
  return document.querySelector('input[type="file"]') as HTMLInputElement
}

function selectAlphabet(option: string) {
  fireEvent.click(
    screen.getByRole("combobox", { name: messages.alphabetLabel })
  )
  fireEvent.click(screen.getByRole("option", { name: option }))
}

describe("Base58DecoderClient", () => {
  test("renders the default example, decoded text, and download link", async () => {
    render(<Base58DecoderClient messages={messages} />)

    await waitFor(() => {
      expect(getInput().value).toBe("StV1DL6CwTryKyV")
    })

    expect(getOutput().textContent).toContain("hello world")
    expect(URL.createObjectURL).toHaveBeenCalled()

    const downloadLink = screen.getByRole("link", {
      name: messages.downloadFileLabel,
    })
    expect(downloadLink.getAttribute("href")).toBe("blob:decoded-base58-0")
    expect(downloadLink.getAttribute("download")).toBe("decoded.bin")
  })

  test("creates one download URL per stable decoded result", async () => {
    render(<Base58DecoderClient messages={messages} />)

    await waitFor(() => {
      expect(getOutput().textContent).toContain("hello world")
    })

    expect(URL.createObjectURL).toHaveBeenCalledTimes(1)
  })

  test("updates the decoded preview when the input changes", () => {
    render(<Base58DecoderClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: { value: encodeBase58(encoder.encode("foo")) },
    })

    expect(getOutput().textContent).toContain("foo")
  })

  test("updates decoding when the alphabet changes", () => {
    render(<Base58DecoderClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: {
        value: encodeBase58(encoder.encode("hello world"), {
          alphabet: BASE58_ALPHABETS.flickr,
        }),
      },
    })

    expect(getOutput().textContent).not.toContain("hello world")
    expect(screen.queryByText(messages.invalidBase58Title)).toBeNull()

    selectAlphabet(messages.alphabetFlickrLabel)

    expect(getOutput().textContent).toContain("hello world")
  })

  test("restores input and alphabet from localStorage", () => {
    window.localStorage.setItem(
      STORAGE_KEYS.text,
      encodeBase58(encoder.encode("hello world"), {
        alphabet: BASE58_ALPHABETS.ripple,
      })
    )
    window.localStorage.setItem(STORAGE_KEYS.alphabet, "ripple")

    render(<Base58DecoderClient messages={messages} />)

    expect(getOutput().textContent).toContain("hello world")
    expect(
      screen.getByRole("combobox", { name: messages.alphabetLabel }).textContent
    ).toContain(messages.alphabetRippleLabel)
  })

  test("falls back to the bitcoin alphabet for invalid stored values", () => {
    window.localStorage.setItem(STORAGE_KEYS.alphabet, "invalid")

    render(<Base58DecoderClient messages={messages} />)

    expect(
      screen.getByRole("combobox", { name: messages.alphabetLabel }).textContent
    ).toContain(messages.alphabetBitcoinLabel)
  })

  test("shows an error and disables export actions for invalid base58", () => {
    render(<Base58DecoderClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: { value: "0OIl" },
    })

    expect(screen.getByText(messages.invalidBase58Title)).toBeTruthy()
    expect(
      screen.getByRole("button", { name: messages.copyResultLabel })
    ).toHaveProperty("disabled", true)
    expect(
      screen.getByRole("button", { name: messages.downloadFileLabel })
    ).toHaveProperty("disabled", true)
  })

  test("imports base58 from a selected file and derives a .bin filename", async () => {
    render(<Base58DecoderClient messages={messages} />)

    const file = new File([encodeBase58(encoder.encode("foo"))], "sample.b58", {
      type: "text/plain",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await waitFor(() => {
      expect(getInput().value).toBe(encodeBase58(encoder.encode("foo")))
    })

    expect(getOutput().textContent).toContain("foo")

    const downloadLink = screen.getByRole("link", {
      name: messages.downloadFileLabel,
    })
    expect(downloadLink.getAttribute("download")).toBe("sample.bin")
  })

  test("shows a truncated preview for long decoded text", () => {
    render(<Base58DecoderClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: { value: encodeBase58(encoder.encode("a".repeat(2001))) },
    })

    expect(getOutput().textContent?.endsWith("...")).toBe(true)
    expect(screen.getByText(messages.previewTruncatedLabel)).toBeTruthy()
  })

  test("shows an error when file reading fails", async () => {
    render(<Base58DecoderClient messages={messages} />)

    const badFile = {
      name: "broken.b58",
      text: () => Promise.reject(new Error("nope")),
    } as File

    fireEvent.change(getFileInput(), {
      target: { files: [badFile] },
    })

    await waitFor(() => {
      expect(screen.getByText(messages.fileReadFailedTitle)).toBeTruthy()
    })
  })

  test("ignores stale file read failures after newer text input", async () => {
    render(<Base58DecoderClient messages={messages} />)

    let rejectFileRead: ((reason?: unknown) => void) | null = null
    const staleFile = {
      name: "stale.b58",
      text: () =>
        new Promise<string>((_resolve, reject) => {
          rejectFileRead = reject
        }),
    } as File

    fireEvent.change(getFileInput(), {
      target: { files: [staleFile] },
    })
    fireEvent.change(getInput(), {
      target: { value: encodeBase58(encoder.encode("bar")) },
    })

    if (!rejectFileRead) {
      throw new Error("Expected stale file read reject callback")
    }

    const rejectStaleFileRead = rejectFileRead as (reason?: unknown) => void
    rejectStaleFileRead(new Error("late failure"))

    await waitFor(() => {
      expect(getOutput().textContent).toContain("bar")
    })

    expect(screen.queryByText(messages.fileReadFailedTitle)).toBeNull()
  })

  test("resets the example and alphabet", () => {
    render(<Base58DecoderClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: { value: encodeBase58(encoder.encode("foo")) },
    })
    selectAlphabet(messages.alphabetFlickrLabel)
    fireEvent.click(screen.getByRole("button", { name: messages.resetLabel }))

    expect(getInput().value).toBe("StV1DL6CwTryKyV")
    expect(
      screen.getByRole("combobox", { name: messages.alphabetLabel }).textContent
    ).toContain(messages.alphabetBitcoinLabel)
    expect(getOutput().textContent).toContain("hello world")
  })
})
