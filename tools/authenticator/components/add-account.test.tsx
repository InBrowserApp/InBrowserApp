import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"

import { createBackup } from "../backups"
import { parseSetupLink } from "../accounts"
import messages from "../messages/en.json"
import { AddAccount } from "./add-account"

const { scanImage, createQrEngine } = vi.hoisted(() => ({
  scanImage: vi.fn(),
  createQrEngine: vi.fn(),
}))

vi.mock("qr-scanner", () => ({
  default: {
    scanImage,
    createQrEngine,
    NO_QR_CODE_FOUND: "No QR code found",
  },
}))

const setupLink =
  "otpauth://totp/Example:user?secret=JBSWY3DPEHPK3PXP&issuer=Example"
const setup = parseSetupLink(setupLink)
const mediaDescriptor = Object.getOwnPropertyDescriptor(
  navigator,
  "mediaDevices"
)
const makeImage = () => new File(["image"], "setup.png", { type: "image/png" })

function setMedia(devices: Partial<MediaDevices>) {
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: devices,
  })
}

function testStream() {
  const stop = vi.fn()
  const track = Object.assign(new EventTarget(), { stop })
  const tracks = [track as unknown as MediaStreamVideoTrack]
  const stream = Object.assign(new MediaStream(), {
    getTracks: () => tracks,
    getVideoTracks: () => tracks,
  })
  return { stream, track, stop }
}

function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((complete) => {
    resolve = complete
  })
  return { promise, resolve }
}

function upload(label: string, files: File[]) {
  fireEvent.change(screen.getByLabelText(label), { target: { files } })
}

beforeEach(() => {
  scanImage.mockReset()
  createQrEngine.mockReset()
  createQrEngine.mockResolvedValue({})
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined)
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  if (mediaDescriptor) {
    Object.defineProperty(navigator, "mediaDevices", mediaDescriptor)
  } else {
    Reflect.deleteProperty(navigator, "mediaDevices")
  }
})

test("imports a QR image after showing feedback for an unrelated code", async () => {
  setMedia({})
  const onAdd = vi.fn()
  const click = vi.spyOn(HTMLInputElement.prototype, "click")
  render(<AddAccount messages={messages} onAdd={onAdd} />)

  expect(screen.queryByRole("button", { name: messages.camera })).toBeNull()
  expect(screen.queryByRole("button", { name: messages.screen })).toBeNull()
  fireEvent.click(screen.getByRole("button", { name: messages.chooseImage }))
  expect(click).toHaveBeenCalledTimes(1)
  upload(messages.chooseImage, [])
  expect(scanImage).not.toHaveBeenCalled()

  scanImage.mockResolvedValueOnce({ data: "https://example.com" })
  const file = makeImage()
  upload(messages.chooseImage, [file])
  await screen.findByText(messages.invalidQr)
  expect(onAdd).not.toHaveBeenCalled()

  scanImage.mockResolvedValueOnce({ data: setupLink })
  upload(messages.chooseImage, [file])
  await waitFor(() => expect(onAdd).toHaveBeenCalledWith([setup]))
  expect(screen.queryByText(messages.invalidQr)).toBeNull()
})

test("restores a local backup and shows the result of an unchanged import", async () => {
  setMedia({})
  const onAdd = vi.fn().mockReturnValue(messages.duplicate)
  const click = vi.spyOn(HTMLInputElement.prototype, "click")
  render(<AddAccount messages={messages} onAdd={onAdd} />)

  fireEvent.click(screen.getByRole("button", { name: messages.restore }))
  expect(click).toHaveBeenCalledTimes(1)
  upload(messages.restore, [new File(["{}"], "invalid.json")])
  await screen.findByText(messages.invalidBackup)

  upload(messages.restore, [new File([createBackup([setup])], "backup.json")])
  await screen.findByText(messages.duplicate)
  expect(onAdd).toHaveBeenCalledWith([setup])
})

test("discards a file read that finishes after leaving the add form", async () => {
  setMedia({})
  const onAdd = vi.fn()
  const { unmount } = render(<AddAccount messages={messages} onAdd={onAdd} />)
  const file = new File([""], "backup.json")
  const pending = deferred<string>()
  vi.spyOn(file, "text").mockReturnValue(pending.promise)
  upload(messages.restore, [file])
  await screen.findByText(messages.reading)
  unmount()

  await act(async () => {
    pending.resolve(createBackup([setup]))
    await pending.promise
  })
  expect(onAdd).not.toHaveBeenCalled()
})

