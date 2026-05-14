import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import CameraClient from "./client"

import type { CameraMessages } from "./types"

const messages: CameraMessages = {
  meta: {
    name: "Camera",
    description: "Use your device camera locally.",
  },
  viewfinderTitle: "Camera",
  viewfinderDescription: "Start a local camera preview.",
  startCameraLabel: "Start camera",
  stopCameraLabel: "Stop camera",
  retryPermissionLabel: "Retry permission",
  preparingCamera: "Preparing camera...",
  cameraIdleTitle: "Camera is off",
  cameraIdleDescription: "Start the preview when ready.",
  cameraActiveLabel: "Camera active",
  cameraNotSupportedTitle: "Camera is not supported",
  cameraNotSupportedDescription: "Try HTTPS or localhost.",
  cameraPermissionDeniedTitle: "Camera permission denied",
  cameraPermissionDeniedDescription: "Allow camera access.",
  cameraErrorTitle: "Camera unavailable",
  cameraErrorDescription: "The camera could not be opened.",
  cameraNotReady: "Camera is not ready yet.",
  photoMode: "Photo",
  videoMode: "Video",
  capturePhotoLabel: "Take photo",
  startRecordingLabel: "Start recording",
  stopRecordingLabel: "Stop recording",
  recordingStatusLabel: "REC",
  videoNotSupported: "Video recording is not supported in this browser.",
  recordingFailed: "Recording could not be started.",
  switchCameraLabel: "Switch camera",
  torchLabel: "Torch",
  torchOnLabel: "Turn torch on",
  torchOffLabel: "Turn torch off",
  micOnLabel: "Mute microphone",
  micOffLabel: "Unmute microphone",
  zoomLabel: "Zoom",
  outputTitle: "Capture output",
  outputDescription: "Review the latest capture.",
  emptyOutputTitle: "No capture yet",
  emptyOutputDescription: "Take a photo or finish recording.",
  photoOutputLabel: "Photo",
  videoOutputLabel: "Video",
  formatLabel: "Format",
  fileSizeLabel: "File size",
  downloadLabel: "Download capture",
  clearLabel: "Clear",
  formatUnknown: "Unknown",
  photoName: "photo",
  videoName: "video",
}

const originalMediaDevices = Object.getOwnPropertyDescriptor(
  navigator,
  "mediaDevices"
)
const originalSrcObject = Object.getOwnPropertyDescriptor(
  HTMLMediaElement.prototype,
  "srcObject"
)
const originalPlay = HTMLMediaElement.prototype.play
const originalScrollIntoView = Element.prototype.scrollIntoView
const originalCreateElement = document.createElement.bind(document)

type MockMediaTrackCapabilities = MediaTrackCapabilities & {
  torch?: boolean
  zoom?: { min: number; max: number; step?: number }
}

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn()
  vi.stubGlobal(
    "URL",
    Object.assign({}, URL, {
      createObjectURL: vi.fn(() => "blob:camera-output"),
      revokeObjectURL: vi.fn(),
    })
  )
  HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined)
  Object.defineProperty(HTMLMediaElement.prototype, "srcObject", {
    configurable: true,
    writable: true,
    value: null,
  })
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  HTMLMediaElement.prototype.play = originalPlay
  Element.prototype.scrollIntoView = originalScrollIntoView
  if (originalSrcObject) {
    Object.defineProperty(
      HTMLMediaElement.prototype,
      "srcObject",
      originalSrcObject
    )
  } else {
    Reflect.deleteProperty(HTMLMediaElement.prototype, "srcObject")
  }
  if (originalMediaDevices) {
    Object.defineProperty(navigator, "mediaDevices", originalMediaDevices)
  } else {
    Reflect.deleteProperty(navigator, "mediaDevices")
  }
})

