import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import RefreshRateTest from "./client"
import messages from "./messages/en.json"

function installFrameClock() {
  const frames = new Map<number, FrameRequestCallback>()
  let nextId = 0
  const cancel = vi.fn((id: number) => frames.delete(id))
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    frames.set(++nextId, callback)
    return nextId
  })
  vi.stubGlobal("cancelAnimationFrame", cancel)

  function frame(timestamp: number) {
    const next = frames.entries().next().value
    if (!next) return
    const [id, callback] = next
    frames.delete(id)
    callback(timestamp)
  }

  function sample(hertz: number, delayedFrame = 0) {
    const interval = 1000 / hertz
    act(() => {
      frame(0)
      frame(0)
      for (
        let timestamp = interval + delayedFrame;
        timestamp <= 2000 + delayedFrame;
        timestamp += interval
      ) {
        frame(timestamp)
      }
    })
  }

  return { frames, cancel, frame, sample }
}

describe("RefreshRateTest", () => {
  let clock: ReturnType<typeof installFrameClock>

  beforeEach(() => {
    clock = installFrameClock()
    vi.spyOn(document, "hidden", "get").mockReturnValue(false)
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it("starts automatically and uses the typical interval despite a delayed frame", () => {
    render(<RefreshRateTest language="en" messages={messages} />)
    const output = screen.getByRole("status")
    expect(output.textContent).toContain(messages.measuring)
    clock.sample(120, 70)
    expect(output.textContent).toContain("120 Hz")
    expect(output.textContent).toContain("8.3 ms")
    expect(clock.frames.size).toBe(0)
  })

  it("restarts measurement without keeping an old callback or a stale result", () => {
    render(<RefreshRateTest language="de" messages={messages} />)
    const retry = screen.getByRole("button", { name: messages.measureAgain })
    fireEvent.click(retry)
    expect(clock.cancel).toHaveBeenCalledOnce()
    expect(clock.frames.size).toBe(1)
    clock.sample(60)
    const output = screen.getByRole("status")
    expect(output.textContent).toContain("60 Hz")
    expect(output.textContent).toContain("16,7 ms")
    fireEvent.click(retry)
    expect(output.textContent).toContain(messages.measuring)
    expect(output.textContent).not.toContain("60 Hz")
    clock.sample(144)
    expect(output.textContent).toContain("144 Hz")
  })

  it("discards a hidden tab's sample and resumes from fresh timestamps", () => {
    const { unmount } = render(
      <RefreshRateTest language="en" messages={messages} />
    )
    act(() => clock.frame(20))
    const hidden = vi.spyOn(document, "hidden", "get").mockReturnValue(true)
    fireEvent(document, new Event("visibilitychange"))
    expect(screen.getByRole("status").textContent).toContain(messages.paused)
    expect(clock.frames.size).toBe(0)

    hidden.mockReturnValue(false)
    fireEvent(document, new Event("visibilitychange"))
    expect(clock.frames.size).toBe(1)
    unmount()
    expect(clock.frames.size).toBe(0)
  })

  it("allows another measurement after too few frames arrive", () => {
    render(<RefreshRateTest language="en" messages={messages} />)
    act(() => {
      clock.frame(0)
      clock.frame(1900)
    })
    const output = screen.getByRole("status")
    expect(output.textContent).toContain(messages.unavailable)
    fireEvent.click(screen.getByRole("button", { name: messages.measureAgain }))
    clock.sample(75)
    expect(output.textContent).toContain("75 Hz")
    expect(output.textContent).toContain("13.3 ms")
  })
})
