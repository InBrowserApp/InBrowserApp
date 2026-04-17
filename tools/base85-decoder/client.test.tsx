import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import Base85DecoderClient from "./client"

const messages = {
  meta: {
    name: "Base85 Decoder",
    description:
      "Decode ASCII85 or Z85 text and files back into original bytes without leaving the browser.",
  },
  alphabet: "Alphabet",
  alphabetAscii85: "ASCII85",
  alphabetZ85: "Z85",
  base85InputLabel: "Base85 Input",
  base85InputPlaceholder: "Enter Base85 text...",
  importFromFileLabel: "Import from file",
  decodedOutputLabel: "Decoded Output",
  decodedOutputEmptyDescription: "Decoded text will appear here...",
  downloadFileLabel: "Download file",
  copyLabel: "Copy",
  copiedLabel: "Copied",
  loadSample: "Load sample",
  invalidBase85Title: "Invalid Base85 text",
  fileReadFailedTitle: "Failed to read file",
  previewTruncatedLabel: "Preview truncated",
} as const

const STORAGE_KEYS = {
  alphabet: "tools:base85-decoder:alphabet",
  text: "tools:base85-decoder:text",
} as const

function encodeAscii85(text: string) {
  const bytes = new TextEncoder().encode(text)
  let output = ""

  for (let offset = 0; offset < bytes.length; offset += 4) {
    const chunk = bytes.subarray(offset, offset + 4)

    if (
      chunk.length === 4 &&
      chunk[0] === 0 &&
      chunk[1] === 0 &&
      chunk[2] === 0 &&
      chunk[3] === 0
    ) {
      output += "z"
      continue
    }

    let value = 0

    for (let index = 0; index < 4; index += 1) {
      value = value * 256 + (chunk[index] ?? 0)
    }

    const digits = Array.from({ length: 5 }, () => 0)

    for (let index = 4; index >= 0; index -= 1) {
      digits[index] = value % 85
      value = Math.floor(value / 85)
    }

    const encodedChunk = digits
      .map((digit) => String.fromCharCode(33 + digit))
      .join("")

    output +=
      chunk.length < 4 ? encodedChunk.slice(0, chunk.length + 1) : encodedChunk
  }

  return output
}