describe("CameraClient", () => {
  test("renders the idle camera state and output card", async () => {
    setMediaDevices(vi.fn())
    setMediaRecorder()

    render(<CameraClient messages={messages} />)

    expect(screen.getByText("Camera")).toBeTruthy()
    expect(screen.getByText("No capture yet")).toBeTruthy()
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Start camera" })).toBeTruthy()
    })
  })

  test("shows an unsupported state when camera APIs are missing", async () => {
    Reflect.deleteProperty(navigator, "mediaDevices")
    setMediaRecorder()

    render(<CameraClient messages={messages} />)

    await waitFor(() => {
      expect(screen.getByText("Camera is not supported")).toBeTruthy()
    })
  })

  test("shows a permission denied state after a denied camera request", async () => {
    setMediaDevices(
      vi.fn().mockRejectedValue(new DOMException("Denied", "NotAllowedError"))
    )
    setMediaRecorder()

    render(<CameraClient messages={messages} />)
    fireEvent.click(await screen.findByRole("button", { name: "Start camera" }))

    await waitFor(() => {
      expect(screen.getByText("Camera permission denied")).toBeTruthy()
      expect(
        screen.getByRole("button", { name: "Retry permission" })
      ).toBeTruthy()
    })
  })

  test("starts the camera and captures a photo", async () => {
    setMediaDevices(vi.fn().mockResolvedValue(createStream()))
    setMediaRecorder()
    stubCanvas(new Blob(["photo"], { type: "image/jpeg" }))

    render(<CameraClient messages={messages} />)
    fireEvent.click(await screen.findByRole("button", { name: "Start camera" }))

    const video = await screen.findByTestId("camera-preview")
    Object.defineProperty(video, "videoWidth", {
      value: 640,
      configurable: true,
    })
    Object.defineProperty(video, "videoHeight", {
      value: 480,
      configurable: true,
    })

    await waitFor(() => {
      expect(screen.getByText("Camera active")).toBeTruthy()
    })

    fireEvent.click(screen.getByRole("button", { name: "Take photo" }))

    await waitFor(() => {
      expect(screen.getAllByText("Photo").length).toBeGreaterThan(1)
      expect(
        screen.getByRole("link", { name: /Download capture/ })
      ).toBeTruthy()
    })

    fireEvent.click(screen.getByRole("button", { name: "Capture output" }))

    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    })
  })

  test("records a short video when MediaRecorder is supported", async () => {
    setMediaDevices(vi.fn().mockResolvedValue(createStream()))
    setMediaRecorder()

    render(<CameraClient messages={messages} />)
    await waitFor(() => {
      expect(screen.getByText("Video").closest("button")?.disabled).toBe(false)
    })
    fireEvent.click(screen.getByText("Video"))
    fireEvent.click(await screen.findByRole("button", { name: "Start camera" }))

    await waitFor(() => {
      expect(screen.getByText("Camera active")).toBeTruthy()
    })

    fireEvent.click(screen.getByRole("button", { name: "Start recording" }))

    await waitFor(() => {
      expect(screen.getByText(/REC/)).toBeTruthy()
    })

    fireEvent.click(screen.getByRole("button", { name: "Stop recording" }))

    await waitFor(() => {
      expect(screen.getAllByText("Video").length).toBeGreaterThan(1)
      expect(
        screen.getByRole("link", { name: /Download capture/ })
      ).toBeTruthy()
    })
  })
})

function setMediaDevices(getUserMedia: ReturnType<typeof vi.fn>) {
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: { getUserMedia },
  })
}

function setMediaRecorder() {
  class MockMediaRecorder {
    static isTypeSupported = (type: string) => type === "video/webm"
    mimeType = "video/webm"
    state: RecordingState = "inactive"
    ondataavailable: ((event: BlobEvent) => void) | null = null
    onerror: (() => void) | null = null
    onstart: (() => void) | null = null
    onstop: (() => void) | null = null

    start() {
      this.state = "recording"
      this.onstart?.()
    }

    stop() {
      this.state = "inactive"
      this.ondataavailable?.({
        data: new Blob(["video"], { type: this.mimeType }),
      } as BlobEvent)
      this.onstop?.()
    }
  }

  vi.stubGlobal("MediaRecorder", MockMediaRecorder)
}

function createStream() {
  const videoTrack = createTrack({
    torch: true,
    zoom: { min: 1, max: 3, step: 0.5 },
  })
  const audioTrack = createTrack({})

  return {
    getTracks: () => [videoTrack, audioTrack],
    getVideoTracks: () => [videoTrack],
    getAudioTracks: () => [audioTrack],
  } as unknown as MediaStream
}

function createTrack(capabilities: MockMediaTrackCapabilities) {
  return {
    enabled: true,
    stop: vi.fn(),
    getCapabilities: () => capabilities,
    getSettings: () => ({ zoom: 1 }),
    applyConstraints: vi.fn().mockResolvedValue(undefined),
  } as unknown as MediaStreamTrack
}

function stubCanvas(blob: Blob | null) {
  vi.spyOn(document, "createElement").mockImplementation((tagName) => {
    if (tagName !== "canvas") {
      return originalCreateElement(tagName)
    }

    return {
      width: 0,
      height: 0,
      getContext: vi.fn(() => ({
        drawImage: vi.fn(),
        scale: vi.fn(),
        translate: vi.fn(),
      })),
      toBlob: vi.fn((callback: BlobCallback) => callback(blob)),
    } as any
  })
}
