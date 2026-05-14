import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import ImageToWebpClient from "./client"
import { convertImageFileToWebp } from "./core/webp-conversion"

import type { ImageToWebpMessages } from "./client/types"
import type { ImageToWebpResult } from "./core/webp-conversion"

vi.mock("./core/webp-conversion", async () => {
  const actual = await vi.importActual<typeof import("./core/webp-conversion")>(
    "./core/webp-conversion"
  )

  return {
    ...actual,
    convertImageFileToWebp: vi.fn(),
  }
})

const mockedConvertImageFileToWebp = vi.mocked(convertImageFileToWebp)

const messages: ImageToWebpMessages = {
  canvasUnavailableError: "Canvas is not available in this browser.",
  changeImagesLabel: "Add or change images",
  chooseImagesLabel: "Drag and drop images here, or click to upload",
  clearAllLabel: "Clear all",
  conversionFailedError: "Failed to convert the image. Please try again.",
  convertLabel: "Convert to WebP",
  convertingLabel: "Converting images",
  dimensionsLabel: "Dimensions",
  downloadWebpLabel: "Download WebP",
  downloadZipLabel: "Download ZIP",
  duplicateFileError: "That image is already selected.",
  emptyResultDescription:
    "Upload images and run conversion to see WebP previews here.",
  emptyResultTitle: "No converted images yet",
  errorTitle: "Conversion issue",
  fileSizeLabel: "File size",
  invalidFileTypeError: "Select a valid image file to continue.",
  invalidImageError: "The image could not be read. Try a different file.",
  meta: {
    description:
      "Convert images to WebP with optional resizing and batch ZIP export.",
    name: "Image to WebP Converter",
  },
  noFilesError: "Upload at least one image before converting.",
  optionsDescription: "Tune WebP quality and resize images before export.",
  optionsTitle: "Conversion settings",
  originalLabel: "Original",
  outputLabel: "Output",
  partialConversionError: "Some files could not be converted.",
  qualityDescription:
    "Higher quality preserves more detail and usually creates larger files.",
  qualityLabel: "Quality",
  removeImageLabel: "Remove image",
  resultDescription:
    "Preview converted files and download individual images or a batch ZIP.",
  resultTitle: "WebP results",
  savedLabel: "Saved",
  scaleDescription:
    "Resize the output from 10% to 400% of the original dimensions.",
  scaleLabel: "Scale",
  selectedImagesLabel: "Selected images",
  supportedFormatsLabel:
    "Supports PNG, JPEG, GIF, SVG, AVIF, WebP, and other browser-readable images.",
  totalSavedLabel: "Total saved",
  uploadDescription:
    "Choose one or more local images to convert in your browser.",
  uploadHint: "Files stay on this device and are decoded locally.",
  uploadTitle: "Upload images",
  webpUnsupportedError: "This browser could not encode WebP from canvas.",
  zipFailedError:
    "The images converted, but creating the ZIP failed. Download files individually.",
}

function createImageFile(name: string, type = "image/png") {
  return new File([new Uint8Array([1, 2, 3])], name, {
    lastModified: 1,
    type,
  })
}

function createResult(file: File, outputName: string): ImageToWebpResult {
  return {
    blob: new Blob([`webp:${outputName}`], { type: "image/webp" }),
    file,
    originalHeight: 300,
    originalWidth: 400,
    outputHeight: 300,
    outputName,
    outputWidth: 400,
  }
}

function getFileInput(): HTMLInputElement {
  return screen.getByTestId("image-to-webp-input") as HTMLInputElement
}

beforeEach(() => {
  mockedConvertImageFileToWebp.mockReset()
  mockedConvertImageFileToWebp.mockImplementation(
    async (file, _options, name) => createResult(file, name ?? "image.webp")
  )

  let urlCounter = 0

  vi.spyOn(URL, "createObjectURL").mockImplementation(
    () => `blob:webp-${++urlCounter}`
  )
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe("ImageToWebpClient", () => {
  test("renders upload, settings, and empty result states", () => {
    render(<ImageToWebpClient messages={messages} />)

    expect(screen.getByText(messages.uploadTitle)).toBeTruthy()
    expect(screen.getByText(messages.optionsTitle)).toBeTruthy()
    expect(screen.getByText(messages.emptyResultTitle)).toBeTruthy()
  })

  test("converts multiple selected images and prepares a zip download", async () => {
    render(<ImageToWebpClient messages={messages} />)

    fireEvent.change(getFileInput(), {
      target: {
        files: [createImageFile("photo.png"), createImageFile("photo.jpg")],
      },
    })

    fireEvent.click(screen.getByRole("button", { name: messages.convertLabel }))

    await waitFor(() => {
      expect(mockedConvertImageFileToWebp).toHaveBeenCalledTimes(2)
    })

    expect(screen.getByText("photo.webp")).toBeTruthy()
    expect(screen.getByText("photo-2.webp")).toBeTruthy()
    expect(
      screen.getByRole("link", { name: messages.downloadZipLabel })
    ).toBeTruthy()
    expect(
      screen.getAllByRole("link", { name: messages.downloadWebpLabel })
    ).toHaveLength(2)
  })

  test("shows selected files and clears them", async () => {
    const file = createImageFile("photo.png")

    render(<ImageToWebpClient messages={messages} />)

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await screen.findByText("photo.png")

    expect(screen.getByText(`${messages.selectedImagesLabel}: 1`)).toBeTruthy()

    fireEvent.click(
      screen.getByRole("button", { name: messages.clearAllLabel })
    )

    await waitFor(() => {
      expect(screen.queryByText("photo.png")).toBeNull()
    })
  })

  test("maps conversion errors to user-facing messages", async () => {
    mockedConvertImageFileToWebp.mockRejectedValueOnce(
      new Error("WEBP_UNSUPPORTED")
    )

    render(<ImageToWebpClient messages={messages} />)

    fireEvent.change(getFileInput(), {
      target: {
        files: [createImageFile("bad.png")],
      },
    })
    fireEvent.click(screen.getByRole("button", { name: messages.convertLabel }))

    await waitFor(() => {
      expect(screen.getByText(messages.webpUnsupportedError)).toBeTruthy()
    })
  })
})
