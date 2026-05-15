import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import PngOptimizerClient from "./client"
import { createPngOptimizationResult } from "./core/png-optimizer"

import type { PngOptimizerMessages } from "./client/types"

const optimizePngFileMock = vi.hoisted(() => vi.fn())

vi.mock("./client/optimizer-worker", () => ({
  WORKER_UNAVAILABLE_ERROR: "PNG_OPTIMIZER_WORKER_UNAVAILABLE",
  optimizePngFile: optimizePngFileMock,
}))

const messages = {
  chooseFileLabel: "Choose PNG file",
  clearFileLabel: "Remove file",
  downloadOptimizedLabel: "Download optimized PNG",
  dropzoneDescription: "Drag a file into this area or click to browse.",
  dropzoneTitle: "Drop a PNG here",
  emptyResultDescription:
    "Upload a PNG and run optimization to see the size comparison.",
  emptyResultTitle: "No optimized PNG yet",
  errorTitle: "Could not optimize PNG",
  fasterLabel: "Faster",
  fileSizeLabel: "File size",
  interlaceDescription: "Write an interlaced PNG.",
  interlaceLabel: "PNG interlacing",
  invalidFileTypeError: "Please choose a valid PNG image file.",
  levelDescription: "Higher levels try more strategies and may take longer.",
  levelLabel: "Compression level",
  meta: {
    description: "Compress PNG images.",
    name: "PNG Optimizer",
  },
  noFileError: "Choose a PNG file before optimizing.",
  noReductionLabel: "No size reduction",
  optimizeAlphaDescription: "Simplify transparent pixels losslessly.",
  optimizeAlphaLabel: "Optimize alpha channel",
  optimizeButtonLabel: "Optimize PNG",
  optimizedSizeLabel: "Optimized size",
  optimizingButtonLabel: "Optimizing...",
  optimizationFailedError: "PNG optimization failed.",
  optionsDescription: "Tune the Oxipng pass before running compression.",
  optionsTitle: "Optimization options",
  originalSizeLabel: "Original size",
  pngOnlyLabel: "PNG files only",
  reductionLabel: "Reduction",
  replaceFileLabel: "Click or drop another PNG to replace it.",
  resultDescription: "Compare the output size and download the optimized PNG.",
  resultTitle: "Optimization result",
  savedLabel: "Saved",
  selectedFileLabel: "Selected file",
  smallerLabel: "Smaller",
  uploadDescription: "Choose one PNG file to compress locally in your browser.",
  uploadTitle: "Upload PNG image",
  workerUnavailableError:
    "This browser cannot start the PNG optimization worker.",
} satisfies PngOptimizerMessages

function createPngFile(
  contents = "1234567890",
  name = "photo.png",
  type = "image/png"
) {
  return new File([contents], name, { type })
}

function uploadFile(file: File) {
  fireEvent.change(screen.getByTestId("png-optimizer-input"), {
    target: { files: [file] },
  })
}

afterEach(() => {
  cleanup()
  optimizePngFileMock.mockReset()
  vi.unstubAllGlobals()
})

describe("PngOptimizerClient", () => {
  it("renders the empty upload and result states", () => {
    render(<PngOptimizerClient messages={messages} />)

    expect(screen.getByText("Drop a PNG here")).toBeTruthy()
    expect(screen.getByText("No optimized PNG yet")).toBeTruthy()
    expect(
      screen.getByRole<HTMLButtonElement>("button", { name: "Optimize PNG" })
        .disabled
    ).toBe(true)
  })

  it("rejects non-PNG uploads immediately", () => {
    render(<PngOptimizerClient messages={messages} />)

    uploadFile(createPngFile("jpg", "photo.jpg", "image/jpeg"))

    expect(screen.getByText("Could not optimize PNG")).toBeTruthy()
    expect(
      screen.getByText("Please choose a valid PNG image file.")
    ).toBeTruthy()
    expect(optimizePngFileMock).not.toHaveBeenCalled()
  })

  it("optimizes a selected PNG and exposes the download", async () => {
    vi.stubGlobal("URL", {
      createObjectURL: vi.fn(() => "blob:png"),
      revokeObjectURL: vi.fn(),
    })

    const file = createPngFile()
    const blob = new Blob(["1234"], { type: "image/png" })

    optimizePngFileMock.mockResolvedValueOnce(
      createPngOptimizationResult(file, blob, { level: 2 })
    )

    render(<PngOptimizerClient messages={messages} />)
    uploadFile(file)

    expect(await screen.findByText("photo.png")).toBeTruthy()

    fireEvent.click(screen.getByRole("button", { name: "Optimize PNG" }))

    expect(optimizePngFileMock).toHaveBeenCalledWith(file, {
      interlace: false,
      level: 2,
      optimiseAlpha: true,
    })
    expect(await screen.findByText("Saved: 6 B (60%)")).toBeTruthy()

    const downloadLink = screen.getByRole("link", {
      name: "Download optimized PNG",
    })

    expect(downloadLink.getAttribute("download")).toBe("photo-optimized.png")
    expect(downloadLink.getAttribute("href")).toBe("blob:png")
  })

  it("shows the worker unavailable error", async () => {
    optimizePngFileMock.mockRejectedValueOnce(
      new Error("PNG_OPTIMIZER_WORKER_UNAVAILABLE")
    )

    render(<PngOptimizerClient messages={messages} />)
    uploadFile(createPngFile())
    fireEvent.click(screen.getByRole("button", { name: "Optimize PNG" }))

    await waitFor(() => {
      expect(
        screen.getByText(
          "This browser cannot start the PNG optimization worker."
        )
      ).toBeTruthy()
    })
  })

  it("clears selected file and results", async () => {
    vi.stubGlobal("URL", {
      createObjectURL: vi.fn(() => "blob:png"),
      revokeObjectURL: vi.fn(),
    })

    render(<PngOptimizerClient messages={messages} />)
    uploadFile(createPngFile())

    expect(await screen.findByText("photo.png")).toBeTruthy()

    fireEvent.click(screen.getByRole("button", { name: "Remove file" }))

    expect(screen.queryByText("photo.png")).toBeNull()
    expect(screen.getByText("Drop a PNG here")).toBeTruthy()
  })
})
