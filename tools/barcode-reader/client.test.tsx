import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { BarcodeFormat } from "@zxing/library"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import BarcodeReaderClient from "./client"
import catalog from "./messages/en.json"
import meta from "./meta/en.json"
import {
  BARCODE_DECODER_ERRORS,
  createBarcodeReader,
  decodeBarcodeFromImageFile,
} from "./core/barcode-decoder"

import type { BarcodeReaderMessages } from "./client/types"

vi.mock("./core/barcode-decoder", async () => {
  const actual = await vi.importActual<typeof import("./core/barcode-decoder")>(
    "./core/barcode-decoder"
  )

  return {
    ...actual,
    createBarcodeReader: vi.fn(),
    decodeBarcodeFromImageFile: vi.fn(),
  }
})

const messages: BarcodeReaderMessages = {
  meta,
  ...catalog,
}

const mockedCreateReader = vi.mocked(createBarcodeReader)
const mockedDecodeImage = vi.mocked(decodeBarcodeFromImageFile)

function getImageInput(): HTMLInputElement {
  return screen.getByTestId("barcode-image-input") as HTMLInputElement
}

function createZxingResult(text: string, format: BarcodeFormat) {
  return {
    getBarcodeFormat: () => format,
    getText: () => text,
  }
}

beforeEach(() => {
  mockedCreateReader.mockReset()
  mockedDecodeImage.mockReset()
  Object.defineProperty(URL, "createObjectURL", {
    configurable: true,
    value: vi.fn(() => "blob:preview"),
  })
  Object.defineProperty(URL, "revokeObjectURL", {
    configurable: true,
    value: vi.fn(),
  })
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
  })
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe("BarcodeReaderClient", () => {
  it("renders the upload source and empty result state", () => {
    render(<BarcodeReaderClient messages={messages} />)

    expect(screen.getByText(messages.sourceTitle)).toBeTruthy()
    expect(screen.getByText(messages.uploadTitle)).toBeTruthy()
    expect(screen.getByText(messages.emptyResultTitle)).toBeTruthy()
  })

  it("decodes an uploaded image and exposes a safe link action", async () => {
    mockedDecodeImage.mockResolvedValue({
      format: "CODE_128",
      text: "example.com/items/100",
    })

    render(<BarcodeReaderClient messages={messages} />)

    fireEvent.change(getImageInput(), {
      target: {
        files: [new File(["png"], "label.png", { type: "image/png" })],
      },
    })

    await screen.findByText("example.com/items/100")

    expect(mockedDecodeImage).toHaveBeenCalledTimes(1)
    expect(screen.getByText("label.png")).toBeTruthy()
    expect(screen.getByText(/CODE 128/)).toBeTruthy()

    const resultLink = screen.getByRole("link", {
      name: messages.openResultLabel,
    }) as HTMLAnchorElement

    expect(resultLink.href).toBe("https://example.com/items/100")

    fireEvent.click(
      screen.getByRole("button", { name: messages.removeImageLabel })
    )

    expect(screen.getByText(messages.emptyResultTitle)).toBeTruthy()
  })

  it("shows upload errors for invalid images and images without a barcode", async () => {
    render(<BarcodeReaderClient messages={messages} />)

    fireEvent.change(getImageInput(), {
      target: {
        files: [new File(["txt"], "notes.txt", { type: "text/plain" })],
      },
    })

    expect(screen.getByText(messages.invalidFileTypeError)).toBeTruthy()

    mockedDecodeImage.mockResolvedValueOnce(null)

    fireEvent.change(getImageInput(), {
      target: {
        files: [new File(["png"], "empty.png", { type: "image/png" })],
      },
    })

    await waitFor(() => {
      expect(screen.getByText(messages.noBarcodeFoundError)).toBeTruthy()
    })
  })

  it("shows image decoding failures and ignores stale image results", async () => {
    mockedDecodeImage.mockRejectedValueOnce(
      new Error(BARCODE_DECODER_ERRORS.decodeFailed)
    )

    render(<BarcodeReaderClient messages={messages} />)

    fireEvent.change(getImageInput(), {
      target: {
        files: [new File(["png"], "broken.png", { type: "image/png" })],
      },
    })

    await screen.findByText(messages.decodeImageError)

    let resolveScan: (
      value: Awaited<ReturnType<typeof decodeBarcodeFromImageFile>>
    ) => void = () => undefined
    mockedDecodeImage.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveScan = resolve
      })
    )

    fireEvent.change(getImageInput(), {
      target: {
        files: [new File(["large"], "slow.png", { type: "image/png" })],
      },
    })

    await screen.findByText("slow.png")
    expect(screen.getByText(messages.decodingImageLabel)).toBeTruthy()

    fireEvent.click(
      screen.getByRole("button", { name: messages.removeImageLabel })
    )
    resolveScan({ format: "CODE_128", text: "late-result" })

    await waitFor(() => {
      expect(screen.queryByText("late-result")).toBeNull()
    })
  })

  it("accepts dropped images and keeps unsupported cameras in an empty state", async () => {
    mockedDecodeImage.mockResolvedValue({
      format: "EAN_13",
      text: "5901234123457",
    })

    render(<BarcodeReaderClient messages={messages} />)

    const uploadDropZone = screen.getByRole("button", {
      name: messages.chooseImageLabel,
    })
    fireEvent.dragEnter(uploadDropZone)
    fireEvent.dragOver(uploadDropZone, { dataTransfer: { dropEffect: "" } })
    fireEvent.dragLeave(uploadDropZone)
    fireEvent.drop(uploadDropZone, {
      dataTransfer: {
        files: [new File(["png"], "drop.png", { type: "image/png" })],
      },
    })

    await screen.findByText("5901234123457")
    fireEvent.click(
      screen.getAllByRole("button", { name: messages.changeImageLabel })[0]!
    )

    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: undefined,
    })

    fireEvent.click(
      screen.getByRole("radio", { name: messages.cameraModeLabel })
    )

    await screen.findByText(messages.cameraUnsupportedTitle)
  })

  it("formats larger selected image sizes", async () => {
    mockedDecodeImage
      .mockResolvedValueOnce({ format: "CODE_39", text: "kb-sized" })
      .mockResolvedValueOnce({ format: "CODE_39", text: "mb-sized" })

    render(<BarcodeReaderClient messages={messages} />)

    fireEvent.change(getImageInput(), {
      target: {
        files: [
          new File([new Uint8Array(2048)], "medium.png", {
            type: "image/png",
          }),
        ],
      },
    })

    await screen.findByText("2.0 KB")

    fireEvent.change(getImageInput(), {
      target: {
        files: [
          new File([new Uint8Array(1536 * 1024)], "large.png", {
            type: "image/png",
          }),
        ],
      },
    })

    await screen.findByText("1.5 MB")
  })

  it("decodes a camera result and stops scanning controls", async () => {
    const stopScanner = vi.fn()
    const decodeFromVideoDevice = vi.fn(async (_deviceId, _video, callback) => {
      callback(
        createZxingResult("mailto:hello@example.com", BarcodeFormat.QR_CODE),
        undefined
      )
      return { stop: stopScanner }
    })
    const getUserMedia = vi.fn()

    mockedCreateReader.mockReturnValue({
      decodeFromVideoDevice,
    } as unknown as ReturnType<typeof createBarcodeReader>)
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: { getUserMedia },
    })

    render(<BarcodeReaderClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("radio", { name: messages.cameraModeLabel })
    )
    fireEvent.click(
      await screen.findByRole("button", { name: messages.startCameraLabel })
    )

    await screen.findByText("mailto:hello@example.com")

    expect(decodeFromVideoDevice).toHaveBeenCalledTimes(1)
    expect(stopScanner).toHaveBeenCalled()
  })

  it("surfaces camera permission and frame errors", async () => {
    const permissionError = new DOMException("denied", "NotAllowedError")
    const decodeFromVideoDevice = vi.fn().mockRejectedValueOnce(permissionError)

    mockedCreateReader.mockReturnValue({
      decodeFromVideoDevice,
    } as unknown as ReturnType<typeof createBarcodeReader>)
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: { getUserMedia: vi.fn() },
    })

    render(<BarcodeReaderClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("radio", { name: messages.cameraModeLabel })
    )
    fireEvent.click(
      await screen.findByRole("button", { name: messages.startCameraLabel })
    )

    await screen.findByText(messages.cameraPermissionTitle)

    cleanup()
    mockedCreateReader.mockReset()

    const stopScanner = vi.fn()
    const failingFrameReader = vi.fn(async (_deviceId, _video, callback) => {
      callback(undefined, new Error("frame failed"))
      return { stop: stopScanner }
    })

    mockedCreateReader.mockReturnValue({
      decodeFromVideoDevice: failingFrameReader,
    } as unknown as ReturnType<typeof createBarcodeReader>)

    render(<BarcodeReaderClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("radio", { name: messages.cameraModeLabel })
    )
    fireEvent.click(
      await screen.findByRole("button", { name: messages.startCameraLabel })
    )

    await screen.findByText(messages.cameraFrameError)
    expect(stopScanner).toHaveBeenCalled()
  })

  it("stops an active camera session when switching back to upload mode", async () => {
    const stopScanner = vi.fn()
    const decodeFromVideoDevice = vi.fn().mockResolvedValue({
      stop: stopScanner,
    })

    mockedCreateReader.mockReturnValue({
      decodeFromVideoDevice,
    } as unknown as ReturnType<typeof createBarcodeReader>)
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: { getUserMedia: vi.fn() },
    })

    render(<BarcodeReaderClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("radio", { name: messages.cameraModeLabel })
    )
    fireEvent.click(
      await screen.findByRole("button", { name: messages.startCameraLabel })
    )

    await screen.findByText(messages.cameraScanningTitle)

    fireEvent.click(
      screen.getByRole("radio", { name: messages.uploadModeLabel })
    )

    expect(stopScanner).toHaveBeenCalled()
  })
})
