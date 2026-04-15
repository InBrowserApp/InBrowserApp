import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import Base16EncoderClient from "./client"

const messages = {
  meta: {
    name: "Base16 Encoder",
    description:
      "Encode text or files to Base16 (Hex) for data transport, debugging, and web development.",
  },
  plainTextLabel: "Input",
  plainTextPlaceholder: "Enter text to encode...",
  importFromFileLabel: "Import from file",
  hexOutputLabel: "Hex Encoded",
  hexOutputEmptyDescription: "Hex output will appear here...",
  downloadHexLabel: "Download Hex",
  copyResultLabel: "Copy result",
  copiedLabel: "Copied",
  resetLabel: "Reset example",
  fileReadFailedTitle: "Failed to read file",
  previewTruncatedLabel: "Preview truncated",
} as const

const STORAGE_KEY = "tools:base16-encoder:text"

beforeEach(() => {
  vi.stubGlobal(
    "URL",
    Object.assign({}, globalThis.URL, {
      createObjectURL: vi.fn(() => "blob:encoded-base16"),
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
    name: messages.plainTextLabel,
  }) as HTMLTextAreaElement
}

function getOutput() {
  return screen.getByRole("region", {
    name: messages.hexOutputLabel,
  })
}

function getFileInput() {
  return document.querySelector('input[type="file"]') as HTMLInputElement
}

describe("Base16EncoderClient", () => {
  test("renders the default example, encoded text, and download link", async () => {
    render(<Base16EncoderClient messages={messages} />)

    await waitFor(() => {
      expect(getInput().value).toBe("Hello, World!")
    })

    expect(getOutput().textContent).toContain("48656C6C6F2C20576F726C6421")
    expect(URL.createObjectURL).toHaveBeenCalled()
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("Hello, World!")

    const downloadLink = screen.getByRole("link", {
      name: messages.downloadHexLabel,
    })
    expect(downloadLink.getAttribute("href")).toBe("blob:encoded-base16")
    expect(downloadLink.getAttribute("download")).toBe("encoded.hex.txt")
  })

  test("updates the encoded preview when the input changes", () => {
    render(<Base16EncoderClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: { value: "foo" },
    })

    expect(getOutput().textContent).toContain("666F6F")
  })

  test("imports a file and derives a .hex filename", async () => {
    render(<Base16EncoderClient messages={messages} />)

    const file = new File(["foo"], "sample.txt", {
      type: "text/plain",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await waitFor(() => {
      expect(screen.getByText("Import from file: sample.txt")).toBeTruthy()
    })

    expect(getOutput().textContent).toContain("666F6F")

    const downloadLink = screen.getByRole("link", {
      name: messages.downloadHexLabel,
    })
    expect(downloadLink.getAttribute("download")).toBe("sample.hex")
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("Hello, World!")
  })

  test("falls back to file.hex when the uploaded file basename is empty", async () => {
    render(<Base16EncoderClient messages={messages} />)

    const file = new File(["foo"], ".txt", {
      type: "text/plain",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    const downloadLink = await screen.findByRole("link", {
      name: messages.downloadHexLabel,
    })
    expect(downloadLink.getAttribute("download")).toBe("file.hex")
  })

  test("clears the imported file state after manual edits", async () => {
    render(<Base16EncoderClient messages={messages} />)

    const file = new File(["foo"], "sample.txt", {
      type: "text/plain",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await screen.findByText("Import from file: sample.txt")

    fireEvent.change(getInput(), {
      target: { value: "bar" },
    })

    expect(screen.queryByText("Import from file: sample.txt")).toBeNull()
    expect(getOutput().textContent).toContain("626172")

    const downloadLink = screen.getByRole("link", {
      name: messages.downloadHexLabel,
    })
    expect(downloadLink.getAttribute("download")).toBe("encoded.hex.txt")
  })

  test("shows a truncated preview for long encoded text", () => {
    render(<Base16EncoderClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: { value: "a".repeat(1001) },
    })

    expect(getOutput().textContent?.endsWith("...")).toBe(true)
    expect(screen.getByText(messages.previewTruncatedLabel)).toBeTruthy()
  })

  test("shows an error when file reading fails", async () => {
    render(<Base16EncoderClient messages={messages} />)

    const badFile = {
      name: "broken.bin",
      arrayBuffer: () => Promise.reject(new Error("nope")),
    } as File

    fireEvent.change(getFileInput(), {
      target: { files: [badFile] },
    })

    await waitFor(() => {
      expect(screen.getByText(messages.fileReadFailedTitle)).toBeTruthy()
    })
  })

  test("ignores stale file read failures after newer text input", async () => {
    render(<Base16EncoderClient messages={messages} />)

    let rejectFileRead: ((reason?: unknown) => void) | null = null
    const staleFile = {
      name: "stale.bin",
      arrayBuffer: () =>
        new Promise<ArrayBuffer>((_resolve, reject) => {
          rejectFileRead = reject
        }),
    } as File

    fireEvent.change(getFileInput(), {
      target: { files: [staleFile] },
    })
    fireEvent.change(getInput(), {
      target: { value: "bar" },
    })

    if (!rejectFileRead) {
      throw new Error("Expected stale file read reject callback")
    }

    const rejectStaleRead = rejectFileRead as (reason?: unknown) => void

    rejectStaleRead(new Error("late failure"))

    await waitFor(() => {
      expect(getOutput().textContent).toContain("626172")
    })

    expect(screen.queryByText(messages.fileReadFailedTitle)).toBeNull()
  })

  test("ignores stale successful file reads after newer text input", async () => {
    render(<Base16EncoderClient messages={messages} />)

    let resolveFileRead: ((value: ArrayBuffer) => void) | null = null
    const slowFile = {
      name: "slow.bin",
      arrayBuffer: () =>
        new Promise<ArrayBuffer>((resolve) => {
          resolveFileRead = resolve
        }),
    } as File

    fireEvent.change(getFileInput(), {
      target: { files: [slowFile] },
    })
    fireEvent.change(getInput(), {
      target: { value: "bar" },
    })

    if (!resolveFileRead) {
      throw new Error("Expected slow file read resolve callback")
    }

    const resolveSlowRead = resolveFileRead as (value: ArrayBuffer) => void

    resolveSlowRead(new TextEncoder().encode("foo").buffer)

    await waitFor(() => {
      expect(getOutput().textContent).toContain("626172")
    })

    expect(screen.queryByText("Import from file: slow.bin")).toBeNull()
  })
})
