import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import ScreenRecorderClient from "./client"

import type { ScreenRecorderMessages } from "./types"

const messages: ScreenRecorderMessages = {
  meta: {
    name: "Screen Recorder",
    description: "Record your screen.",
  },
  recorder: {
    title: "Recorder",
    description: "Start a local screen capture session.",
    startLabel: "Start recording",
    preparingLabel: "Preparing…",
    pauseLabel: "Pause",
    resumeLabel: "Resume",
    stopLabel: "Stop",
    retryLabel: "Retry",
    statusLabel: "Status",
    durationLabel: "Duration",
    statusChecking: "Checking",
    statusReady: "Ready",
    statusRecording: "Recording",
    statusPaused: "Paused",
  },
  settings: {
    title: "Capture settings",
    description: "Choose audio sources.",
    systemAudioLabel: "System audio",
    systemAudioDescription: "Include available tab or system audio.",
    microphoneLabel: "Microphone",
    microphoneDescription: "Add microphone audio.",
    microphoneUnsupported: "Microphone capture is not available.",
  },
  output: {
    title: "Recording output",
    description: "Preview and download the recording.",
    emptyTitle: "No recording yet",
    emptyDescription: "Finish a recording to preview it here.",
    formatLabel: "Format",
    fileSizeLabel: "File size",
    fileNameLabel: "File name",
    fileNamePlaceholder: "screen-recording",
    downloadLabel: "Download recording",
    clearLabel: "Clear",
    formatUnknown: "Unknown",
  },
  alerts: {
    unsupportedTitle: "Screen recording is not supported",
    unsupportedDescription: "Use a supported browser.",
    screenPermissionTitle: "Screen sharing was not allowed",
    screenPermissionDescription: "Choose a source in the browser prompt.",
    microphonePermissionTitle: "Microphone access was not allowed",
    microphonePermissionDescription: "Allow microphone access.",
    microphoneUnsupportedTitle: "Microphone capture is unavailable",
    genericErrorTitle: "Recording could not start",
    genericErrorDescription: "Check permissions and try again.",
  },
}

const originalMediaDevices = Object.getOwnPropertyDescriptor(
  navigator,
  "mediaDevices"
)
const NativeURL = globalThis.URL

beforeEach(() => {
  class MockURL extends NativeURL {}

  Object.assign(MockURL, {
    createObjectURL: vi.fn(() => "blob:screen-recording"),
    revokeObjectURL: vi.fn(),
  })
  vi.stubGlobal("URL", MockURL)
  vi.stubGlobal("MediaStream", MockMediaStream)
  setMediaRecorder()
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  restoreMediaDevices()
})

