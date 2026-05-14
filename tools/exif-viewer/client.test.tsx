import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import * as exifr from "exifr"

import ExifViewerClient from "./client"
import type { ExifViewerMessages } from "./client/types"

vi.mock("exifr", () => ({
  parse: vi.fn(),
}))

const messages: ExifViewerMessages = {
  meta: {
    name: "EXIF Viewer",
    description:
      "View image metadata, camera settings, GPS coordinates, and embedded EXIF/IPTC/XMP fields locally in your browser.",
  },
  categoriesFound: "Categories",
  categoryAdvanced: "Advanced information",
  categoryBasic: "Basic information",
  categoryCamera: "Camera information",
  categoryGps: "GPS location",
  changeImage: "Change image",
  copiedJson: "Copied",
  copyAsJson: "Copy as JSON",
  dragDropOrClick: "Drag and drop an image here, or click to upload",
  emptyDescription: "Upload an image to inspect embedded metadata.",
  emptyTitle: "No image selected",
  errorTitle: "Metadata issue",
  fieldName: "Field",
  fieldValue: "Value",
  fieldsFound: "Fields",
  fileSize: "File size",
  gpsAvailable: "Available",
  gpsStatus: "GPS",
  gpsUnavailable: "Not found",
  metadataResults: "Metadata results",
  noExifDescription:
    "The file opened successfully, but no readable metadata was found.",
  noExifTitle: "No readable metadata",
  openInAmap: "Open in Amap",
  openInGoogleMaps: "Open in Google Maps",
  parseError: "Failed to read image metadata.",
  readingDescription: "Parsing EXIF, IPTC, XMP, ICC, and GPS fields.",
  readingMetadata: "Reading metadata",
  removeImage: "Remove image",
  resultsDescription: "Review grouped fields and copy a sanitized JSON export.",
  selectedImage: "Selected image",
  supportedFormats: "Supports JPEG, PNG, HEIC, TIFF, WebP, and GIF.",
  unsupportedFile:
    "Unsupported file type. Please choose a JPEG, PNG, HEIC, TIFF, WebP, or GIF image.",
  uploadHint: "Runs locally in your browser. No uploads.",
}

function getInput(): HTMLInputElement {
  return screen.getByTestId("image-input") as HTMLInputElement
}

function renderClient(language = "en") {
  render(<ExifViewerClient language={language} messages={messages} />)
}

beforeEach(() => {
  vi.mocked(exifr.parse).mockReset()
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:exif-preview")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
  })
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe("ExifViewerClient", () => {
  it("renders upload and empty states", () => {
    renderClient()

    expect(screen.getByText(messages.dragDropOrClick)).toBeTruthy()
    expect(screen.getByText(messages.emptyTitle)).toBeTruthy()
  })

  it("reads metadata after selecting an image and hides Amap outside Chinese locales", async () => {
    vi.mocked(exifr.parse).mockResolvedValue({
      ImageWidth: 4000,
      Make: "Canon",
      latitude: 37.7749,
      longitude: -122.4194,
    })

    renderClient()
    fireEvent.change(getInput(), {
      target: {
        files: [new File(["jpg"], "photo.jpg", { type: "image/jpeg" })],
      },
    })

    await screen.findByText(messages.metadataResults)

    expect(exifr.parse).toHaveBeenCalledTimes(1)
    expect(screen.getByText("photo.jpg")).toBeTruthy()
    expect(screen.getByText("Canon")).toBeTruthy()
    expect(screen.getByText(messages.openInGoogleMaps)).toBeTruthy()
    expect(screen.queryByText(messages.openInAmap)).toBeNull()
  })

  it("shows Amap for Chinese locales", async () => {
    vi.mocked(exifr.parse).mockResolvedValue({
      latitude: 31.2304,
      longitude: 121.4737,
    })

    renderClient("zh-CN")
    fireEvent.change(getInput(), {
      target: {
        files: [new File(["jpg"], "photo.jpg", { type: "image/jpeg" })],
      },
    })

    expect(await screen.findByText(messages.openInAmap)).toBeTruthy()
  })

  it("copies metadata JSON", async () => {
    vi.mocked(exifr.parse).mockResolvedValue({ Make: "Canon" })

    renderClient()
    fireEvent.change(getInput(), {
      target: {
        files: [new File(["jpg"], "photo.jpg", { type: "image/jpeg" })],
      },
    })

    fireEvent.click(await screen.findByText(messages.copyAsJson))

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        '{\n  "Make": "Canon"\n}'
      )
    })
  })

  it("shows empty, unsupported, and parser error states", async () => {
    vi.mocked(exifr.parse).mockResolvedValueOnce(undefined)

    renderClient()
    fireEvent.change(getInput(), {
      target: {
        files: [new File(["gif"], "plain.gif", { type: "image/gif" })],
      },
    })

    expect(await screen.findByText(messages.noExifTitle)).toBeTruthy()

    fireEvent.change(getInput(), {
      target: {
        files: [new File(["txt"], "notes.txt", { type: "text/plain" })],
      },
    })
    expect(screen.getByText(messages.unsupportedFile)).toBeTruthy()

    vi.mocked(exifr.parse).mockRejectedValueOnce(new Error("bad metadata"))
    fireEvent.change(getInput(), {
      target: {
        files: [new File(["jpg"], "bad.jpg", { type: "image/jpeg" })],
      },
    })

    expect(await screen.findByText("bad metadata")).toBeTruthy()
  })
})
