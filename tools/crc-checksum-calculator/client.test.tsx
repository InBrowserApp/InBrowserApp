import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import CrcChecksumCalculatorClient from "./client"

const messages = {
  meta: {
    name: "CRC Checksum Calculator",
    description: "Generate CRC checksums directly in your browser.",
  },
  inputLabel: "Input",
  plainTextLabel: "Plain text",
  plainTextDescription:
    "Paste UTF-8 text or use the standard 123456789 CRC check vector.",
  importFromFileLabel: "Import from file",
  selectedFileDescription: "CRC results are calculated from the selected file.",
  switchToTextLabel: "Use text input",
  checksumResultLabel: "CRC Results",
  checksumResultDescription:
    "Compare common CRC variants for the current input.",
  resultFilterLabel: "Filter CRC results",
  allResultsLabel: "All",
  crc8ResultsLabel: "8-bit",
  crc16ResultsLabel: "16-bit",
  crc32ResultsLabel: "32-bit",
  crc64ResultsLabel: "64-bit",
  otherResultsLabel: "Other",
  bitWidthLabel: "bit",
  checksumValueLabel: "Checksum",
  resultCountLabel: "{count} results shown",
  emptyInputTitle: "No input yet",
  emptyInputDescription: "Enter text or import a file to calculate CRC values.",
  copyResultLabel: "Copy result",
  copyVisibleResultsLabel: "Copy visible results",
  copiedLabel: "Copied",
  calculationError: "Failed to calculate CRC checksums.",
} as const

const STORAGE_KEY = "tools:crc-checksum-calculator:text"

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

function createSizedFile(name: string, size: number) {
  const file = new File(["x"], name, {
    type: "application/octet-stream",
  })
  Object.defineProperty(file, "size", {
    configurable: true,
    value: size,
  })
  return file
}

describe("CrcChecksumCalculatorClient", () => {
  test("renders the default check vector and CRC results", async () => {
    render(<CrcChecksumCalculatorClient messages={messages} />)

    expect(getPlainTextInput().value).toBe("123456789")
    expect(await screen.findByText("cbf43926")).toBeTruthy()
    expect(screen.getByText("995dc9bbdf1939fa")).toBeTruthy()
    expect(screen.getByText("20 results shown")).toBeTruthy()
  })

  test("updates text checksums when the input changes", async () => {
    render(<CrcChecksumCalculatorClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "hello" },
    })

    expect(await screen.findByText("3610a686")).toBeTruthy()
  })

  test("filters result cards by CRC width", async () => {
    render(<CrcChecksumCalculatorClient messages={messages} />)

    await screen.findByText("cbf43926")
    fireEvent.click(screen.getByRole("radio", { name: "64-bit" }))

    expect(screen.getByText("7 results shown")).toBeTruthy()
    expect(screen.getByText("CRC64 XZ")).toBeTruthy()
    expect(screen.queryByText("CRC32")).toBeNull()
  })

  test("filters one-bit and twenty-four-bit variants as other results", async () => {
    render(<CrcChecksumCalculatorClient messages={messages} />)

    await screen.findByText("cbf43926")
    fireEvent.click(screen.getByRole("radio", { name: "Other" }))

    expect(screen.getByText("2 results shown")).toBeTruthy()
    expect(screen.getByText("CRC1")).toBeTruthy()
    expect(screen.getByText("CRC24")).toBeTruthy()
    expect(screen.queryByText("CRC8")).toBeNull()
  })

  test("shows an empty state for blank text input", async () => {
    render(<CrcChecksumCalculatorClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "" },
    })

    expect(await screen.findByText(messages.emptyInputTitle)).toBeTruthy()
  })

  test("imports a file and renders file checksums", async () => {
    render(<CrcChecksumCalculatorClient messages={messages} />)

    const file = new File(["hello"], "payload.txt", {
      type: "text/plain",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await waitFor(() => {
      expect(screen.getByText("payload.txt")).toBeTruthy()
    })

    expect(
      screen.queryByRole("textbox", { name: messages.plainTextLabel })
    ).toBeNull()
    expect(await screen.findByText("3610a686")).toBeTruthy()
  })

  test("opens the file picker from the import button", async () => {
    const clickSpy = vi
      .spyOn(HTMLInputElement.prototype, "click")
      .mockImplementation(() => {})

    render(<CrcChecksumCalculatorClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("button", { name: messages.importFromFileLabel })
    )

    expect(clickSpy).toHaveBeenCalled()
    clickSpy.mockRestore()
  })

  test("ignores file picker changes without a selected file", async () => {
    render(<CrcChecksumCalculatorClient messages={messages} />)

    fireEvent.change(getFileInput(), {
      target: { files: [] },
    })

    expect(getPlainTextInput().value).toBe("123456789")
    expect(await screen.findByText("cbf43926")).toBeTruthy()
  })

  test("formats selected file sizes in kilobytes and megabytes", async () => {
    render(<CrcChecksumCalculatorClient messages={messages} />)

    fireEvent.change(getFileInput(), {
      target: { files: [createSizedFile("two-kb.bin", 2048)] },
    })

    expect(await screen.findByText("2 KB")).toBeTruthy()

    fireEvent.change(getFileInput(), {
      target: { files: [createSizedFile("two-mb.bin", 2 * 1024 * 1024)] },
    })

    expect(await screen.findByText("2 MB")).toBeTruthy()
  })

  test("shows calculation errors without discarding previous results", async () => {
    render(<CrcChecksumCalculatorClient messages={messages} />)

    await screen.findByText("cbf43926")
    const file = new File(["broken"], "broken.bin")
    vi.spyOn(file, "arrayBuffer").mockRejectedValue(new Error("cannot read"))

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    expect(await screen.findByText("cannot read")).toBeTruthy()
    expect(screen.getByText("cbf43926")).toBeTruthy()
  })

  test("switches back to text mode after importing a file", async () => {
    render(<CrcChecksumCalculatorClient messages={messages} />)

    fireEvent.change(getFileInput(), {
      target: {
        files: [new File(["hello"], "payload.txt", { type: "text/plain" })],
      },
    })
    await screen.findByText("payload.txt")

    fireEvent.click(
      screen.getByRole("button", { name: messages.switchToTextLabel })
    )

    expect(getPlainTextInput().value).toBe("123456789")
    expect(await screen.findByText("cbf43926")).toBeTruthy()
  })

  test("restores and persists text input with local storage", async () => {
    window.localStorage.setItem(STORAGE_KEY, "hello")

    render(<CrcChecksumCalculatorClient messages={messages} />)

    await waitFor(() => {
      expect(getPlainTextInput().value).toBe("hello")
    })
    expect(await screen.findByText("3610a686")).toBeTruthy()

    fireEvent.change(getPlainTextInput(), {
      target: { value: "persist me" },
    })

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("persist me")
  })
})
