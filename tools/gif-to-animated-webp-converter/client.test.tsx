import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import GifToAnimatedWebpClient from "./client"
import { convertGifFileToAnimatedWebpWithWorker } from "./client/conversion-worker-client"

import type { GifToAnimatedWebpMessages } from "./client/types"
import type { GifToAnimatedWebpResult } from "./core/animated-webp-conversion"

vi.mock("./client/conversion-worker-client", () => ({
  WORKER_UNAVAILABLE_ERROR: "GIF_TO_ANIMATED_WEBP_WORKER_UNAVAILABLE",
  convertGifFileToAnimatedWebpWithWorker: vi.fn(),
}))

const mockedConvertGifFileToAnimatedWebpWithWorker = vi.mocked(
  convertGifFileToAnimatedWebpWithWorker
)

const messages: GifToAnimatedWebpMessages = {
  canvasUnavailableError: "Canvas rendering is unavailable.",
  changeFilesLabel: "Add more GIFs",
  chooseGifsLabel: "Drag and drop GIFs here, or click to upload",
  clearAllLabel: "Clear all",
  conversionFailedError: "Failed to convert GIFs. Please try again.",
  convertLabel: "Convert to Animated WebP",
  convertingLabel: "Converting GIFs",
  dimensionsLabel: "Dimensions",
  downloadWebpLabel: "Download WebP",
  downloadZipLabel: "Download ZIP",
  duplicateFileError: "That GIF is already selected.",
  emptyGifError: "The GIF contains no frames.",
  emptyResultDescription:
    "Upload GIFs and run conversion to preview animated WebP files.",
  emptyResultTitle: "No animated WebP files yet",
  errorTitle: "Conversion issue",
  fileSizeLabel: "File size",
  invalidFileTypeError: "Select a valid GIF file to continue.",
  invalidFrameError: "GIF frames could not be decoded.",
  invalidGifError: "The file is not a readable GIF.",
  loopCountDescription: "Use a whole number of plays.",
  loopCountLabel: "Loop count",
  loopCustomLabel: "Custom count",
  loopDescription: "Choose whether to preserve or replace GIF loop metadata.",
  loopInheritLabel: "Follow GIF",
  loopInfiniteLabel: "Infinite",
  loopLabel: "Loop behavior",
  meta: {
    description: "Convert animated GIFs to animated WebP files.",
    name: "GIF to Animated WebP Converter",
  },
  noFilesError: "Upload at least one GIF before converting.",
  optionsDescription: "Control output size, playback speed, and loop behavior.",
  optionsTitle: "Conversion settings",
  originalLabel: "Original",
  outputLabel: "Output",
  partialConversionError: "Some GIFs could not be converted.",
  removeGifLabel: "Remove GIF",
  resultDescription:
    "Preview converted animations and download individual files or a ZIP.",
  resultTitle: "Animated WebP results",
  scaleDescription: "Resize frames from 10% to 400% of the original size.",
  scaleLabel: "Scale",
  selectedGifsLabel: "Selected GIFs",
  sizeChangeLabel: "Size change",
  speedDescription: "1x keeps the original timing; 2x plays twice as fast.",
  speedLabel: "Speed",
  supportedFormatsLabel: "Supports local .gif files.",
  totalSizeChangeLabel: "Total size change",
  uploadDescription: "Choose one or more local animated GIF files.",
  uploadHint: "Files stay private and are processed in this browser.",
  uploadTitle: "Upload GIFs",
  zipFailedError:
    "The GIFs converted, but creating the ZIP failed. Download files individually.",
}

function createGifFile(name: string, type = "image/gif") {
  return new File([new Uint8Array([0x47, 0x49, 0x46])], name, {
    lastModified: 1,
    type,
  })
}

function createResult(file: File, outputName: string): GifToAnimatedWebpResult {
  return {
    blob: new Blob([`webp:${outputName}`], { type: "image/webp" }),
    file,
    originalHeight: 120,
    originalWidth: 160,
    outputHeight: 120,
    outputName,
    outputWidth: 160,
  }
}

function getFileInput(): HTMLInputElement {
  return screen.getByTestId("gif-to-animated-webp-input") as HTMLInputElement
}

beforeEach(() => {
  mockedConvertGifFileToAnimatedWebpWithWorker.mockReset()
  mockedConvertGifFileToAnimatedWebpWithWorker.mockImplementation(
    async (file, _options, name) => createResult(file, name)
  )

  let urlCounter = 0

  vi.spyOn(URL, "createObjectURL").mockImplementation(
    () => `blob:animated-webp-${++urlCounter}`
  )
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe("GifToAnimatedWebpClient", () => {
  test("renders upload, settings, and empty result states", () => {
    render(<GifToAnimatedWebpClient messages={messages} />)

    expect(screen.getByText(messages.uploadTitle)).toBeTruthy()
    expect(screen.getByText(messages.optionsTitle)).toBeTruthy()
    expect(screen.getByText(messages.emptyResultTitle)).toBeTruthy()
  })

  test("converts multiple selected GIFs and prepares a zip download", async () => {
    render(<GifToAnimatedWebpClient messages={messages} />)

    fireEvent.change(getFileInput(), {
      target: {
        files: [createGifFile("clip.gif"), createGifFile("clip.GIF", "")],
      },
    })

    fireEvent.click(screen.getByRole("button", { name: messages.convertLabel }))

    await waitFor(() => {
      expect(
        mockedConvertGifFileToAnimatedWebpWithWorker
      ).toHaveBeenCalledTimes(2)
    })

    expect(screen.getByText("clip.webp")).toBeTruthy()
    expect(screen.getByText("clip-2.webp")).toBeTruthy()
    expect(
      screen.getByRole("link", { name: messages.downloadZipLabel })
    ).toBeTruthy()
    expect(
      screen.getAllByRole("link", { name: messages.downloadWebpLabel })
    ).toHaveLength(2)
  })

  test("disables conversion without files and shows selected files", async () => {
    const file = createGifFile("clip.gif")

    render(<GifToAnimatedWebpClient messages={messages} />)

    expect(
      screen.getByRole("button", { name: messages.convertLabel })
    ).toHaveProperty("disabled", true)

    fireEvent.change(getFileInput(), { target: { files: [file] } })
    await screen.findByText("clip.gif")

    expect(screen.getByText(`${messages.selectedGifsLabel}: 1`)).toBeTruthy()
  })

  test("clears selected files", async () => {
    render(<GifToAnimatedWebpClient messages={messages} />)

    fireEvent.change(getFileInput(), {
      target: { files: [createGifFile("clip.gif")] },
    })

    await screen.findByText("clip.gif")
    fireEvent.click(
      screen.getByRole("button", { name: messages.clearAllLabel })
    )

    await waitFor(() => {
      expect(screen.queryByText("clip.gif")).toBeNull()
    })
  })

  test("maps conversion errors to user-facing messages", async () => {
    mockedConvertGifFileToAnimatedWebpWithWorker.mockRejectedValueOnce(
      new Error("EMPTY_GIF")
    )

    render(<GifToAnimatedWebpClient messages={messages} />)

    fireEvent.change(getFileInput(), {
      target: { files: [createGifFile("empty.gif")] },
    })
    fireEvent.click(screen.getByRole("button", { name: messages.convertLabel }))

    await waitFor(() => {
      expect(screen.getByText(messages.emptyGifError)).toBeTruthy()
    })
  })
})