beforeEach(() => {
  vi.stubGlobal(
    "URL",
    Object.assign({}, globalThis.URL, {
      createObjectURL: vi.fn(() => "blob:decoded-base85"),
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
    name: messages.base85InputLabel,
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

function selectAlphabet(option: string) {
  fireEvent.click(screen.getByRole("combobox", { name: messages.alphabet }))
  fireEvent.click(screen.getByRole("option", { name: option }))
}

describe("Base85DecoderClient", () => {
  test("renders the default ASCII85 sample, decoded text, and download link", async () => {
    render(<Base85DecoderClient messages={messages} />)

    await waitFor(() => {
      expect(getInput().value).toBe("BOu!rD]j7BEbo7")
    })

    expect(screen.getByText(messages.meta.description)).toBeTruthy()
    expect(getOutput().textContent).toContain("hello world")
    expect(URL.createObjectURL).toHaveBeenCalled()

    const downloadLink = screen.getByRole("link", {
      name: messages.downloadFileLabel,
    })
    expect(downloadLink.getAttribute("href")).toBe("blob:decoded-base85")
    expect(downloadLink.getAttribute("download")).toBe("decoded.bin")
  })

  test("switches to the matching sample when the current input is still the default", async () => {
    render(<Base85DecoderClient messages={messages} />)

    selectAlphabet(messages.alphabetZ85)

    await waitFor(() => {
      expect(getInput().value).toBe("nm=QNz=Z<$y?aXj")
    })

    expect(getOutput().textContent).toContain("HelloWorld!!")
  })

  test("shows an error and disables export actions for invalid base85", () => {
    render(<Base85DecoderClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: { value: "invalid" },
    })

    expect(screen.getByText(messages.invalidBase85Title)).toBeTruthy()
    expect(
      screen.getByRole("button", { name: messages.copyLabel })
    ).toHaveProperty("disabled", true)
    expect(
      screen.getByRole("button", { name: messages.downloadFileLabel })
    ).toHaveProperty("disabled", true)
  })

  test("imports base85 from a selected file and derives a .bin filename", async () => {
    render(<Base85DecoderClient messages={messages} />)

    const file = new File(["BOu!rD]j7BEbo7"], "sample.a85", {
      type: "text/plain",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await waitFor(() => {
      expect(getInput().value).toBe("BOu!rD]j7BEbo7")
    })

    await screen.findByText("Import from file: sample.a85")
    expect(getOutput().textContent).toContain("hello world")

    const downloadLink = screen.getByRole("link", {
      name: messages.downloadFileLabel,
    })
    expect(downloadLink.getAttribute("download")).toBe("sample.bin")
  })

  test("falls back to decoded.bin when the uploaded file basename is empty", async () => {
    render(<Base85DecoderClient messages={messages} />)

    const file = new File(["BOu!rD]j7BEbo7"], ".a85", {
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

  test("restores stored text and alphabet", async () => {
    window.localStorage.setItem(STORAGE_KEYS.text, "nm=QNz=Z<$y?aXj")
    window.localStorage.setItem(STORAGE_KEYS.alphabet, "z85")

    render(<Base85DecoderClient messages={messages} />)

    await waitFor(() => {
      expect(getInput().value).toBe("nm=QNz=Z<$y?aXj")
    })

    expect(
      screen.getByRole("combobox", { name: messages.alphabet }).textContent
    ).toContain(messages.alphabetZ85)
    expect(getOutput().textContent).toContain("HelloWorld!!")
  })

  test("persists text and alphabet changes", async () => {
    render(<Base85DecoderClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: { value: "AoDS" },
    })
    selectAlphabet(messages.alphabetZ85)

    await waitFor(() => {
      expect(window.localStorage.getItem(STORAGE_KEYS.text)).toBe("AoDS")
      expect(window.localStorage.getItem(STORAGE_KEYS.alphabet)).toBe("z85")
    })
  })

  test("loads the current alphabet sample on demand", async () => {
    render(<Base85DecoderClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: { value: "" },
    })
    selectAlphabet(messages.alphabetZ85)
    fireEvent.click(screen.getByRole("button", { name: messages.loadSample }))

    await waitFor(() => {
      expect(getInput().value).toBe("nm=QNz=Z<$y?aXj")
    })
  })

  test("shows a truncated preview for long decoded text", () => {
    render(<Base85DecoderClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: { value: encodeAscii85("a".repeat(2001)) },
    })

    expect(getOutput().textContent?.endsWith("...")).toBe(true)
    expect(screen.getByText(messages.previewTruncatedLabel)).toBeTruthy()
  })

  test("shows an error when file reading fails", async () => {
    render(<Base85DecoderClient messages={messages} />)

    const badFile = {
      name: "broken.a85",
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
    render(<Base85DecoderClient messages={messages} />)

    let rejectFileRead: ((reason?: unknown) => void) | null = null
    const staleFile = {
      name: "stale.a85",
      text: () =>
        new Promise<string>((_resolve, reject) => {
          rejectFileRead = reject
        }),
    } as File

    fireEvent.change(getFileInput(), {
      target: { files: [staleFile] },
    })
    fireEvent.change(getInput(), {
      target: { value: "AoDS" },
    })

    if (!rejectFileRead) {
      throw new Error("Expected stale file read reject callback")
    }

    const rejectStaleRead = rejectFileRead as (reason?: unknown) => void

    rejectStaleRead(new Error("late failure"))

    await waitFor(() => {
      expect(getOutput().textContent).toContain("foo")
    })

    expect(screen.queryByText(messages.fileReadFailedTitle)).toBeNull()
  })
})
