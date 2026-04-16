import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import Base32EncoderClient from "./client"

const messages = {
  meta: {
    name: "Base32 Encoder",
    description:
      "Encode text or files to Base32 for data transport, storage, and web development.",
  },
  inputLabel: "Input",
  inputPlaceholder: "Enter text to encode...",
  plainTextLabel: "Plain text",
  plainTextDescription:
    "Paste or type any UTF-8 text, including emoji and non-Latin characters.",
  importFromFileLabel: "Import from file",
  encodedOutputLabel: "Base32 Encoded",
  encodedOutputEmptyDescription: "Base32 output will appear here...",
  downloadFileLabel: "Download Base32",
  copyResultLabel: "Copy result",
  copiedLabel: "Copied",
  fileReadFailedTitle: "Failed to read file",
} as const

const STORAGE_KEY = "tools:base32-encoder:text"

beforeEach(() => {
  vi.stubGlobal(
    "URL",
    Object.assign({}, globalThis.URL, {
      createObjectURL: vi.fn(() => "blob:encoded-base32"),
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
    name: messages.inputLabel,
  }) as HTMLTextAreaElement
}

function getOutput() {
  return screen.getByRole("region", {
    name: messages.encodedOutputLabel,
  })
}

function getFileInput() {
  return document.querySelector('input[type="file"]') as HTMLInputElement
}

describe("Base32EncoderClient", () => {
  test("renders the default example, encoded output, and download link", async () => {
    render(<Base32EncoderClient messages={messages} />)

    await waitFor(() => {
      expect(getInput().value).toBe("Hello, World!")
    })

    expect(screen.getByText(messages.meta.description)).toBeTruthy()
    await waitFor(() => {
      expect(getOutput().textContent).toContain("JBSWY3DPFQQFO33SNRSCC===")
      expect(URL.createObjectURL).toHaveBeenCalled()
    })

    const downloadLink = await screen.findByRole("link", {
      name: messages.downloadFileLabel,
    })
    expect(downloadLink.getAttribute("href")).toBe("blob:encoded-base32")
    expect(downloadLink.getAttribute("download")).toBe("encoded.base32.txt")
  })

  test("updates the encoded output when the input changes", async () => {
    render(<Base32EncoderClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: { value: "foo" },
    })

    await waitFor(() => {
      expect(getOutput().textContent).toContain("MZXW6===")
    })
  })

  test("imports a selected file and derives a .b32 filename", async () => {
    render(<Base32EncoderClient messages={messages} />)

    const file = new File(["foo"], "sample.txt", {
      type: "text/plain",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await screen.findByText("sample.txt")

    await waitFor(() => {
      expect(getOutput().textContent).toContain("MZXW6===")
    })

    const downloadLink = await screen.findByRole("link", {
      name: messages.downloadFileLabel,
    })
    expect(downloadLink.getAttribute("download")).toBe("sample.b32")
  })

  test("falls back to file.b32 when the uploaded file basename is empty", async () => {
    render(<Base32EncoderClient messages={messages} />)

    const file = new File(["foo"], ".txt", {
      type: "text/plain",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    const downloadLink = await screen.findByRole("link", {
      name: messages.downloadFileLabel,
    })
    expect(downloadLink.getAttribute("download")).toBe("file.b32")
  })

  test("falls back to file.b32 when the uploaded file name is missing", async () => {
    render(<Base32EncoderClient messages={messages} />)

    const namelessFile = {
      size: 3,
      arrayBuffer: async () => new TextEncoder().encode("foo").buffer,
    } as File

    fireEvent.change(getFileInput(), {
      target: { files: [namelessFile] },
    })

    const downloadLink = await screen.findByRole("link", {
      name: messages.downloadFileLabel,
    })
    expect(downloadLink.getAttribute("download")).toBe("file.b32")
  })

  test("returns to the stored plain text when leaving file mode", async () => {
    render(<Base32EncoderClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: { value: "bar" },
    })

    fireEvent.change(getFileInput(), {
      target: {
        files: [new File(["foo"], "sample.txt", { type: "text/plain" })],
      },
    })

    await screen.findByRole("button", { name: messages.plainTextLabel })

    fireEvent.click(
      screen.getByRole("button", { name: messages.plainTextLabel })
    )

    await waitFor(() => {
      expect(getInput().value).toBe("bar")
    })

    expect(getOutput().textContent).toContain("MJQXE===")
  })

  test("shows an error when file reading fails", async () => {
    render(<Base32EncoderClient messages={messages} />)

    const badFile = {
      name: "broken.bin",
      size: 0,
      arrayBuffer: () => Promise.reject(new Error("nope")),
    } as File

    fireEvent.change(getFileInput(), {
      target: { files: [badFile] },
    })

    await waitFor(() => {
      expect(screen.getByText(messages.fileReadFailedTitle)).toBeTruthy()
    })
  })

  test("ignores stale file read failures after returning to text mode", async () => {
    render(<Base32EncoderClient messages={messages} />)

    let rejectFileRead: ((reason?: unknown) => void) | null = null
    const staleFile = {
      name: "stale.bin",
      size: 0,
      arrayBuffer: () =>
        new Promise<ArrayBuffer>((_resolve, reject) => {
          rejectFileRead = reject
        }),
    } as File

    fireEvent.change(getFileInput(), {
      target: { files: [staleFile] },
    })

    await screen.findByRole("button", { name: messages.plainTextLabel })

    fireEvent.click(
      screen.getByRole("button", { name: messages.plainTextLabel })
    )

    if (!rejectFileRead) {
      throw new Error("Expected stale file read reject callback")
    }

    const rejectStaleRead = rejectFileRead as (reason?: unknown) => void

    rejectStaleRead(new Error("late failure"))

    await waitFor(() => {
      expect(getOutput().textContent).toContain("JBSWY3DPFQQFO33SNRSCC===")
    })

    expect(screen.queryByText(messages.fileReadFailedTitle)).toBeNull()
  })

  test("ignores stale successful file reads after a newer file is selected", async () => {
    render(<Base32EncoderClient messages={messages} />)

    let resolveSlowRead: ((value: ArrayBuffer) => void) | null = null
    const slowFile = {
      name: "slow.bin",
      size: 0,
      arrayBuffer: () =>
        new Promise<ArrayBuffer>((resolve) => {
          resolveSlowRead = resolve
        }),
    } as File

    const fastFile = new File(["bar"], "fast.txt", {
      type: "text/plain",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [slowFile] },
    })
    fireEvent.change(getFileInput(), {
      target: { files: [fastFile] },
    })

    if (!resolveSlowRead) {
      throw new Error("Expected stale file read resolve callback")
    }

    const resolveStaleRead = resolveSlowRead as (value: ArrayBuffer) => void

    resolveStaleRead(new TextEncoder().encode("foo").buffer)

    await waitFor(() => {
      expect(getOutput().textContent).toContain("MJQXE===")
    })

    expect(getOutput().textContent).not.toContain("MZXW6===")
  })

  test("restores the last stored input value", async () => {
    window.localStorage.setItem(STORAGE_KEY, "test")

    render(<Base32EncoderClient messages={messages} />)

    await waitFor(() => {
      expect(getInput().value).toBe("test")
    })

    expect(getOutput().textContent).toContain("ORSXG5A=")
  })
})
