import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import ImageMetadataCleanerClient from "./client"

vi.mock("./core/strip-image-metadata", () => ({
  stripImageMetadata: vi.fn(),
}))

import { stripImageMetadata } from "./core/strip-image-metadata"

const mockedStripImageMetadata = vi.mocked(stripImageMetadata)

const messages = {
  meta: {
    name: "Image Metadata Cleaner (EXIF)",
    description:
      "Remove EXIF/XMP/IPTC/ICC metadata from images without re-encoding.",
  },
  dragDropOrClick: "Click or drag image to upload",
  supportedFormats: "Supports JPEG, PNG, WebP",
  remove: "Remove",
  cleanMetadata: "Clean metadata",
  cleaningMetadata: "Cleaning metadata...",
  results: "Cleaning results",
  removed: "Metadata removed",
  reduction: "Size reduction",
  fileSize: "File size",
  downloadCleaned: "Download cleaned image",
  note: "Runs locally in your browser. No uploads.",
  error: "Error",
  unsupportedFormat: "Unsupported format. Please upload JPEG, PNG, or WebP.",
  cleaningComplete: "Metadata cleaned.",
  cleaningFailed: "Failed to clean metadata. Please try again.",
} as const

function createImageFile(
  name = "photo.jpg",
  type = "image/jpeg",
  bytes = [0x01, 0x02, 0x03, 0x04]
) {
  return new File([new Uint8Array(bytes)], name, { type })
}

function getFileInput() {
  return screen.getByLabelText(messages.dragDropOrClick) as HTMLInputElement
}

beforeEach(() => {
  let urlCounter = 0

  vi.stubGlobal(
    "URL",
    Object.assign({}, globalThis.URL, {
      createObjectURL: vi.fn(() => `blob:mock-${++urlCounter}`),
      revokeObjectURL: vi.fn(),
    })
  )
  mockedStripImageMetadata.mockReset()
})

afterEach(cleanup)

async function uploadFile(file: File) {
  fireEvent.change(getFileInput(), { target: { files: [file] } })

  await waitFor(() => {
    expect(screen.getByText(file.name)).toBeTruthy()
  })
}

describe("ImageMetadataCleanerClient", () => {
  test("renders the upload UI and keeps clean button disabled without a file", () => {
    render(<ImageMetadataCleanerClient messages={messages} />)

    expect(screen.getByText(messages.dragDropOrClick)).toBeTruthy()
    expect(screen.getByText(messages.supportedFormats)).toBeTruthy()
    expect(screen.getAllByText(messages.note).length).toBeGreaterThan(0)
    expect(
      screen.getByRole("button", { name: messages.cleanMetadata })
    ).toHaveProperty("disabled", true)
  })

  test("cleans metadata and renders a download link", async () => {
    mockedStripImageMetadata.mockReturnValue({
      cleaned: Uint8Array.from([0x01, 0x02]),
      removedBytes: 2,
      format: "jpeg",
    })

    render(<ImageMetadataCleanerClient messages={messages} />)

    const file = createImageFile()
    await uploadFile(file)

    fireEvent.click(
      screen.getByRole("button", { name: messages.cleanMetadata })
    )

    await waitFor(() => {
      expect(mockedStripImageMetadata).toHaveBeenCalledTimes(1)
      expect(screen.getByText(messages.cleaningComplete)).toBeTruthy()
    })

    const downloadLink = screen.getByRole("link", {
      name: messages.downloadCleaned,
    })

    expect(downloadLink.getAttribute("download")).toBe(file.name)
    expect(downloadLink.getAttribute("href")).toBe("blob:mock-2")
    expect(screen.getByText("2 B")).toBeTruthy()
    expect(screen.getByText("50%")).toBeTruthy()
  })

  test("maps unsupported format failures to the localized error message", async () => {
    mockedStripImageMetadata.mockImplementation(() => {
      throw new Error("Unsupported image format")
    })

    render(<ImageMetadataCleanerClient messages={messages} />)

    await uploadFile(createImageFile("photo.bin", "application/octet-stream"))

    fireEvent.click(
      screen.getByRole("button", { name: messages.cleanMetadata })
    )

    await waitFor(() => {
      expect(screen.getByText(messages.error)).toBeTruthy()
      expect(screen.getByText(messages.unsupportedFormat)).toBeTruthy()
    })
  })

  test("clearing the file removes the existing result", async () => {
    mockedStripImageMetadata.mockReturnValue({
      cleaned: Uint8Array.from([0x01, 0x02]),
      removedBytes: 2,
      format: "jpeg",
    })

    render(<ImageMetadataCleanerClient messages={messages} />)

    await uploadFile(createImageFile())
    fireEvent.click(
      screen.getByRole("button", { name: messages.cleanMetadata })
    )

    await waitFor(() => {
      expect(
        screen.getByRole("link", { name: messages.downloadCleaned })
      ).toBeTruthy()
    })

    fireEvent.click(screen.getByRole("button", { name: messages.remove }))

    await waitFor(() => {
      expect(
        screen.queryByRole("link", { name: messages.downloadCleaned })
      ).toBeNull()
    })
  })
})
