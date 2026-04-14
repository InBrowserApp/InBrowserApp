import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import Base16DecoderClient from "./client"

const messages = {
  meta: {
    name: "Base16 Decoder",
    description:
      "Decode Base16 (Hex) text or files into raw bytes for inspection, testing, and tooling.",
  },
  base16InputLabel: "Hex Input",
  base16InputPlaceholder: "Enter Hex text...",
  importFromFileLabel: "Import from file",
  decodedOutputLabel: "Decoded Output",
  decodedOutputEmptyDescription: "Decoded text will appear here...",
  downloadFileLabel: "Download file",
  copyResultLabel: "Copy result",
  copiedLabel: "Copied",
  resetLabel: "Reset example",
  invalidBase16Title: "Invalid Hex text",
  fileReadFailedTitle: "Failed to read file",
  previewTruncatedLabel: "Preview truncated",
} as const

const STORAGE_KEY = "tools:base16-decoder:text"

beforeEach(() => {
  vi.stubGlobal(
    "URL",
    Object.assign({}, globalThis.URL, {
      createObjectURL: vi.fn(() => "blob:decoded-base16"),
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
    name: messages.base16InputLabel,
  }) as HTMLTextAreaElement
}

function getOutput() {
  return screen.getByRole("region", {
    name: messages.decodedOutputLabel,
  })
}

function getFileInput() {
  return document.querySelector('input[type="file"]') as HTMLInputElement
}

describe("Base16DecoderClient", () => {
  test("renders the default example, decoded text, and download link", async () => {
    render(<Base16DecoderClient messages={messages} />)

    await waitFor(() => {
      expect(getInput().value).toBe("48656C6C6F2C20576F726C6421")
    })

    expect(screen.getByText(messages.meta.description)).toBeTruthy()
    expect(getOutput().textContent).toContain("Hello, World!")
    expect(URL.createObjectURL).toHaveBeenCalled()

    const downloadLink = screen.getByRole("link", {
      name: messages.downloadFileLabel,
    })
    expect(downloadLink.getAttribute("href")).toBe("blob:decoded-base16")
    expect(downloadLink.getAttribute("download")).toBe("decoded.bin")
  })

  test("updates the decoded preview when the input changes", () => {
    render(<Base16DecoderClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: { value: "666F6F" },
    })

    expect(getOutput().textContent).toContain("foo")
  })

  test("shows an error and disables export actions for invalid hex", () => {
    render(<Base16DecoderClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: { value: "F" },
    })

    expect(screen.getByText(messages.invalidBase16Title)).toBeTruthy()
    expect(
      screen.getByRole("button", { name: messages.copyResultLabel })
    ).toHaveProperty("disabled", true)
    expect(
      screen.getByRole("button", { name: messages.downloadFileLabel })
    ).toHaveProperty("disabled", true)
  })

  test("imports hex from a selected file and derives a .bin filename", async () => {
    render(<Base16DecoderClient messages={messages} />)

    const file = new File(["666F6F"], "sample.hex", {
      type: "text/plain",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await waitFor(() => {
      expect(getInput().value).toBe("666F6F")
    })

    expect(getOutput().textContent).toContain("foo")

    const downloadLink = screen.getByRole("link", {
      name: messages.downloadFileLabel,
    })
    expect(downloadLink.getAttribute("download")).toBe("sample.bin")
  })

  test("falls back to decoded.bin when the uploaded file basename is empty", async () => {
    render(<Base16DecoderClient messages={messages} />)

    const file = new File(["666F6F"], ".hex", {
      type: "text/plain",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    const downloadLink = await screen.findByRole("link", {
      name: messages.downloadFileLabel,
    })
    expect(downloadLink.getAttribute("download")).toBe("decoded.bin")
  })

  test("shows a truncated preview for long decoded text", () => {
    render(<Base16DecoderClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: { value: "61".repeat(2001) },
    })

    expect(getOutput().textContent?.endsWith("...")).toBe(true)
    expect(screen.getByText(messages.previewTruncatedLabel)).toBeTruthy()
  })

  test("shows an error when file reading fails", async () => {
    render(<Base16DecoderClient messages={messages} />)

    const badFile = {
      name: "broken.hex",
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
    render(<Base16DecoderClient messages={messages} />)

    let rejectFileRead: ((reason?: unknown) => void) | null = null
    const staleFile = {
      name: "stale.hex",
      text: () =>
        new Promise<string>((_resolve, reject) => {
          rejectFileRead = reject
        }),
    } as File

    fireEvent.change(getFileInput(), {
      target: { files: [staleFile] },
    })
    fireEvent.change(getInput(), {
      target: { value: "626172" },
    })

    if (!rejectFileRead) {
      throw new Error("Expected stale file read reject callback")
    }

    const rejectStaleRead = rejectFileRead as (reason?: unknown) => void

    rejectStaleRead(new Error("late failure"))

    await waitFor(() => {
      expect(getOutput().textContent).toContain("bar")
    })

    expect(screen.queryByText(messages.fileReadFailedTitle)).toBeNull()
  })

  test("ignores stale successful file reads after newer text input", async () => {
    render(<Base16DecoderClient messages={messages} />)

    let resolveFileRead: ((value: string) => void) | null = null
    const slowFile = {
      name: "slow.hex",
      text: () =>
        new Promise<string>((resolve) => {
          resolveFileRead = resolve
        }),
    } as File

    fireEvent.change(getFileInput(), {
      target: { files: [slowFile] },
    })
    fireEvent.change(getInput(), {
      target: { value: "626172" },
    })

    if (!resolveFileRead) {
      throw new Error("Expected stale file read resolve callback")
    }

    const resolveStaleRead = resolveFileRead as (value: string) => void

    resolveStaleRead("666F6F")

    await waitFor(() => {
      expect(getInput().value).toBe("626172")
    })

    expect(getOutput().textContent).toContain("bar")
  })

  test("restores the last stored input value", async () => {
    window.localStorage.setItem(STORAGE_KEY, "666F6F")

    render(<Base16DecoderClient messages={messages} />)

    await waitFor(() => {
      expect(getInput().value).toBe("666F6F")
    })

    expect(getOutput().textContent).toContain("foo")
  })

  test("persists edits and resets the example", async () => {
    render(<Base16DecoderClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: { value: "74657374" },
    })

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("74657374")

    fireEvent.click(screen.getByRole("button", { name: messages.resetLabel }))

    await waitFor(() => {
      expect(getInput().value).toBe("48656C6C6F2C20576F726C6421")
    })

    expect(getOutput().textContent).toContain("Hello, World!")
  })
})
