import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import ImageToAvifClient from "./client"
import { convertImageFileToAvif } from "./core/avif-conversion"

import type { ImageToAvifMessages } from "./client/types"
import type { ImageToAvifResult } from "./core/avif-conversion"

vi.mock("./core/avif-conversion", async () => {
  const actual = await vi.importActual<typeof import("./core/avif-conversion")>(
    "./core/avif-conversion"
  )

  return {
    ...actual,
    convertImageFileToAvif: vi.fn(),
  }
})

const mockedConvertImageFileToAvif = vi.mocked(convertImageFileToAvif)

const messages: ImageToAvifMessages = {
  canvasUnavailableError: "Canvas is not available in this browser.",
  changeImagesLabel: "Add or change images",
  chooseImagesLabel: "Drag and drop images here, or click to upload",
  clearAllLabel: "Clear all",
  conversionFailedError: "Failed to convert the image. Please try again.",
  convertLabel: "Convert to AVIF",
  convertingLabel: "Converting images",
  dimensionsLabel: "Dimensions",
  downloadAvifLabel: "Download AVIF",
  downloadZipLabel: "Download ZIP",
  duplicateFileError: "That image is already selected.",
  emptyResultDescription:
    "Upload images and run conversion to see AVIF previews here.",
  emptyResultTitle: "No converted images yet",
  errorTitle: "Conversion issue",
  fileSizeLabel: "File size",
  invalidFileTypeError: "Select a valid image file to continue.",
  invalidImageError: "The image could not be read. Try a different file.",
  losslessDescription:
    "Preserve exact pixel values when size is less important than fidelity.",
  losslessLabel: "Lossless encoding",
  meta: {
    description:
      "Convert images to AVIF with quality, speed, resizing, lossless mode, and batch ZIP export.",
    name: "Image to AVIF Converter",
  },
  noFilesError: "Upload at least one image before converting.",
  optionsDescription:
    "Tune AVIF quality, encoder speed, and output size before export.",
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
  resultTitle: "AVIF results",
  savedLabel: "Saved",
  scaleDescription:
    "Resize the output from 10% to 400% of the original dimensions.",
  scaleLabel: "Scale",
  selectedImagesLabel: "Selected images",
  speedDescription:
    "Lower values spend more time searching for smaller files; higher values finish faster.",
  speedLabel: "Speed",
  supportedFormatsLabel:
    "Supports PNG, JPEG, GIF, SVG, WebP, AVIF, and other browser-readable images.",
  totalSavedLabel: "Total saved",
  uploadDescription:
    "Choose one or more local images to convert in your browser.",
  uploadHint: "Files stay on this device and are decoded locally.",
  uploadTitle: "Upload images",
  workerUnsupportedError:
    "This browser does not support the worker needed for AVIF encoding.",
  zipFailedError:
    "The images converted, but creating the ZIP failed. Download files individually.",
}

function createImageFile(name: string, type = "image/png") {
  return new File([new Uint8Array([1, 2, 3])], name, {
    lastModified: 1,
    type,
  })
}

function createResult(file: File, outputName: string): ImageToAvifResult {
  return {
    blob: new Blob([`avif:${outputName}`], { type: "image/avif" }),
    file,
    originalHeight: 300,
    originalWidth: 400,
    outputHeight: 300,
    outputName,
    outputWidth: 400,
  }
}

function getFileInput(): HTMLInputElement {
  return screen.getByTestId("image-to-avif-input") as HTMLInputElement
}

beforeEach(() => {
  mockedConvertImageFileToAvif.mockReset()
  mockedConvertImageFileToAvif.mockImplementation(
    async (file, _options, name) => createResult(file, name ?? "image.avif")
  )

  let urlCounter = 0

  vi.spyOn(URL, "createObjectURL").mockImplementation(
    () => `blob:avif-${++urlCounter}`
  )
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe("ImageToAvifClient", () => {
  test("renders upload, settings, and empty result states", () => {
    render(<ImageToAvifClient messages={messages} />)

    expect(screen.getByText(messages.uploadTitle)).toBeTruthy()
    expect(screen.getByText(messages.optionsTitle)).toBeTruthy()
    expect(screen.getByText(messages.emptyResultTitle)).toBeTruthy()
  })

  test("converts multiple selected images and prepares a zip download", async () => {
    render(<ImageToAvifClient messages={messages} />)

    fireEvent.change(getFileInput(), {
      target: {
        files: [createImageFile("photo.png"), createImageFile("photo.jpg")],
      },
    })

    fireEvent.click(screen.getByRole("button", { name: messages.convertLabel }))

    await waitFor(() => {
      expect(mockedConvertImageFileToAvif).toHaveBeenCalledTimes(2)
    })

    expect(screen.getByText("photo.avif")).toBeTruthy()
    expect(screen.getByText("photo-2.avif")).toBeTruthy()
    expect(
      screen.getByRole("link", { name: messages.downloadZipLabel })
    ).toBeTruthy()
    expect(
      screen.getAllByRole("link", { name: messages.downloadAvifLabel })
    ).toHaveLength(2)
  })

  test("shows selected files and clears them", async () => {
    const file = createImageFile("photo.png")

    render(<ImageToAvifClient messages={messages} />)

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
    mockedConvertImageFileToAvif.mockRejectedValueOnce(
      new Error("WORKER_UNSUPPORTED")
    )

    render(<ImageToAvifClient messages={messages} />)

    fireEvent.change(getFileInput(), {
      target: {
        files: [createImageFile("bad.png")],
      },
    })
    fireEvent.click(screen.getByRole("button", { name: messages.convertLabel }))

    await waitFor(() => {
      expect(screen.getByText(messages.workerUnsupportedError)).toBeTruthy()
    })
  })
})
