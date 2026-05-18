import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import GifToApngClient from "./client"
import { convertGifToApng } from "./core/apng-conversion"

import type { GifToApngMessages } from "./client/types"
import type { GifToApngResult } from "./core/apng-conversion"

vi.mock("./core/apng-conversion", async () => {
  const actual = await vi.importActual<typeof import("./core/apng-conversion")>(
    "./core/apng-conversion"
  )

  return {
    ...actual,
    convertGifToApng: vi.fn(),
  }
})

const mockedConvertGifToApng = vi.mocked(convertGifToApng)

const messages = {
  canvasUnavailableError: "Canvas is unavailable.",
  changeFilesLabel: "Add or change GIFs",
  chooseFilesLabel: "Drop GIFs here or click to upload",
  clearAllLabel: "Clear all",
  conversionFailedError: "GIF conversion failed.",
  convertLabel: "Convert to APNG",
  convertingLabel: "Converting GIFs",
  dimensionsLabel: "Dimensions",
  downloadApngLabel: "Download APNG",
  downloadZipLabel: "Download ZIP",
  duplicateFileError: "That GIF is already selected.",
  emptyGifError: "The GIF has no frames.",
  emptyResultDescription: "Upload GIF files and run conversion.",
  emptyResultTitle: "No APNG files yet",
  errorTitle: "Could not convert GIF",
  fileSizeLabel: "File size",
  frameCountLabel: "frames",
  invalidFileTypeError: "Choose valid .gif files before converting.",
  invalidFrameError: "A GIF frame could not be decoded safely.",
  invalidGifError: "This file is not a valid GIF.",
  loopCountLabel: "Loop count",
  loopCustomLabel: "Custom",
  loopDescription: "Follow GIF reads the source loop count.",
  loopInheritLabel: "Follow GIF",
  loopInfiniteLabel: "Infinite",
  loopModeLabel: "Loop behavior",
  meta: {
    description: "Convert GIFs to APNG.",
    name: "GIF to APNG Converter",
  },
  noFilesError: "Upload at least one GIF before converting.",
  optionsDescription: "Resize frames and adjust playback.",
  optionsTitle: "Conversion settings",
  originalLabel: "Original",
  outputLabel: "Output",
  outputSummaryLabel: "Size change",
  partialConversionError: "Some GIFs could not be converted.",
  removeFileLabel: "Remove GIF",
  resultDescription: "Preview converted animations.",
  resultTitle: "APNG results",
  scaleDescription: "Resize every frame.",
  scaleLabel: "Scale",
  selectedFilesLabel: "Selected GIFs",
  speedDescription: "1x keeps source timing.",
  speedLabel: "Playback speed",
  supportedFormatsLabel: "GIF files only",
  totalOutputLabel: "Total output",
  uploadDescription: "Choose GIF files.",
  uploadHint: "Files stay on this device.",
  uploadTitle: "Upload GIF animations",
  zipFailedError: "ZIP packaging failed.",
} satisfies GifToApngMessages

function createGifFile(name: string, contents = "gif") {
  return new File([contents], name, {
    lastModified: 1,
    type: "image/gif",
  })
}

function createResult(file: File, outputName: string): GifToApngResult {
  return {
    blob: new Blob([`png:${outputName}`], { type: "image/png" }),
    delays: [50, 50],
    file,
    frameCount: 2,
    loopCount: 0,
    originalHeight: 80,
    originalWidth: 120,
    outputHeight: 80,
    outputName,
    outputWidth: 120,
  }
}

function getFileInput(): HTMLInputElement {
  return screen.getByTestId("gif-to-apng-input") as HTMLInputElement
}

