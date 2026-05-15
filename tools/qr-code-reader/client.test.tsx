import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import QRCodeReaderClient from "./client"
import catalog from "./messages/en.json"
import meta from "./meta/en.json"
import {
  decodeQrFromImageFile,
  decodeQrFromVideoFrame,
} from "./core/qr-decoder"

import type { QRCodeReaderMessages } from "./client/types"

vi.mock("./core/qr-decoder", async () => {
  const actual =
    await vi.importActual<typeof import("./core/qr-decoder")>(
      "./core/qr-decoder"
    )

  return {
    ...actual,
    decodeQrFromImageFile: vi.fn(),
    decodeQrFromVideoFrame: vi.fn(),
  }
})

const messages: QRCodeReaderMessages = {
  meta,
  ...catalog,
}

const mockedDecodeImage = vi.mocked(decodeQrFromImageFile)
const mockedDecodeVideo = vi.mocked(decodeQrFromVideoFrame)

function getImageInput(): HTMLInputElement {
  return screen.getByTestId("qr-image-input") as HTMLInputElement
}

beforeEach(() => {
  mockedDecodeImage.mockReset()
  mockedDecodeVideo.mockReset()
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

describe("QRCodeReaderClient", () => {
  it("renders the upload source and empty result state", () => {
    render(<QRCodeReaderClient messages={messages} />)

    expect(screen.getByText(messages.sourceTitle)).toBeTruthy()
    expect(screen.getByText(messages.uploadTitle)).toBeTruthy()
    expect(screen.getByText(messages.emptyResultTitle)).toBeTruthy()
  })

  it("decodes an uploaded image and exposes a safe link action", async () => {
    mockedDecodeImage.mockResolvedValue({
      data: "example.com/docs",
      height: 120,
      width: 120,
    })

    render(<QRCodeReaderClient messages={messages} />)

    fireEvent.change(getImageInput(), {
      target: {
        files: [new File(["png"], "qr.png", { type: "image/png" })],
      },
    })

    await screen.findByText("example.com/docs")

    expect(mockedDecodeImage).toHaveBeenCalledTimes(1)
    expect(screen.getByText("qr.png")).toBeTruthy()
    const resultLink = screen.getByRole("link", {
      name: messages.openResultLabel,
    }) as HTMLAnchorElement

    expect(resultLink.href).toBe("https://example.com/docs")
  })

  it("shows upload errors for invalid images and images without a QR code", async () => {
    render(<QRCodeReaderClient messages={messages} />)

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
      expect(screen.getByText(messages.noQrFoundError)).toBeTruthy()
    })
  })

  it("decodes a camera frame and stops the media stream", async () => {
    const stopTrack = vi.fn()
    const getUserMedia = vi.fn().mockResolvedValue({
      getTracks: () => [{ stop: stopTrack }],
    } as unknown as MediaStream)

    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: { getUserMedia },
    })
    let attachedStream: unknown = null
    Object.defineProperty(HTMLMediaElement.prototype, "srcObject", {
      configurable: true,
      get() {
        return attachedStream
      },
      set(value) {
        attachedStream = value
      },
    })
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined)
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      callback(0)
      return 1
    })
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {})
    mockedDecodeVideo.mockReturnValue({
      data: "mailto:hello@example.com",
      height: 240,
      width: 240,
    })

    render(<QRCodeReaderClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("radio", { name: messages.cameraModeLabel })
    )
    fireEvent.click(
      await screen.findByRole("button", { name: messages.startCameraLabel })
    )

    await screen.findByText("mailto:hello@example.com")

    expect(getUserMedia).toHaveBeenCalledTimes(1)
    expect(mockedDecodeVideo).toHaveBeenCalledTimes(1)
    expect(stopTrack).toHaveBeenCalled()
  })
})
