import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import WebcamTest from "./client"
import messages from "./messages/en.json"

function cameraStream(frameRate = 30) {
  const track = Object.assign(new EventTarget(), {
    getSettings: () => ({ frameRate }),
    stop: vi.fn(),
  })
  return Object.assign(new MediaStream(), {
    track,
    getTracks: () => [track],
    getVideoTracks: () => [track],
  })
}

function mockMedia() {
  const stream = cameraStream()
  const getUserMedia = vi.fn().mockResolvedValue(stream)
  const enumerateDevices = vi.fn().mockResolvedValue([
    { kind: "audioinput", deviceId: "mic", label: "Microphone" },
    { kind: "videoinput", deviceId: "", label: "" },
    { kind: "videoinput", deviceId: "front", label: "Front Camera" },
    { kind: "videoinput", deviceId: "back", label: "" },
  ])
  const play = vi
    .spyOn(HTMLMediaElement.prototype, "play")
    .mockResolvedValue(undefined)
  vi.stubGlobal("navigator", {
    mediaDevices: { getUserMedia, enumerateDevices },
  })
  return { stream, getUserMedia, enumerateDevices, play }
}

function mount(measure = true) {
  const view = render(<WebcamTest messages={messages} language="en" />)
  const video = view.container.querySelector("video")!
  const request = vi.fn<(frame: VideoFrameRequestCallback) => number>(() => 7)
  const cancel = vi.fn()
  let width = 640
  let height = 480
  Object.defineProperties(video, {
    videoWidth: { get: () => width },
    videoHeight: { get: () => height },
    requestVideoFrameCallback: { value: measure ? request : undefined },
    cancelVideoFrameCallback: { value: cancel },
  })
  function resize(nextWidth: number, nextHeight: number) {
    width = nextWidth
    height = nextHeight
    fireEvent(video, new Event("resize"))
  }
  function frame(mediaTime: number, presentedFrames: number) {
    act(() =>
      request.mock.lastCall?.[0](mediaTime * 1000, {
        mediaTime,
        presentedFrames,
        width,
        height,
        presentationTime: mediaTime * 1000,
        expectedDisplayTime: mediaTime * 1000,
      })
    )
  }
  return { ...view, video, cancel, frame, resize }
}