test("returns focus to the camera action after a permission denial", async () => {
  const getUserMedia = vi
    .fn()
    .mockRejectedValue(new DOMException("Denied", "NotAllowedError"))
  setMedia({ getUserMedia })
  const onAdd = vi.fn()
  render(<AddAccount messages={messages} onAdd={onAdd} />)

  const camera = screen.getByRole("button", { name: messages.camera })
  fireEvent.click(camera)
  expect(getUserMedia).toHaveBeenCalledWith({
    video: { facingMode: { ideal: "environment" } },
    audio: false,
  })
  await screen.findByText(messages.scanError)
  await waitFor(() => expect(document.activeElement).toBe(camera))
  expect(screen.queryByRole("dialog")).toBeNull()
  expect(onAdd).not.toHaveBeenCalled()
})

test("stops a screen stream granted after closing the permission dialog", async () => {
  const pending = deferred<MediaStream>()
  const getDisplayMedia = vi.fn().mockReturnValue(pending.promise)
  setMedia({ getDisplayMedia })
  const onAdd = vi.fn()
  const { stream, stop } = testStream()
  render(<AddAccount messages={messages} onAdd={onAdd} />)

  const scanScreen = screen.getByRole("button", { name: messages.screen })
  fireEvent.click(scanScreen)
  expect(getDisplayMedia).toHaveBeenCalledWith({ video: true, audio: false })
  await screen.findByText(messages.starting)
  fireEvent.click(screen.getByRole("button", { name: messages.cancel }))
  await waitFor(() => expect(document.activeElement).toBe(scanScreen))
  await act(async () => {
    pending.resolve(stream)
    await pending.promise
  })

  expect(stop).toHaveBeenCalledOnce()
  expect(scanImage).not.toHaveBeenCalled()
  expect(onAdd).not.toHaveBeenCalled()
})

test("reuses the live QR decoder until a setup code is found, then stops capture", async () => {
  const { stream, stop } = testStream()
  setMedia({ getUserMedia: vi.fn().mockResolvedValue(stream) })
  const terminate = vi.fn()
  class DecoderWorker {
    terminate() {
      terminate()
    }
  }
  const engine = new DecoderWorker()
  createQrEngine.mockResolvedValue(engine)
  scanImage
    .mockRejectedValueOnce("No QR code found")
    .mockResolvedValueOnce({ data: "https://example.com" })
    .mockResolvedValueOnce({ data: setupLink })
  const onAdd = vi.fn()
  render(<AddAccount messages={messages} onAdd={onAdd} />)

  fireEvent.click(screen.getByRole("button", { name: messages.camera }))
  await screen.findByText(messages.scanning)
  await waitFor(() => expect(onAdd).toHaveBeenCalledWith([setup]))
  expect(createQrEngine).toHaveBeenCalledOnce()
  expect(scanImage).toHaveBeenCalledTimes(3)
  expect(scanImage).toHaveBeenLastCalledWith(
    expect.any(HTMLVideoElement),
    expect.objectContaining({ qrEngine: engine })
  )
  expect(stop).toHaveBeenCalledOnce()
  expect(terminate).toHaveBeenCalledOnce()
})

test("stops and offers an alternative if the browser ends screen sharing", async () => {
  const { stream, track, stop } = testStream()
  setMedia({ getDisplayMedia: vi.fn().mockResolvedValue(stream) })
  const pending = deferred<{ data: string }>()
  scanImage.mockReturnValue(pending.promise)
  const onAdd = vi.fn()
  render(<AddAccount messages={messages} onAdd={onAdd} />)

  fireEvent.click(screen.getByRole("button", { name: messages.screen }))
  await screen.findByText(messages.scanning)
  await act(async () => {
    track.dispatchEvent(new Event("ended"))
    pending.resolve({ data: setupLink })
    await pending.promise
  })
  await screen.findByText(messages.scanError)
  expect(stop).toHaveBeenCalledOnce()
  expect(onAdd).not.toHaveBeenCalled()
})
