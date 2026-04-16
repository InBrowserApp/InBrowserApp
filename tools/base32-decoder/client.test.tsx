import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import Base32DecoderClient from "./client"
import { encodeBase32 } from "./core/base32"

const messages = {
  meta: {
    name: "Base32 Decoder",
    description:
      "Decode Base32 text or files back into original bytes for transport, storage, and integration.",
  },
  base32InputLabel: "Base32 Input",
  base32InputPlaceholder: "Enter Base32 text...",
  importFromFileLabel: "Import from file",
  decodedOutputLabel: "Decoded Output",
  decodedOutputEmptyDescription: "Decoded text will appear here...",
  downloadFileLabel: "Download file",
  copyResultLabel: "Copy result",
  copiedLabel: "Copied",
  resetLabel: "Reset example",
  invalidBase32Title: "Invalid Base32 text",
  fileReadFailedTitle: "Failed to read file",
  previewTruncatedLabel: "Preview truncated",
} as const

const STORAGE_KEY = "tools:base32-decoder:text"

beforeEach(() => {
  vi.stubGlobal(
    "URL",
    Object.assign({}, globalThis.URL, {
      createObjectURL: vi.fn(() => "blob:decoded-base32"),
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
    name: messages.base32InputLabel,
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

describe("Base32DecoderClient", () => {
  test("renders the default example, decoded text, and download link", async () => {
    render(<Base32DecoderClient messages={messages} />)

    await waitFor(() => {
      expect(getInput().value).toBe("MZXW6===")
    })

    expect(screen.getAllByText(messages.base32InputLabel)).toHaveLength(1)
    expect(screen.getByText(messages.meta.description)).toBeTruthy()
    expect(getOutput().textContent).toContain("foo")
    expect(URL.createObjectURL).toHaveBeenCalled()

    const downloadLink = screen.getByRole("link", {
      name: messages.downloadFileLabel,
    })
    expect(downloadLink.getAttribute("href")).toBe("blob:decoded-base32")
    expect(downloadLink.getAttribute("download")).toBe("decoded.bin")
  })

  test("updates the decoded preview when the input changes", () => {
    render(<Base32DecoderClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: { value: encodeBase32(new TextEncoder().encode("test")) },
    })

    expect(getOutput().textContent).toContain("test")
  })

  test("shows an error and disables export actions for invalid base32", () => {
    render(<Base32DecoderClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: { value: "invalid" },
    })

    expect(screen.getByText(messages.invalidBase32Title)).toBeTruthy()
    expect(
      screen.getByRole("button", { name: messages.copyResultLabel })
    ).toHaveProperty("disabled", true)
    expect(
      screen.getByRole("button", { name: messages.downloadFileLabel })
    ).toHaveProperty("disabled", true)
  })

  test("imports base32 from a selected file and derives a .bin filename", async () => {
    render(<Base32DecoderClient messages={messages} />)

    const file = new File(["MZXW6==="], "sample.b32", {
      type: "text/plain",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await waitFor(() => {
      expect(getInput().value).toBe("MZXW6===")
    })

    await screen.findByText("Import from file: sample.b32")
    expect(getOutput().textContent).toContain("foo")

    const downloadLink = screen.getByRole("link", {
      name: messages.downloadFileLabel,
    })
    expect(downloadLink.getAttribute("download")).toBe("sample.bin")
  })

  test("falls back to decoded.bin when the uploaded file basename is empty", async () => {
    render(<Base32DecoderClient messages={messages} />)

    const file = new File(["MZXW6==="], ".b32", {
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

  test("clears the imported file state after manual edits", async () => {
    render(<Base32DecoderClient messages={messages} />)

    const file = new File(["MZXW6==="], "sample.b32", {
      type: "text/plain",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await screen.findByText("Import from file: sample.b32")

    fireEvent.change(getInput(), {
      target: { value: "MJQXE===" },
    })

    expect(screen.queryByText("Import from file: sample.b32")).toBeNull()

    const downloadLink = screen.getByRole("link", {
      name: messages.downloadFileLabel,
    })
    expect(downloadLink.getAttribute("download")).toBe("decoded.bin")
  })

  test("shows a truncated preview for long decoded text", () => {
    render(<Base32DecoderClient messages={messages} />)

    const longText = "a".repeat(2001)

    fireEvent.change(getInput(), {
      target: { value: encodeBase32(new TextEncoder().encode(longText)) },
    })

    expect(getOutput().textContent?.endsWith("...")).toBe(true)
    expect(screen.getByText(messages.previewTruncatedLabel)).toBeTruthy()
  })

  test("shows an error when file reading fails", async () => {
    render(<Base32DecoderClient messages={messages} />)

    const badFile = {
      name: "broken.b32",
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
    render(<Base32DecoderClient messages={messages} />)

    let rejectFileRead: ((reason?: unknown) => void) | null = null
    const staleFile = {
      name: "stale.b32",
      text: () =>
        new Promise<string>((_resolve, reject) => {
          rejectFileRead = reject
        }),
    } as File

    fireEvent.change(getFileInput(), {
      target: { files: [staleFile] },
    })
    fireEvent.change(getInput(), {
      target: { value: "MJQXE===" },
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
    render(<Base32DecoderClient messages={messages} />)

    let resolveFileRead: ((value: string) => void) | null = null
    const slowFile = {
      name: "slow.b32",
      text: () =>
        new Promise<string>((resolve) => {
          resolveFileRead = resolve
        }),
    } as File

    fireEvent.change(getFileInput(), {
      target: { files: [slowFile] },
    })
    fireEvent.change(getInput(), {
      target: { value: "MJQXE===" },
    })

    if (!resolveFileRead) {
      throw new Error("Expected stale file read resolve callback")
    }

    const resolveStaleRead = resolveFileRead as (value: string) => void

    resolveStaleRead("MZXW6===")

    await waitFor(() => {
      expect(getInput().value).toBe("MJQXE===")
    })

    expect(getOutput().textContent).toContain("bar")
  })

  test("restores the last stored input value", async () => {
    window.localStorage.setItem(STORAGE_KEY, "MZXW6===")

    render(<Base32DecoderClient messages={messages} />)

    await waitFor(() => {
      expect(getInput().value).toBe("MZXW6===")
    })

    expect(getOutput().textContent).toContain("foo")
  })

  test("persists edits and resets the example", async () => {
    render(<Base32DecoderClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: { value: "MJQXE===" },
    })

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("MJQXE===")

    fireEvent.click(screen.getByRole("button", { name: messages.resetLabel }))

    await waitFor(() => {
      expect(getInput().value).toBe("MZXW6===")
    })

    expect(getOutput().textContent).toContain("foo")
  })
})
