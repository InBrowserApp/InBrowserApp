import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import ImageToPdfClient from "./client"
import {
  readImageDimensions,
  renderImageToJpeg,
} from "./client/image-processing"
import { SettingsCard } from "./client/settings-card"
import { UploadCard } from "./client/upload-card"
import { DEFAULT_CONVERTER_OPTIONS } from "./core/options"
import { createImagePdf } from "./core/pdf-document"

import type { ImageToPdfMessages } from "./client/types"

vi.mock("./client/image-processing", async () => {
  const actual = await vi.importActual<
    typeof import("./client/image-processing")
  >("./client/image-processing")

  return {
    ...actual,
    readImageDimensions: vi.fn(),
    renderImageToJpeg: vi.fn(),
  }
})

vi.mock("./core/pdf-document", async () => {
  const actual = await vi.importActual<typeof import("./core/pdf-document")>(
    "./core/pdf-document"
  )

  return {
    ...actual,
    createImagePdf: vi.fn(),
  }
})

const mockedReadImageDimensions = vi.mocked(readImageDimensions)
const mockedRenderImageToJpeg = vi.mocked(renderImageToJpeg)
const mockedCreateImagePdf = vi.mocked(createImagePdf)

const messages: ImageToPdfMessages = {
  addImagesLabel: "Add images",
  autoOrientation: "Auto",
  balancedQuality: "Balanced",
  bestQuality: "Best",
  canvasUnavailableError: "Canvas is unavailable.",
  changeImagesLabel: "Choose images",
  clearAllLabel: "Clear all",
  containFit: "Contain",
  coverFit: "Cover",
  downloadPdfLabel: "Download PDF",
  duplicateFileError: "That image is already in the page queue.",
  emptyQueueDescription: "Add images to build the PDF page order.",
  emptyQueueTitle: "No images yet",
  emptyResultDescription: "Add images, adjust settings, then generate the PDF.",
  emptyResultTitle: "No PDF yet",
  errorTitle: "Unable to create PDF",
  fileSizeLabel: "Input size",
  fitModeDescription: "Contain keeps the full image visible.",
  fitModeLabel: "Image fit",
  generateFailedError: "PDF generation failed.",
  generateLabel: "Generate PDF",
  generatingLabel: "Generating PDF...",
  imageCountLabel: "Images",
  invalidImageError: "One image could not be read.",
  invalidImageTypeError: "Only image files can be added.",
  landscapeOrientation: "Landscape",
  localOnlyNote: "Images stay in this browser session.",
  marginDescription: "White space around each image.",
  marginLabel: "Margin",
  meta: {
    description: "Combine images into a single PDF.",
    name: "Image to PDF Converter",
  },
  moveDownLabel: "Move down",
  moveUpLabel: "Move up",
  noImagesError: "Add at least one image before generating a PDF.",
  orientationLabel: "Orientation",
  outputSizeLabel: "Output size",
  pageCountLabel: "Pages",
  pageSizeDescription: "Each image becomes one PDF page.",
  pageSizeLabel: "Page size",
  pasteHint: "Click, drag images here, or paste from your clipboard.",
  portraitOrientation: "Portrait",
  previewAlt: "Preview of {name}",
  progressLabel: "Processing {completed} of {total} pages",
  qualityDescription: "Higher quality creates a larger PDF.",
  qualityLabel: "Image quality",
  queueDescription: "Review, rotate, and order images.",
  queueTitle: "Page queue",
  readingImagesLabel: "Reading images...",
  removeImageLabel: "Remove image",
  resultDescription: "Download the generated PDF.",
  resultReadyTitle: "PDF ready",
  resultTitle: "Result",
  rotateLabel: "Rotate 90 degrees",
  settingsDescription: "Choose PDF output settings.",
  settingsTitle: "PDF settings",
  smallQuality: "Small",
  supportedFormatsLabel: "Supports PNG, JPEG, WebP, GIF, BMP, and AVIF.",
  uploadDescription: "Add the images you want to turn into PDF pages.",
  uploadTitle: "Upload images",
}

function createImageFile(name = "photo.png", type = "image/png") {
  return new File([new Uint8Array([1, 2, 3])], name, {
    lastModified: 1,
    type,
  })
}

function getFileInput(): HTMLInputElement {
  return screen.getByTestId("image-to-pdf-input") as HTMLInputElement
}

