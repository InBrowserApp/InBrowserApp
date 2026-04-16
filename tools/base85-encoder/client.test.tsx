import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import Base85EncoderClient from "./client"

const messages = {
  meta: {
    name: "Base85 Encoder",
    description:
      "Encode text or files to Base85 for data transport, storage, and web development.",
  },
  configurationLabel: "Configuration",
  configurationDescription:
    "Choose ASCII85 or Z85 before encoding text or file bytes.",
  alphabetLabel: "Alphabet",
  ascii85Label: "ASCII85",
  z85Label: "Z85",
  inputLabel: "Input",
  inputPlaceholder: "Enter text to encode...",
  plainTextLabel: "Plain text",
  plainTextDescription:
    "Paste or type any UTF-8 text, including emoji and non-Latin characters.",
  importFromFileLabel: "Import from file",
  encodedOutputLabel: "Base85 Encoded",
  encodedOutputDescription:
    "Encoded result for the current text or file input.",
  emptyStateDescription:
    "Enter text or import a file to generate Base85 output.",
  downloadFileLabel: "Download Base85",
  copyResultLabel: "Copy result",
  copiedLabel: "Copied",
  invalidLengthTitle:
    "Z85 requires input lengths that are a multiple of 4 bytes.",
  fileReadFailedTitle: "Failed to read file",
} as const

const TEXT_STORAGE_KEY = "tools:base85-encoder:text"
const VARIANT_STORAGE_KEY = "tools:base85-encoder:alphabet"

beforeEach(() => {
  vi.stubGlobal(
    "URL",
    Object.assign({}, globalThis.URL, {
      createObjectURL: vi.fn(() => "blob:encoded-base85"),
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

describe("Base85EncoderClient", () => {
  test("renders the default example, encoded output, and download link", async () => {
    render(<Base85EncoderClient messages={messages} />)

    await waitFor(() => {
      expect(getInput().value).toBe("Hello, World!")
    })

    await waitFor(() => {
      expect(getOutput().textContent).toContain("87cURD_*#4DfTZ)+T")
      expect(URL.createObjectURL).toHaveBeenCalled()
    })

    const downloadLink = await screen.findByRole("link", {
      name: messages.downloadFileLabel,
    })
    expect(downloadLink.getAttribute("href")).toBe("blob:encoded-base85")
    expect(downloadLink.getAttribute("download")).toBe("encoded.a85.txt")
  })

  test("updates the encoded output when the input changes", async () => {
    render(<Base85EncoderClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: { value: "foo" },
    })

    await waitFor(() => {
      expect(getOutput().textContent).toContain("AoDS")
    })
  })

  test("imports a selected file and derives a .a85 filename", async () => {
    render(<Base85EncoderClient messages={messages} />)

    const file = new File(["foo"], "sample.txt", {
      type: "text/plain",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await screen.findByText("sample.txt")

    await waitFor(() => {
      expect(getOutput().textContent).toContain("AoDS")
    })

    const downloadLink = await screen.findByRole("link", {
      name: messages.downloadFileLabel,
    })
    expect(downloadLink.getAttribute("download")).toBe("sample.a85")
  })

  test("switches to Z85, updates the output, and derives a .z85 filename", async () => {
    render(<Base85EncoderClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: { value: "test" },
    })

    fireEvent.click(
      screen.getByRole("combobox", { name: messages.alphabetLabel })
    )
    fireEvent.click(screen.getByRole("option", { name: messages.z85Label }))

    await waitFor(() => {
      expect(getOutput().textContent).toContain("By/Jn")
    })

    const downloadLink = await screen.findByRole("link", {
      name: messages.downloadFileLabel,
    })
    expect(downloadLink.getAttribute("download")).toBe("encoded.z85.txt")
  })

  test("shows a length error when Z85 input is not divisible by 4 bytes", async () => {
    render(<Base85EncoderClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("combobox", { name: messages.alphabetLabel })
    )
    fireEvent.click(screen.getByRole("option", { name: messages.z85Label }))

    await waitFor(() => {
      expect(screen.getByText(messages.invalidLengthTitle)).toBeTruthy()
    })
  })

  test("falls back to file.z85 when the uploaded file basename is empty", async () => {
    render(<Base85EncoderClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("combobox", { name: messages.alphabetLabel })
    )
    fireEvent.click(screen.getByRole("option", { name: messages.z85Label }))

    const file = new File(
      [Uint8Array.from([0x86, 0x4f, 0xd2, 0x6f, 0xb5, 0x59, 0xf7, 0x5b])],
      ".bin",
      { type: "application/octet-stream" }
    )

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    const downloadLink = await screen.findByRole("link", {
      name: messages.downloadFileLabel,
    })
    expect(downloadLink.getAttribute("download")).toBe("file.z85")
    expect(getOutput().textContent).toContain("HelloWorld")
  })

  test("returns to the stored plain text when leaving file mode", async () => {
    render(<Base85EncoderClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: { value: "foo" },
    })

    fireEvent.change(getFileInput(), {
      target: {
        files: [new File(["test"], "sample.txt", { type: "text/plain" })],
      },
    })

    await screen.findByRole("button", { name: messages.plainTextLabel })

    fireEvent.click(
      screen.getByRole("button", { name: messages.plainTextLabel })
    )

    await waitFor(() => {
      expect(getInput().value).toBe("foo")
      expect(getOutput().textContent).toContain("AoDS")
    })
  })

  test("shows an error when file reading fails", async () => {
    render(<Base85EncoderClient messages={messages} />)

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
    render(<Base85EncoderClient messages={messages} />)

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
      expect(getOutput().textContent).toContain("87cURD_*#4DfTZ)+T")
    })

    expect(screen.queryByText(messages.fileReadFailedTitle)).toBeNull()
  })

  test("restores the last stored input value and alphabet", async () => {
    window.localStorage.setItem(TEXT_STORAGE_KEY, "test")
    window.localStorage.setItem(VARIANT_STORAGE_KEY, "z85")

    render(<Base85EncoderClient messages={messages} />)

    await waitFor(() => {
      expect(getInput().value).toBe("test")
      expect(getOutput().textContent).toContain("By/Jn")
    })
  })
})
