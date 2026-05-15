import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import QrCodeGeneratorClient from "./client"
import { renderQrImageBlob } from "./client/render"
import messagesCatalog from "./messages/en.json"
import meta from "./meta/en.json"

import type { QrCodeGeneratorMessages } from "./client/types"

vi.mock("./client/render", () => ({
  renderQrImageBlob: vi.fn(async () => new Blob(["qr"], { type: "image/png" })),
  renderQrSvgMarkup: vi.fn(async () => "<svg><rect /></svg>"),
}))

const messages: QrCodeGeneratorMessages = { meta, ...messagesCatalog }

describe("QrCodeGeneratorClient", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.localStorage.clear()
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:qr")
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it("renders a QR preview from the default text payload", async () => {
    render(<QrCodeGeneratorClient messages={messages} />)

    expect(screen.getByLabelText(messages.textLabel).textContent).toBe(
      "https://inbrowser.app"
    )

    await waitFor(() => {
      expect(screen.getByAltText(messages.qrAlt)).toBeTruthy()
    })

    expect(
      vi.mocked(renderQrImageBlob).mock.calls.map((call) => call[2])
    ).toEqual(["image/png", "image/jpeg", "image/webp"])
    expect(
      (
        screen.getByRole("link", {
          name: messages.pngDownloadLabel,
        }) as HTMLAnchorElement
      ).getAttribute("download")
    ).toBe("qrcode.png")
    expect(
      (
        screen.getByRole("link", {
          name: messages.jpgDownloadLabel,
        }) as HTMLAnchorElement
      ).getAttribute("download")
    ).toBe("qrcode.jpg")
    expect(
      (
        screen.getByRole("link", {
          name: messages.webpDownloadLabel,
        }) as HTMLAnchorElement
      ).getAttribute("download")
    ).toBe("qrcode.webp")
  })

  it("shows an empty state when required content is missing", () => {
    render(<QrCodeGeneratorClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.textLabel), {
      target: { value: "" },
    })

    expect(screen.getByText(messages.emptyTitle)).toBeTruthy()
    expect(screen.getByText(messages.missingText)).toBeTruthy()
  })

  it("updates the encoded payload preview", () => {
    render(<QrCodeGeneratorClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.textLabel), {
      target: { value: "Hello QR" },
    })

    expect(
      screen.getByLabelText(messages.payloadPreviewLabel).textContent
    ).toBe("Hello QR")
  })
})