function click(name: string) {
  fireEvent.click(screen.getByRole("button", { name, exact: true }))
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe("WebcamTest", () => {
  it("requests video only, displays actual dimensions and measures presented frames", async () => {
    const media = mockMedia()
    const { video, frame, resize, cancel } = mount()
    expect(media.getUserMedia).not.toHaveBeenCalled()
    fireEvent.change(
      screen.getByRole("combobox", { name: messages.requestedResolution }),
      {
        target: { value: "2160" },
      }
    )
    expect(media.getUserMedia).not.toHaveBeenCalled()
    resize(0, 0)
    click(messages.start)
    expect(screen.getByRole("status").textContent).toBe(messages.starting)
    expect(
      screen
        .getByRole("button", { name: messages.starting })
        .getAttribute("aria-disabled")
    ).toBe("true")
    click(messages.starting)
    await screen.findByRole("button", { name: messages.stop })
    expect(media.getUserMedia).toHaveBeenCalledExactlyOnceWith({
      audio: false,
      video: {
        width: { ideal: 3840 },
        height: { ideal: 2160 },
        frameRate: { ideal: 60 },
      },
    })
    expect(video.srcObject).toBe(media.stream)
    resize(1280, 720)
    expect(screen.getByText("1280 × 720")).toBeTruthy()
    frame(0, 1)
    frame(0.5, 16)
    frame(1, 31)
    expect(screen.getByText("30 FPS")).toBeTruthy()
    expect(screen.getByText(messages.previewFps)).toBeTruthy()
    click(messages.stop)
    expect(media.stream.track.stop).toHaveBeenCalledOnce()
    expect(cancel).toHaveBeenCalledWith(7)
    expect(video.srcObject).toBeNull()
    expect(screen.queryByText("30 FPS")).toBeNull()
  })

  it("switches the active input and keeps using the selected size", async () => {
    const media = mockMedia()
    const replacement = cameraStream(24)
    media.getUserMedia
      .mockResolvedValueOnce(media.stream)
      .mockResolvedValue(replacement)
    const { video } = mount(false)
    click(messages.start)
    const input = await screen.findByRole("combobox", { name: messages.camera })
    expect(screen.getByRole("option", { name: "Camera 2" })).toBeTruthy()
    expect(screen.getByText(messages.reportedFps)).toBeTruthy()
    expect(screen.getByText("30 FPS")).toBeTruthy()
    fireEvent.change(input, { target: { value: "back" } })
    await screen.findByText("24 FPS")
    expect(media.stream.track.stop).toHaveBeenCalledOnce()
    expect(media.getUserMedia).toHaveBeenLastCalledWith({
      audio: false,
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        frameRate: { ideal: 60 },
        deviceId: { exact: "back" },
      },
    })
    expect(video.srcObject).toBe(replacement)
    fireEvent.change(
      screen.getByRole("combobox", { name: messages.requestedResolution }),
      {
        target: { value: "720" },
      }
    )
    await waitFor(() => expect(media.getUserMedia).toHaveBeenCalledTimes(3))
    await screen.findByRole("button", { name: messages.stop })
    expect(media.getUserMedia.mock.lastCall?.[0].video.width.ideal).toBe(1280)
  })

  it("recovers from a browser permission failure and reports a disconnected camera", async () => {
    const media = mockMedia()
    media.getUserMedia.mockRejectedValueOnce(
      new DOMException("Denied", "NotAllowedError")
    )
    media.enumerateDevices.mockRejectedValueOnce(new Error("List unavailable"))
    mount(false)
    click(messages.start)
    expect((await screen.findByRole("alert")).textContent).toBe(
      messages.cameraError
    )
    click(messages.start)
    await screen.findByRole("button", { name: messages.stop })
    act(() => media.stream.track.dispatchEvent(new Event("ended")))
    expect(screen.getByRole("alert").textContent).toBe(messages.cameraError)
    expect(media.stream.track.stop).toHaveBeenCalledOnce()
  })

  it("releases a stream returned after unmount", async () => {
    const media = mockMedia()
    let open!: (stream: typeof media.stream) => void
    media.getUserMedia.mockReturnValueOnce(
      new Promise((resolve) => {
        open = resolve
      })
    )
    const { unmount } = mount()
    click(messages.start)
    unmount()
    await act(async () => open(media.stream))
    expect(media.stream.track.stop).toHaveBeenCalledOnce()
    expect(media.play).not.toHaveBeenCalled()
  })

  it("resets the measured sample after the tab is hidden", async () => {
    mockMedia()
    const hidden = vi.spyOn(document, "hidden", "get").mockReturnValue(false)
    const { frame } = mount()
    click(messages.start)
    await screen.findByRole("button", { name: messages.stop })
    frame(0, 1)
    hidden.mockReturnValue(true)
    fireEvent(document, new Event("visibilitychange"))
    frame(3, 31)
    hidden.mockReturnValue(false)
    fireEvent(document, new Event("visibilitychange"))
    frame(7, 35)
    expect(screen.queryByText(/FPS$/)).toBeNull()
    frame(8, 59)
    expect(screen.getByText("24 FPS")).toBeTruthy()
  })

  it("clears the camera when the acquired stream has no video track", async () => {
    const media = mockMedia()
    media.getUserMedia.mockResolvedValueOnce({
      ...media.stream,
      getVideoTracks: () => [],
    })
    mount()
    click(messages.start)
    expect((await screen.findByRole("alert")).textContent).toBe(
      messages.cameraError
    )
    expect(media.stream.track.stop).toHaveBeenCalledOnce()
  })
})