beforeEach(() => {
  mockedConvertGifToApng.mockReset()
  mockedConvertGifToApng.mockImplementation(
    async (file, _options, outputName) =>
      createResult(file, outputName ?? "image.png")
  )

  let urlCounter = 0

  vi.spyOn(URL, "createObjectURL").mockImplementation(
    () => `blob:apng-${++urlCounter}`
  )
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe("GifToApngClient", () => {
  test("renders upload, options, and empty result states", () => {
    render(<GifToApngClient language="en" messages={messages} />)

    expect(screen.getByText(messages.uploadTitle)).toBeTruthy()
    expect(screen.getByText(messages.optionsTitle)).toBeTruthy()
    expect(screen.getByText(messages.emptyResultTitle)).toBeTruthy()
  })

  test("rejects non-GIF uploads", () => {
    render(<GifToApngClient language="en" messages={messages} />)

    fireEvent.change(getFileInput(), {
      target: {
        files: [new File(["png"], "image.png", { type: "image/png" })],
      },
    })

    expect(screen.getByText(messages.invalidFileTypeError)).toBeTruthy()
    expect(mockedConvertGifToApng).not.toHaveBeenCalled()
  })

  test("converts multiple GIFs and exposes individual and ZIP downloads", async () => {
    render(<GifToApngClient language="en" messages={messages} />)

    fireEvent.change(getFileInput(), {
      target: {
        files: [createGifFile("clip.gif"), createGifFile("clip.GIF", "gif2")],
      },
    })
    fireEvent.click(screen.getByRole("button", { name: messages.convertLabel }))

    await waitFor(() => {
      expect(mockedConvertGifToApng).toHaveBeenCalledTimes(2)
    })

    expect(screen.getByText("clip.png")).toBeTruthy()
    expect(screen.getByText("clip-2.png")).toBeTruthy()
    expect(
      screen.getAllByRole("link", { name: messages.downloadApngLabel })
    ).toHaveLength(2)
    expect(
      screen.getByRole("link", { name: messages.downloadZipLabel })
    ).toBeTruthy()
  })

  test("updates options before converting", async () => {
    render(<GifToApngClient language="en" messages={messages} />)

    fireEvent.change(getFileInput(), {
      target: { files: [createGifFile("clip.gif")] },
    })
    fireEvent.change(document.querySelector("#gif-to-apng-scale")!, {
      target: { value: "125" },
    })
    fireEvent.change(document.querySelector("#gif-to-apng-speed")!, {
      target: { value: "2" },
    })
    fireEvent.click(
      screen.getByRole("radio", { name: messages.loopCustomLabel })
    )
    fireEvent.change(document.querySelector("#gif-to-apng-loop-count")!, {
      target: { value: "4" },
    })
    fireEvent.click(screen.getByRole("button", { name: messages.convertLabel }))

    await waitFor(() => {
      expect(mockedConvertGifToApng).toHaveBeenCalledWith(
        expect.any(File),
        {
          loopCount: 4,
          loopMode: "custom",
          scale: 125,
          speed: 2,
        },
        "clip.png"
      )
    })
  })

  test("shows selected files and clears them", async () => {
    render(<GifToApngClient language="en" messages={messages} />)

    fireEvent.change(getFileInput(), {
      target: { files: [createGifFile("clip.gif")] },
    })

    expect(await screen.findByText("clip.gif")).toBeTruthy()
    expect(
      screen.getAllByText(`${messages.selectedFilesLabel}: 1`)
    ).toHaveLength(2)

    fireEvent.click(
      screen.getByRole("button", { name: messages.clearAllLabel })
    )

    await waitFor(() => {
      expect(screen.queryByText("clip.gif")).toBeNull()
    })
  })

  test("reports duplicate files and removes individual selections", async () => {
    const file = createGifFile("clip.gif")

    render(<GifToApngClient language="en" messages={messages} />)

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })
    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    expect(await screen.findByText(messages.duplicateFileError)).toBeTruthy()

    fireEvent.click(
      screen.getByRole("button", {
        name: `${messages.removeFileLabel}: clip.gif`,
      })
    )

    await waitFor(() => {
      expect(screen.queryByText("clip.gif")).toBeNull()
    })
  })

  test("accepts files dropped on the upload target", async () => {
    render(<GifToApngClient language="en" messages={messages} />)

    const dropTarget = screen.getByLabelText(messages.chooseFilesLabel)

    fireEvent.dragOver(dropTarget, {
      dataTransfer: {
        dropEffect: "none",
        files: [createGifFile("dropped.gif")],
      },
    })
    fireEvent.drop(dropTarget, {
      dataTransfer: {
        files: [createGifFile("dropped.gif")],
      },
    })

    expect(await screen.findByText("dropped.gif")).toBeTruthy()
  })

  test("maps conversion errors to user-facing messages", async () => {
    mockedConvertGifToApng.mockRejectedValueOnce(new Error("EMPTY_GIF"))

    render(<GifToApngClient language="en" messages={messages} />)

    fireEvent.change(getFileInput(), {
      target: { files: [createGifFile("empty.gif")] },
    })
    fireEvent.click(screen.getByRole("button", { name: messages.convertLabel }))

    await waitFor(() => {
      expect(screen.getByText(messages.emptyGifError)).toBeTruthy()
    })
  })
})