beforeEach(() => {
  mockedReadImageDimensions.mockReset()
  mockedReadImageDimensions.mockResolvedValue({ width: 640, height: 480 })
  mockedRenderImageToJpeg.mockReset()
  mockedRenderImageToJpeg.mockResolvedValue({
    height: 480,
    jpegBytes: new Uint8Array([1, 2, 3]),
    width: 640,
  })
  mockedCreateImagePdf.mockReset()
  mockedCreateImagePdf.mockResolvedValue(new Uint8Array([37, 80, 68, 70]))

  let urlCounter = 0
  vi.spyOn(URL, "createObjectURL").mockImplementation(
    () => `blob:pdf-${++urlCounter}`
  )
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe("ImageToPdfClient", () => {
  test("renders the initial upload, queue, settings, and result states", () => {
    render(<ImageToPdfClient messages={messages} />)

    expect(screen.getByText(messages.uploadTitle)).toBeTruthy()
    expect(screen.getByText(messages.emptyQueueTitle)).toBeTruthy()
    expect(screen.getByText(messages.settingsTitle)).toBeTruthy()
    expect(screen.getByText(messages.emptyResultTitle)).toBeTruthy()
    expect(
      screen.getByRole("button", { name: messages.generateLabel })
    ).toHaveProperty("disabled", true)
  })

  test("adds images, updates the queue, and creates a downloadable PDF", async () => {
    render(<ImageToPdfClient messages={messages} />)

    fireEvent.change(getFileInput(), {
      target: {
        files: [createImageFile("scan.png"), createImageFile("wide.jpg")],
      },
    })

    await screen.findByText("scan.png")
    expect(screen.getByText("wide.jpg")).toBeTruthy()
    expect(screen.getByText(`${messages.imageCountLabel}: 2`)).toBeTruthy()

    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )

    await waitFor(() => {
      expect(mockedCreateImagePdf).toHaveBeenCalledTimes(1)
    })

    expect(mockedRenderImageToJpeg).toHaveBeenCalledTimes(2)
    expect(screen.getByText(messages.resultReadyTitle)).toBeTruthy()
    expect(
      screen
        .getByRole("link", { name: messages.downloadPdfLabel })
        .getAttribute("download")
    ).toBe("images-2-pages.pdf")
  })

  test("adds files from drop and paste interactions", async () => {
    render(<ImageToPdfClient messages={messages} />)

    fireEvent.drop(screen.getByLabelText(messages.addImagesLabel), {
      dataTransfer: {
        files: [createImageFile("dropped.png")],
      },
    })

    await screen.findByText("dropped.png")

    fireEvent.paste(window, {
      clipboardData: {
        files: [createImageFile("pasted.jpg", "image/jpeg")],
      },
    })

    await screen.findByText("pasted.jpg")
    expect(mockedReadImageDimensions).toHaveBeenCalledTimes(2)
  })

  test("applies output settings before generation", async () => {
    render(<ImageToPdfClient messages={messages} />)

    fireEvent.change(getFileInput(), {
      target: {
        files: [createImageFile("receipt.png")],
      },
    })

    await screen.findByText("receipt.png")
    fireEvent.click(screen.getByText(messages.landscapeOrientation))
    fireEvent.click(screen.getByText(messages.coverFit))
    fireEvent.click(screen.getByText(messages.bestQuality))
    fireEvent.change(
      screen.getByRole("spinbutton", { name: messages.marginLabel }),
      {
        target: { value: "25" },
      }
    )
    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )

    await waitFor(() => {
      expect(mockedCreateImagePdf).toHaveBeenCalledTimes(1)
    })

    expect(mockedRenderImageToJpeg.mock.calls[0]?.[1]).toMatchObject({
      qualityPreset: "best",
      rotation: 0,
    })
    expect(mockedCreateImagePdf.mock.calls[0]?.[0].options).toMatchObject({
      fitMode: "cover",
      marginMm: 25,
      pageOrientation: "landscape",
      qualityPreset: "best",
    })
  })

  test("shows progress while generation is pending", async () => {
    let resolvePdf!: (bytes: Uint8Array) => void
    mockedCreateImagePdf.mockReturnValueOnce(
      new Promise((resolve) => {
        resolvePdf = resolve
      })
    )

    render(<ImageToPdfClient messages={messages} />)

    fireEvent.change(getFileInput(), {
      target: {
        files: [createImageFile("scan.png")],
      },
    })

    await screen.findByText("scan.png")
    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )

    await screen.findByRole("button", { name: messages.generatingLabel })
    expect(
      screen.getByText(
        messages.progressLabel
          .replace("{completed}", "1")
          .replace("{total}", "1")
      )
    ).toBeTruthy()

    resolvePdf(new Uint8Array([37, 80, 68, 70]))

    await screen.findByText(messages.resultReadyTitle)
  })

  test("supports rotation and ordering before generation", async () => {
    render(<ImageToPdfClient messages={messages} />)

    fireEvent.change(getFileInput(), {
      target: {
        files: [createImageFile("first.png"), createImageFile("second.png")],
      },
    })

    await screen.findByText("first.png")
    fireEvent.click(
      screen.getByRole("button", {
        name: `${messages.rotateLabel}: first.png`,
      })
    )
    fireEvent.click(
      screen.getByRole("button", {
        name: `${messages.moveUpLabel}: second.png`,
      })
    )
    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )

    await waitFor(() => {
      expect(mockedRenderImageToJpeg).toHaveBeenCalledTimes(2)
    })

    expect(mockedRenderImageToJpeg.mock.calls[0]?.[0].name).toBe("second.png")
    expect(mockedRenderImageToJpeg.mock.calls[1]?.[0].name).toBe("first.png")
    expect(mockedRenderImageToJpeg.mock.calls[1]?.[1].rotation).toBe(90)
  })

  test("shows duplicate, invalid type, and invalid image errors", async () => {
    render(<ImageToPdfClient messages={messages} />)

    const file = createImageFile("scan.png")
    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })
    await screen.findByText("scan.png")
    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })
    await screen.findByText(messages.duplicateFileError)

    fireEvent.change(getFileInput(), {
      target: { files: [createImageFile("notes.txt", "text/plain")] },
    })
    await screen.findByText(messages.invalidImageTypeError)

    mockedReadImageDimensions.mockRejectedValueOnce(new Error("bad image"))
    fireEvent.change(getFileInput(), {
      target: { files: [createImageFile("bad.png")] },
    })
    await screen.findByText(messages.invalidImageError)
  })

  test("clears and removes queue items", async () => {
    render(<ImageToPdfClient messages={messages} />)

    fireEvent.change(getFileInput(), {
      target: {
        files: [createImageFile("scan.png"), createImageFile("other.png")],
      },
    })

    await screen.findByText("scan.png")
    fireEvent.click(
      screen.getByRole("button", {
        name: `${messages.removeImageLabel}: scan.png`,
      })
    )

    expect(screen.queryByText("scan.png")).toBeNull()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:pdf-1")

    fireEvent.click(
      screen.getByRole("button", { name: messages.clearAllLabel })
    )

    expect(screen.queryByText("other.png")).toBeNull()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:pdf-2")
  })

  test("maps generation failures to visible error states", async () => {
    mockedRenderImageToJpeg.mockRejectedValueOnce(
      new Error("CANVAS_UNAVAILABLE")
    )

    render(<ImageToPdfClient messages={messages} />)

    fireEvent.change(getFileInput(), {
      target: { files: [createImageFile("scan.png")] },
    })
    await screen.findByText("scan.png")
    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )

    await screen.findByText(messages.canvasUnavailableError)
  })

  test("ignores disabled drag and drop uploads", () => {
    const onFilesSelected = vi.fn()

    render(
      <UploadCard
        disabled={true}
        inputId="disabled-upload"
        isAddingImages={false}
        messages={messages}
        onFilesSelected={onFilesSelected}
      />
    )

    fireEvent.drop(screen.getByLabelText(messages.addImagesLabel), {
      dataTransfer: {
        files: [createImageFile("ignored.png")],
      },
    })

    expect(onFilesSelected).not.toHaveBeenCalled()
  })

  test("handles direct upload card interactions", () => {
    const onFilesSelected = vi.fn()
    const inputClickSpy = vi
      .spyOn(HTMLInputElement.prototype, "click")
      .mockImplementation(() => {})

    render(
      <UploadCard
        disabled={false}
        inputId="direct-upload"
        isAddingImages={true}
        messages={messages}
        onFilesSelected={onFilesSelected}
      />
    )

    expect(screen.getByText(messages.readingImagesLabel)).toBeTruthy()

    const dataTransfer = {
      dropEffect: "none",
      files: [createImageFile("dragged.png")],
    }

    fireEvent.dragOver(screen.getByLabelText(messages.addImagesLabel), {
      dataTransfer,
    })
    fireEvent.dragLeave(screen.getByLabelText(messages.addImagesLabel))
    fireEvent.drop(screen.getByLabelText(messages.addImagesLabel), {
      dataTransfer,
    })
    fireEvent.change(screen.getByTestId("image-to-pdf-input"), {
      target: { files: [createImageFile("picked.png")] },
    })
    fireEvent.click(
      screen.getByRole("button", { name: messages.changeImagesLabel })
    )

    expect(onFilesSelected).toHaveBeenCalledWith([
      expect.objectContaining({ name: "dragged.png" }),
    ])
    expect(onFilesSelected).toHaveBeenCalledWith([
      expect.objectContaining({ name: "picked.png" }),
    ])
    expect(inputClickSpy).toHaveBeenCalled()
  })

  test("handles direct settings card toggle actions", () => {
    const onOptionsChange = vi.fn()

    render(
      <SettingsCard
        canGenerate={true}
        disabled={false}
        isGenerating={false}
        messages={messages}
        onGenerate={vi.fn()}
        onOptionsChange={onOptionsChange}
        options={DEFAULT_CONVERTER_OPTIONS}
      />
    )

    fireEvent.click(screen.getByText(messages.portraitOrientation))
    fireEvent.click(screen.getByText(messages.coverFit))
    fireEvent.click(screen.getByText(messages.smallQuality))

    expect(onOptionsChange).toHaveBeenCalledWith({
      ...DEFAULT_CONVERTER_OPTIONS,
      pageOrientation: "portrait",
    })
    expect(onOptionsChange).toHaveBeenCalledWith({
      ...DEFAULT_CONVERTER_OPTIONS,
      fitMode: "cover",
    })
    expect(onOptionsChange).toHaveBeenCalledWith({
      ...DEFAULT_CONVERTER_OPTIONS,
      qualityPreset: "small",
    })
  })
})
