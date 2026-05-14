import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import AudioRecorderClient from "./client"
import messagesCatalog from "./messages/en.json"
import meta from "./meta/en.json"

const messages = { meta, ...messagesCatalog }

type MockRecorderState = "inactive" | "recording" | "paused"

class MockMediaRecorder {
  static instances: MockMediaRecorder[] = []
  static isTypeSupported = vi.fn(
    (mimeType: string) => mimeType === "audio/webm"
  )

  state: MockRecorderState = "inactive"
  mimeType: string
  ondataavailable: ((event: { data: Blob }) => void) | null = null
  onerror: (() => void) | null = null
  onpause: (() => void) | null = null
  onresume: (() => void) | null = null
  onstart: (() => void) | null = null
  onstop: (() => void) | null = null

  constructor(_stream: MediaStream, options?: MediaRecorderOptions) {
    this.mimeType = options?.mimeType ?? "audio/webm"
    MockMediaRecorder.instances.push(this)
  }

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
      data: new Blob(["recorded audio"], { type: this.mimeType }),
    })
    this.onstop?.()
  }
}

function installObjectUrlMocks() {
  Object.defineProperty(URL, "createObjectURL", {
    configurable: true,
    value: vi.fn(() => "blob:audio-recording"),
  })
  Object.defineProperty(URL, "revokeObjectURL", {
    configurable: true,
    value: vi.fn(),
  })
}

function installSupportedRecorder() {
  const trackStop = vi.fn()
  const stream = {
    getTracks: () => [{ stop: trackStop }],
  } as unknown as MediaStream
  const getUserMedia = vi.fn(async () => stream)

  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: { getUserMedia },
  })
  vi.stubGlobal("MediaRecorder", MockMediaRecorder)

  return { getUserMedia, trackStop }
}

beforeEach(() => {
  vi.useRealTimers()
  MockMediaRecorder.instances = []
  MockMediaRecorder.isTypeSupported = vi.fn(
    (mimeType: string) => mimeType === "audio/webm"
  )
  installObjectUrlMocks()
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe("AudioRecorderClient", () => {
  test("shows an unsupported state when browser recording APIs are missing", async () => {
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: undefined,
    })
    vi.stubGlobal("MediaRecorder", undefined)

    render(<AudioRecorderClient messages={messages} />)

    await waitFor(() => {
      expect(screen.getByText(messages.unsupportedTitle)).toBeTruthy()
    })
    expect(
      screen.getByRole("button", { name: messages.recordButton })
    ).toHaveProperty("disabled", true)
  })

  test("surfaces denied microphone permission and offers retry", async () => {
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: {
        getUserMedia: vi.fn(async () => {
          throw new DOMException("denied", "NotAllowedError")
        }),
      },
    })
    vi.stubGlobal("MediaRecorder", MockMediaRecorder)

    render(<AudioRecorderClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: messages.recordButton }))

    await waitFor(() => {
      expect(screen.getByText(messages.permissionDeniedTitle)).toBeTruthy()
    })
    expect(
      screen.getByRole("button", { name: messages.retryButton })
    ).toBeTruthy()
  })

  test("records, pauses, resumes, previews, downloads, and clears audio", async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 4, 14, 10, 20, 30))
    const { getUserMedia, trackStop } = installSupportedRecorder()

    render(<AudioRecorderClient messages={messages} />)

    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: messages.recordButton })
      )
      await Promise.resolve()
    })

    expect(
      screen.getByRole("button", { name: messages.pauseButton })
    ).toBeTruthy()
    expect(getUserMedia).toHaveBeenCalledWith({ audio: true })
    expect(
      screen.getAllByText(messages.statusRecording).length
    ).toBeGreaterThan(0)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1_200)
    })
    expect(screen.getByText("00:01")).toBeTruthy()

    fireEvent.click(screen.getByRole("button", { name: messages.pauseButton }))
    expect(
      screen.getByRole("button", { name: messages.resumeButton })
    ).toBeTruthy()
    expect(screen.getByText(messages.statusPaused)).toBeTruthy()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1_000)
    })
    expect(screen.getByText("00:01")).toBeTruthy()

    fireEvent.click(screen.getByRole("button", { name: messages.resumeButton }))

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1_000)
    })

    fireEvent.click(screen.getByRole("button", { name: messages.stopButton }))

    expect(screen.getByLabelText(messages.playbackLabel)).toBeTruthy()

    expect(trackStop).toHaveBeenCalledTimes(1)
    expect(screen.getByText("audio/webm")).toBeTruthy()
    expect(screen.getByText("14 B")).toBeTruthy()

    const downloadLink = screen.getByRole("link", {
      name: messages.downloadButton,
    })
    expect(downloadLink.getAttribute("href")).toBe("blob:audio-recording")
    expect(downloadLink.getAttribute("download")).toBe(
      "recording-20260514-102030.webm"
    )

    fireEvent.click(
      screen.getAllByRole("button", { name: messages.clearButton })[0]!
    )

    expect(screen.getByText(messages.emptyOutputTitle)).toBeTruthy()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:audio-recording")
  })

  test("keeps the latest take when starting another recording is denied", async () => {
    installSupportedRecorder()

    render(<AudioRecorderClient messages={messages} />)

    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: messages.recordButton })
      )
      await Promise.resolve()
    })
    fireEvent.click(screen.getByRole("button", { name: messages.stopButton }))

    expect(screen.getByLabelText(messages.playbackLabel)).toBeTruthy()

    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: {
        getUserMedia: vi.fn(async () => {
          throw new DOMException("denied", "NotAllowedError")
        }),
      },
    })

    fireEvent.click(screen.getByRole("button", { name: messages.recordButton }))

    await waitFor(() => {
      expect(screen.getByText(messages.permissionDeniedTitle)).toBeTruthy()
    })
    expect(screen.getByLabelText(messages.playbackLabel)).toBeTruthy()
    expect(URL.revokeObjectURL).not.toHaveBeenCalled()
  })

  test("shows a failure when the browser cannot construct a recorder", async () => {
    const trackStop = vi.fn()
    const stream = {
      getTracks: () => [{ stop: trackStop }],
    } as unknown as MediaStream

    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: { getUserMedia: vi.fn(async () => stream) },
    })
    vi.stubGlobal(
      "MediaRecorder",
      class {
        static isTypeSupported = vi.fn(() => false)

        constructor() {
          throw new Error("unsupported input")
        }
      }
    )

    render(<AudioRecorderClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: messages.recordButton }))

    await waitFor(() => {
      expect(screen.getByText(messages.recordingFailedTitle)).toBeTruthy()
    })
    expect(trackStop).toHaveBeenCalledTimes(1)
  })
})
