import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import ImageToIcoClient from "./client"

vi.mock("./core/convert-image-to-ico", async () => {
  const actual = await vi.importActual<
    typeof import("./core/convert-image-to-ico")
  >("./core/convert-image-to-ico")

  return {
    ...actual,
    convertImageFileToIco: vi.fn(
      async () => new Blob(["ico"], { type: "image/x-icon" })
    ),
  }
})

import { convertImageFileToIco } from "./core/convert-image-to-ico"

const mockedConvertImageFileToIco = vi.mocked(convertImageFileToIco)

const messages = {
  meta: {
    description: "Convert images into ICO files for favicons and app icons.",
    name: "Image to ICO Converter",
  },
  uploadTitle: "Upload image",
  uploadDescription: "Choose a source image and preview it before exporting.",
  chooseImageLabel: "Drag and drop an image here, or click to upload",
  uploadHint: "Use a square source image for the cleanest favicon results.",
  supportedFormatsLabel: "Supports PNG, JPEG, WebP, GIF, SVG, BMP, and more.",
  changeImageLabel: "Change image",
  removeFileLabel: "Remove image",
  optionsTitle: "Options",
  optionsDescription: "Pick the icon sizes and background treatment.",
  sizesLabel: "Sizes",
  sizesDescription: "Choose which square sizes to bundle into the ICO file.",
  backgroundLabel: "Background fill",
  backgroundDescription: "Fill transparent areas with a solid color.",
  backgroundColorLabel: "Background color",
  generateLabel: "Generate ICO",
  generatingLabel: "Generating ICO",
  resultTitle: "Result",
  resultDescription: "Download the generated ICO once it is ready.",
  emptyResultTitle: "No ICO yet",
  emptyResultDescription:
    "Upload an image and generate an ICO to see output details.",
  downloadLabel: "Download ICO",
  sizesIncludedLabel: "Included sizes",
  fileSizeLabel: "File size",
  errorTitle: "Error",
  onlyOneFileError: "Only one image can be processed at a time.",
  invalidFileTypeError: "Select a valid image file to continue.",
  selectSizeError: "Select at least one icon size.",
  invalidImageError: "The image could not be read. Try a different file.",
  canvasUnavailableError: "Canvas is not available in this browser.",
  conversionFailedError: "Failed to generate the ICO file. Please try again.",
} as const

function createImageFile(name = "favicon.png", type = "image/png") {
  return new File([new Uint8Array([1, 2, 3])], name, { type })
}

beforeEach(() => {
  mockedConvertImageFileToIco.mockClear()

  let urlCounter = 0

  vi.stubGlobal(
    "URL",
    Object.assign({}, globalThis.URL, {
      createObjectURL: vi.fn(() => `blob:mock-${++urlCounter}`),
      revokeObjectURL: vi.fn(),
    })
  )
})

afterEach(cleanup)

function getFileInput(): HTMLInputElement {
  return document.querySelector('input[type="file"]') as HTMLInputElement
}

describe("ImageToIcoClient", () => {
  test("renders the empty states", () => {
    render(<ImageToIcoClient messages={messages} />)

    expect(screen.getByText(messages.uploadTitle)).toBeTruthy()
    expect(screen.getByText(messages.optionsTitle)).toBeTruthy()
    expect(screen.getByText(messages.emptyResultTitle)).toBeTruthy()
  })

  test("accepts an image file and generates an ico", async () => {
    render(<ImageToIcoClient messages={messages} />)

    fireEvent.change(getFileInput(), {
      target: {
        files: [createImageFile()],
      },
    })

    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )

    const downloadLink = await screen.findByRole("link", {
      name: messages.downloadLabel,
    })

    expect(mockedConvertImageFileToIco).toHaveBeenCalledTimes(1)
    expect(downloadLink).toBeTruthy()
    expect(screen.getAllByText("256 × 256").length).toBeGreaterThan(0)
  })

  test("rejects unsupported files", async () => {
    render(<ImageToIcoClient messages={messages} />)

    fireEvent.change(getFileInput(), {
      target: {
        files: [createImageFile("notes.txt", "")],
      },
    })

    expect(screen.getByText(messages.invalidFileTypeError)).toBeTruthy()
    expect(mockedConvertImageFileToIco).not.toHaveBeenCalled()
  })

  test("maps conversion errors to user-facing messages", async () => {
    mockedConvertImageFileToIco.mockRejectedValueOnce(
      new Error("INVALID_IMAGE")
    )

    render(<ImageToIcoClient messages={messages} />)

    fireEvent.change(getFileInput(), {
      target: {
        files: [createImageFile()],
      },
    })

    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )

    await waitFor(() => {
      expect(screen.getByText(messages.invalidImageError)).toBeTruthy()
    })
  })
})
