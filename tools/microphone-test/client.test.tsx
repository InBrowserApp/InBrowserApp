import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import MicrophoneTest from "./client"
import messages from "./messages/en.json"

function mockAudio() {
  const gain = {
    value: 0,
    setValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
  }
  const node = { connect: vi.fn(), disconnect: vi.fn() }
  node.connect.mockReturnValue(node)
  const panner = { ...node, pan: { value: 0 } }
  const oscillator = {
    ...node,
    frequency: { value: 0 },
    start: vi.fn(),
    stop: vi.fn(),
    onended: null as (() => void) | null,
  }
  const context = {
    close: vi.fn().mockResolvedValue(undefined),
    resume: vi.fn().mockResolvedValue(undefined),
    destination: node,
    currentTime: 1,
    createMediaStreamSource: vi.fn(() => node),
    createAnalyser: vi.fn(() => ({
      ...node,
      fftSize: 8,
      getFloatTimeDomainData: (samples: Float32Array) => samples.fill(0.2),
    })),
    createGain: vi.fn(() => ({ ...node, gain })),
    createStereoPanner: vi.fn(() => panner),
    createOscillator: vi.fn(() => oscillator),
  }
  vi.stubGlobal(
    "AudioContext",
    vi.fn(function () {
      return context
    })
  )

  const track = Object.assign(new EventTarget(), { stop: vi.fn() })
  const stream = { getTracks: () => [track] }
  const getUserMedia = vi.fn().mockResolvedValue(stream)
  vi.stubGlobal("navigator", { mediaDevices: { getUserMedia } })
  const frame = vi.fn<(callback: FrameRequestCallback) => number>(() => 42)
  const cancelFrame = vi.fn()
  vi.stubGlobal("requestAnimationFrame", frame)
  vi.stubGlobal("cancelAnimationFrame", cancelFrame)

  return {
    context,
    frame,
    cancelFrame,
    gain,
    getUserMedia,
    oscillator,
    panner,
    stream,
    track,
  }
}

function click(name: string) {
  fireEvent.click(screen.getByRole("button", { name }))
}

describe("MicrophoneTest", () => {
  let audio: ReturnType<typeof mockAudio>

  beforeEach(() => {
    audio = mockAudio()
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it("shows input, enables live playback on request, and releases the microphone on stop", async () => {
    render(<MicrophoneTest messages={messages} />)
    const monitor = screen.getByRole("button", { name: messages.monitor })
    expect(monitor).toHaveProperty("disabled", true)

    const start = screen.getByRole("button", { name: messages.start })
    start.focus()
    click(messages.start)
    expect(start.getAttribute("aria-disabled")).toBe("true")
    expect(document.activeElement).toBe(start)
    click(messages.starting)
    expect(audio.getUserMedia).toHaveBeenCalledOnce()
    await screen.findByRole("button", { name: messages.stop })
    expect(document.activeElement).toBe(start)
    expect(audio.gain.value).toBe(0)

    act(() => audio.frame.mock.lastCall?.[0](0))
    expect(screen.getByRole("meter").getAttribute("aria-valuenow")).toBe("60")
    click(messages.monitor)
    expect(monitor.getAttribute("aria-pressed")).toBe("true")
    expect(audio.gain.value).toBeGreaterThan(0)
    click(messages.monitor)
    expect(audio.gain.value).toBe(0)

    click(messages.stop)
    expect(audio.track.stop).toHaveBeenCalledOnce()
    expect(audio.cancelFrame).toHaveBeenCalledWith(42)
    expect(audio.context.close).toHaveBeenCalledOnce()
    expect(screen.getByRole("meter").getAttribute("aria-valuenow")).toBe("0")
  })

  it("recovers after a denied permission and reports an ended input", async () => {
    audio.getUserMedia.mockRejectedValueOnce(
      new DOMException("Denied", "NotAllowedError")
    )
    render(<MicrophoneTest messages={messages} />)
    click(messages.start)
    expect((await screen.findByRole("alert")).textContent).toBe(
      messages.micError
    )
    click(messages.start)
    await screen.findByRole("button", { name: messages.stop })
    act(() => audio.track.dispatchEvent(new Event("ended")))
    expect(screen.getByRole("alert").textContent).toBe(messages.micError)
    expect(audio.track.stop).toHaveBeenCalledOnce()
  })

  it("releases a permission result that arrives after unmount", async () => {
    let allow!: (stream: typeof audio.stream) => void
    audio.getUserMedia.mockReturnValueOnce(
      new Promise((resolve) => {
        allow = resolve
      })
    )
    const { unmount } = render(<MicrophoneTest messages={messages} />)
    click(messages.start)
    unmount()
    await act(async () => allow(audio.stream))
    expect(audio.track.stop).toHaveBeenCalledOnce()
    expect(audio.context.close).toHaveBeenCalledOnce()
  })

  it("reports a browser audio failure and stops the acquired input", async () => {
    audio.context.resume.mockRejectedValueOnce(new Error("Blocked"))
    render(<MicrophoneTest messages={messages} />)
    click(messages.start)
    await screen.findByRole("alert")
    expect(audio.track.stop).toHaveBeenCalledOnce()
    expect(audio.context.close).toHaveBeenCalledOnce()
  })

  it("plays left, right and centered tones without asking for microphone access", async () => {
    render(<MicrophoneTest messages={messages} />)
    await act(async () => click(messages.left))
    expect(audio.panner.pan.value).toBe(-1)
    expect(
      screen
        .getByRole("button", { name: messages.left })
        .getAttribute("aria-pressed")
    ).toBe("true")
    await act(async () => click(messages.right))
    expect(audio.panner.pan.value).toBe(1)
    await act(async () => click(messages.both))
    expect(audio.panner.pan.value).toBe(0)
    act(() => audio.oscillator.onended?.())
    expect(
      screen
        .getByRole("button", { name: messages.both })
        .getAttribute("aria-pressed")
    ).toBe("false")
    expect(audio.getUserMedia).not.toHaveBeenCalled()
    expect(audio.oscillator.start).toHaveBeenCalledTimes(3)
  })

  it("can stop an active tone and retry playback after a failure", async () => {
    audio.context.resume.mockRejectedValueOnce(new Error("Blocked"))
    render(<MicrophoneTest messages={messages} />)
    click(messages.left)
    expect((await screen.findByRole("alert")).textContent).toBe(
      messages.speakerError
    )
    expect(audio.oscillator.start).not.toHaveBeenCalled()
    await act(async () => click(messages.both))
    expect(audio.oscillator.start).toHaveBeenCalledOnce()
    expect(screen.queryByRole("alert")).toBeNull()
    click(messages.both)
    expect(
      screen
        .getByRole("button", { name: messages.both })
        .getAttribute("aria-pressed")
    ).toBe("false")
  })

  it("only plays the latest channel when audio resumes after a new choice", async () => {
    let resume!: () => void
    audio.context.resume.mockReturnValueOnce(
      new Promise<void>((resolve) => {
        resume = resolve
      })
    )
    render(<MicrophoneTest messages={messages} />)

    click(messages.left)
    await act(async () => click(messages.right))
    await act(async () => resume())

    expect(audio.panner.pan.value).toBe(1)
    expect(audio.oscillator.start).toHaveBeenCalledOnce()
  })
})
