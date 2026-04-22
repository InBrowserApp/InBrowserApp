import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import DataUriToFileConverterClient from "./client"

const messages = {
  meta: {
    name: "Data URI to File Converter",
    description:
      "Decode Data URI strings into files, inspect MIME type and encoding, and download the result offline.",
  },
  inputTitle: "Data URI Input",
  inputPlaceholder: "Paste Data URI here...",
  invalidDataUriTitle: "Invalid Data URI",
  detailsTitle: "Details",
  mimeTypeLabel: "MIME Type",
  encodingLabel: "Encoding",
  encodingBase64: "Base64",
  encodingUrlEncoded: "URL-encoded",
  sizeLabel: "Size",
  fileNameLabel: "File name",
  fileNamePlaceholder: "e.g. data.png",
  previewTitle: "Preview",
  decodedOutputTitle: "Decoded file",
  decodedOutputEmptyDescription:
    "Decoded file details, preview, and download will appear here.",
  previewUnavailableDescription:
    "This file type cannot be previewed in the browser. Download it to inspect the raw file.",
  previewTruncatedLabel: "Preview truncated",
  copyResultLabel: "Copy result",
  copiedLabel: "Copied",
  downloadFileLabel: "Download file",
  resetLabel: "Reset example",
} as const

beforeEach(() => {
  vi.stubGlobal(
    "URL",
    Object.assign({}, globalThis.URL, {
      createObjectURL: vi.fn(() => "blob:data-uri-preview"),
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

describe("DataUriToFileConverterClient", () => {
  test("renders the default sample with image preview and download", async () => {
    render(<DataUriToFileConverterClient messages={messages} />)

    expect(screen.getByDisplayValue(/data:image\/svg\+xml/i)).toBeTruthy()

    await waitFor(() => {
      expect(screen.getByAltText(messages.previewTitle)).toBeTruthy()
    })

    expect(screen.getByText("image/svg+xml")).toBeTruthy()
    expect(screen.getByDisplayValue("data.svg")).toBeTruthy()

    const downloadLink = screen.getByRole("link", {
      name: messages.downloadFileLabel,
    })
    expect(downloadLink.getAttribute("href")).toBe("blob:data-uri-preview")
    expect(downloadLink.getAttribute("download")).toBe("data.svg")
  })

  test("shows an error for invalid data URIs", async () => {
    render(<DataUriToFileConverterClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.inputTitle), {
      target: { value: "not-a-data-uri" },
    })

    await waitFor(() => {
      expect(screen.getByText(messages.invalidDataUriTitle)).toBeTruthy()
    })

    expect(
      screen.getByRole("button", { name: messages.downloadFileLabel })
    ).toHaveProperty("disabled", true)
  })

  test("shows a text preview and lets the filename be edited", async () => {
    render(<DataUriToFileConverterClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.inputTitle), {
      target: {
        value: "data:application/json,%7B%22hello%22%3A%22world%22%7D",
      },
    })

    await waitFor(() => {
      expect(
        screen.getByRole("region", { name: messages.previewTitle })
      ).toBeTruthy()
    })

    expect(screen.getByText('{"hello":"world"}')).toBeTruthy()
    expect(screen.getByDisplayValue("data.json")).toBeTruthy()
    expect(
      screen.getByRole("button", { name: messages.copyResultLabel })
    ).toBeTruthy()

    fireEvent.change(screen.getByLabelText(messages.fileNameLabel), {
      target: { value: "payload.json" },
    })

    expect(screen.getByDisplayValue("payload.json")).toBeTruthy()
  })

  test("restores saved input from localStorage and supports reset", async () => {
    window.localStorage.setItem(
      "tools:data-uri-to-file-converter:input",
      "data:,Hello%20world"
    )

    render(<DataUriToFileConverterClient messages={messages} />)

    await waitFor(() => {
      expect(screen.getByText("Hello world")).toBeTruthy()
    })

    fireEvent.click(screen.getByRole("button", { name: messages.resetLabel }))

    await waitFor(() => {
      expect(screen.getByAltText(messages.previewTitle)).toBeTruthy()
    })
  })
})