describe("ScreenRecorderClient", () => {
  test("renders the supported idle state and empty output", async () => {
    setMediaDevices({ getDisplayMedia: vi.fn(), getUserMedia: vi.fn() })

    render(<ScreenRecorderClient messages={messages} />)

    expect(screen.getByText("No recording yet")).toBeTruthy()
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Start recording" })
      ).toBeTruthy()
      expect(screen.getByText("Ready")).toBeTruthy()
    })
  })

  test("shows an unsupported state when capture APIs are missing", async () => {
    Reflect.deleteProperty(navigator, "mediaDevices")
    vi.stubGlobal("MediaRecorder", undefined)

    render(<ScreenRecorderClient messages={messages} />)

    await waitFor(() => {
      expect(screen.getByText("Screen recording is not supported")).toBeTruthy()
      expect(
        screen.getByRole("button", { name: "Start recording" })
      ).toHaveProperty("disabled", true)
    })
  })

  test("records, pauses, resumes, stops, renames, and clears output", async () => {
    const getDisplayMedia = vi
      .fn()
      .mockResolvedValue(createStream([createTrack("video")]))
    const getUserMedia = vi
      .fn()
      .mockResolvedValue(createStream([createTrack("audio")]))
    setMediaDevices({ getDisplayMedia, getUserMedia })

    render(<ScreenRecorderClient messages={messages} />)

    fireEvent.click(await screen.findByRole("switch", { name: "Microphone" }))
    fireEvent.click(screen.getByRole("button", { name: "Start recording" }))

    await waitFor(() => {
      expect(screen.getByText("Recording")).toBeTruthy()
    })
    expect(getDisplayMedia).toHaveBeenCalledWith({ video: true, audio: true })
    expect(getUserMedia).toHaveBeenCalledWith({ audio: true })

    fireEvent.click(screen.getByRole("button", { name: "Pause" }))
    await waitFor(() => {
      expect(screen.getByText("Paused")).toBeTruthy()
    })

    fireEvent.click(screen.getByRole("button", { name: "Resume" }))
    await waitFor(() => {
      expect(screen.getByText("Recording")).toBeTruthy()
    })

    fireEvent.click(screen.getByRole("button", { name: "Stop" }))

    const link = await screen.findByRole("link", {
      name: "Download recording",
    })
    expect(screen.getByText("video/webm")).toBeTruthy()
    expect(link.getAttribute("href")).toBe("blob:screen-recording")

    fireEvent.change(screen.getByRole("textbox", { name: "File name" }), {
      target: { value: "demo recording" },
    })

    await waitFor(() => {
      expect(link.getAttribute("download")).toBe("demo recording.webm")
    })

    fireEvent.click(screen.getByRole("button", { name: "Clear" }))
    await waitFor(() => {
      expect(screen.getByText("No recording yet")).toBeTruthy()
    })
  })

  test("shows screen permission errors and retry action", async () => {
    setMediaDevices({
      getDisplayMedia: vi
        .fn()
        .mockRejectedValue(new DOMException("Denied", "NotAllowedError")),
      getUserMedia: vi.fn(),
    })

    render(<ScreenRecorderClient messages={messages} />)
    fireEvent.click(
      await screen.findByRole("button", { name: "Start recording" })
    )

    await waitFor(() => {
      expect(screen.getByText("Screen sharing was not allowed")).toBeTruthy()
      expect(screen.getByRole("button", { name: "Retry" })).toBeTruthy()
    })
  })

  test("cleans up display capture when microphone permission is denied", async () => {
    const videoTrack = createTrack("video")
    setMediaDevices({
      getDisplayMedia: vi.fn().mockResolvedValue(createStream([videoTrack])),
      getUserMedia: vi
        .fn()
        .mockRejectedValue(new DOMException("Denied", "NotAllowedError")),
    })

    render(<ScreenRecorderClient messages={messages} />)

    fireEvent.click(await screen.findByRole("switch", { name: "Microphone" }))
    fireEvent.click(screen.getByRole("button", { name: "Start recording" }))

    await waitFor(() => {
      expect(screen.getByText("Microphone access was not allowed")).toBeTruthy()
      expect(videoTrack.stop).toHaveBeenCalled()
    })
  })
})

function setMediaDevices(value: Partial<MediaDevices>) {
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value,
  })
}

function restoreMediaDevices() {
  if (originalMediaDevices) {
    Object.defineProperty(navigator, "mediaDevices", originalMediaDevices)
  } else {
    Reflect.deleteProperty(navigator, "mediaDevices")
  }
}

function setMediaRecorder() {
  class MockMediaRecorder {
    static isTypeSupported = (type: string) => type === "video/webm"
    mimeType = "video/webm"
    state: RecordingState = "inactive"
    ondataavailable: ((event: BlobEvent) => void) | null = null
    onerror: (() => void) | null = null
    onpause: (() => void) | null = null
    onresume: (() => void) | null = null
    onstart: (() => void) | null = null
    onstop: (() => void) | null = null

    start() {
      this.state = "recording"
      this.onstart?.()
    }

    pause() {
      this.state = "paused"
      this.onpause?.()
    }

    resume() {
      this.state = "recording"
      this.onresume?.()
    }

    stop() {
      this.state = "inactive"
      this.ondataavailable?.({
        data: new Blob(["recording"], { type: this.mimeType }),
      } as BlobEvent)
      this.onstop?.()
    }
  }

  vi.stubGlobal("MediaRecorder", MockMediaRecorder)
}

function createTrack(kind: "audio" | "video") {
  return {
    kind,
    stop: vi.fn(),
    addEventListener: vi.fn(),
  } as unknown as MediaStreamTrack
}

function createStream(tracks: MediaStreamTrack[]) {
  return new MockMediaStream(tracks) as unknown as MediaStream
}

class MockMediaStream {
  private tracks: MediaStreamTrack[]

  constructor(tracks: MediaStreamTrack[] = []) {
    this.tracks = tracks
  }

  addTrack(track: MediaStreamTrack) {
    this.tracks.push(track)
  }

  getTracks() {
    return this.tracks
  }

  getAudioTracks() {
    return this.tracks.filter((track) => track.kind === "audio")
  }

  getVideoTracks() {
    return this.tracks.filter((track) => track.kind === "video")
  }
}
