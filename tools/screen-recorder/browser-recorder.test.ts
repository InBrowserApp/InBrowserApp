import { afterEach, describe, expect, test, vi } from "vitest"

import {
  buildDisplayMediaOptions,
  closeAudioMixer,
  createAudioMixer,
  createMediaRecorder,
  createRecordingStream,
  detectScreenRecorderSupport,
  isMicrophonePermissionError,
  isScreenPermissionError,
  stopMediaStream,
} from "./browser-recorder"

const originalMediaDevices = Object.getOwnPropertyDescriptor(
  navigator,
  "mediaDevices"
)

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  restoreMediaDevices()
})

describe("detectScreenRecorderSupport", () => {
  test("detects available screen, microphone, and recorder APIs", () => {
    setMediaDevices({ getDisplayMedia: vi.fn(), getUserMedia: vi.fn() })
    vi.stubGlobal("MediaRecorder", class {})

    expect(detectScreenRecorderSupport()).toEqual({
      screen: true,
      microphone: true,
      recorder: true,
    })
  })

  test("returns false flags when APIs are missing", () => {
    Reflect.deleteProperty(navigator, "mediaDevices")
    vi.stubGlobal("MediaRecorder", undefined)

    expect(detectScreenRecorderSupport()).toEqual({
      screen: false,
      microphone: false,
      recorder: false,
    })
  })
})

describe("display media options", () => {
  test("builds options with and without system audio", () => {
    expect(buildDisplayMediaOptions(true)).toEqual({
      video: true,
      audio: true,
    })
    expect(buildDisplayMediaOptions(false)).toEqual({
      video: true,
      audio: false,
    })
  })
})

describe("permission errors", () => {
  test("matches screen and microphone permission errors", () => {
    expect(
      isScreenPermissionError(new DOMException("Denied", "AbortError"))
    ).toBe(true)
    expect(isScreenPermissionError(new Error("Other"))).toBe(false)
    expect(
      isMicrophonePermissionError(new DOMException("Denied", "NotAllowedError"))
    ).toBe(true)
    expect(
      isMicrophonePermissionError(new DOMException("Denied", "AbortError"))
    ).toBe(false)
  })
})

describe("media streams", () => {
  test("stops all tracks in a stream", () => {
    const videoTrack = createTrack("video")
    const audioTrack = createTrack("audio")

    stopMediaStream(createStream([videoTrack, audioTrack]))

    expect(videoTrack.stop).toHaveBeenCalled()
    expect(audioTrack.stop).toHaveBeenCalled()
  })

  test("creates empty, direct, and mixed audio mixers", () => {
    expect(createAudioMixer([])).toEqual({
      context: null,
      sources: [],
      track: null,
    })

    const singleTrack = createTrack("audio")
    expect(createAudioMixer([singleTrack]).track).toBe(singleTrack)

    const mixedTrack = createTrack("audio")
    const disconnect = vi.fn()
    const close = vi.fn()
    vi.stubGlobal(
      "AudioContext",
      class {
        createMediaStreamDestination = () => ({
          stream: createStream([mixedTrack]),
        })
        createMediaStreamSource = () => ({
          connect: vi.fn(),
          disconnect,
        })
        close = close
      }
    )

    const mixer = createAudioMixer([createTrack("audio"), createTrack("audio")])
    expect(mixer.track).toBe(mixedTrack)

    closeAudioMixer(mixer)

    expect(disconnect).toHaveBeenCalledTimes(2)
    expect(close).toHaveBeenCalled()
  })

  test("creates a recording stream from display and microphone tracks", () => {
    vi.stubGlobal("MediaStream", MockMediaStream)
    const displayVideo = createTrack("video")
    const displayAudio = createTrack("audio")
    const micAudio = createTrack("audio")
    const display = createStream([displayVideo, displayAudio])
    const microphone = createStream([micAudio])

    const { stream } = createRecordingStream(display, microphone)

    expect(stream.getVideoTracks()).toEqual([displayVideo])
    expect(stream.getAudioTracks().length).toBe(1)
  })
})

describe("createMediaRecorder", () => {
  test("uses MIME options when possible and falls back when needed", () => {
    vi.stubGlobal("MediaStream", MockMediaStream)
    const stream = new MediaStream()

    class MockRecorder {
      static calls: unknown[] = []
      constructor(_stream: MediaStream, options?: MediaRecorderOptions) {
        MockRecorder.calls.push(options ?? null)
        if (options?.mimeType === "video/mp4") throw new Error("unsupported")
      }
    }

    vi.stubGlobal("MediaRecorder", MockRecorder)

    expect(createMediaRecorder(stream, "video/webm")).toBeInstanceOf(
      MockRecorder
    )
    expect(createMediaRecorder(stream, "video/mp4")).toBeInstanceOf(
      MockRecorder
    )
    expect(createMediaRecorder(stream, "")).toBeInstanceOf(MockRecorder)
    expect(MockRecorder.calls).toEqual([
      { mimeType: "video/webm" },
      { mimeType: "video/mp4" },
      null,
      null,
    ])
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

function createTrack(kind: "audio" | "video") {
  return {
    kind,
    stop: vi.fn(),
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
