import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import FontToWoff2 from "./client"
import messages from "./messages/en.json"
import type { ConversionResult } from "./types"

class FakeWorker {
  static jobs: FakeWorker[] = []
  onmessage?: (event: MessageEvent<ConversionResult>) => void
  onerror?: () => void
  onmessageerror?: () => void
  postMessage = vi.fn()
  terminate = vi.fn()

  constructor() {
    FakeWorker.jobs.push(this)
  }

  respond(index: number, output: ArrayBuffer | null) {
    act(() =>
      this.onmessage?.(new MessageEvent("message", { data: { index, output } }))
    )
  }
}

const font = new File([new Uint8Array(2048)], "A$&.TTF")
const broken = new File(["invalid"], "broken.otf")

function setup() {
  const view = render(<FontToWoff2 messages={messages} lang="en" />)
  const picker = screen.getByRole("button", { name: /Choose font files/ })
  const input = screen.getByLabelText<HTMLInputElement>(messages.chooseFonts)
  return { input, picker, ...view }
}

beforeEach(() => {
  FakeWorker.jobs = []
  vi.stubGlobal("Worker", FakeWorker)
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:test")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe("font converter", () => {
  it("opens the file picker, converts both files automatically, and keeps good results", () => {
    const { picker, input } = setup()
    const click = vi.spyOn(input, "click")
    fireEvent.click(picker)
    expect(click).toHaveBeenCalledOnce()
    fireEvent.change(input, { target: { files: [font, broken] } })

    const job = FakeWorker.jobs[0]!
    expect(job.postMessage).toHaveBeenCalledWith([font, broken])
    expect(picker.getAttribute("aria-disabled")).toBe("true")
    fireEvent.click(picker)
    expect(click).toHaveBeenCalledOnce()
    expect(screen.getAllByText(messages.converting)).toHaveLength(2)

    job.respond(0, new ArrayBuffer(1024))
    expect(
      screen.getByText("\u20662 KiB\u2069 original · \u20661 KiB\u2069 WOFF2")
    ).toBeTruthy()
    const link = screen.getByRole("link", { name: "Download WOFF2 A$&.woff2" })
    expect(link.getAttribute("download")).toBe("A$&.woff2")
    expect(URL.createObjectURL).toHaveBeenCalledWith(
      expect.objectContaining({ type: "font/woff2" })
    )
    expect(job.terminate).not.toHaveBeenCalled()

    job.respond(1, null)
    expect(screen.getByText(messages.failed)).toBeTruthy()
    expect(job.terminate).toHaveBeenCalledOnce()
    expect(picker.getAttribute("aria-disabled")).toBe("false")

    fireEvent.click(screen.getByRole("button", { name: messages.clear }))
    expect(screen.queryByRole("link")).toBeNull()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:test")
    expect(document.activeElement).toBe(picker)
  })

  it("handles drag and drop and appends another batch after a worker error", () => {
    const { input, picker, unmount } = setup()
    const dataTransfer = { files: [broken] }
    fireEvent.dragOver(picker, { dataTransfer })
    fireEvent.dragLeave(picker, { dataTransfer })
    fireEvent.drop(picker, { dataTransfer: { files: [] } })
    expect(FakeWorker.jobs).toHaveLength(0)
    fireEvent.drop(picker, { dataTransfer })
    const first = FakeWorker.jobs[0]!
    fireEvent.drop(picker, { dataTransfer })
    expect(FakeWorker.jobs).toHaveLength(1)

    act(() => first.onerror?.())
    expect(first.terminate).toHaveBeenCalledOnce()
    expect(screen.getByText(messages.failed)).toBeTruthy()
    fireEvent.change(input, { target: { files: [font] } })
    const retry = FakeWorker.jobs[1]!
    expect(retry.postMessage).toHaveBeenCalledWith([font])
    expect(screen.getByText(messages.failed)).toBeTruthy()
    unmount()
    expect(retry.terminate).toHaveBeenCalledOnce()
  })

  it("recovers when a worker cannot be started", () => {
    vi.stubGlobal(
      "Worker",
      class {
        constructor() {
          throw new Error("unavailable")
        }
      }
    )
    const { input, picker } = setup()
    fireEvent.change(input, { target: { files: [font] } })
    expect(screen.getByText(messages.failed)).toBeTruthy()
    expect(picker.getAttribute("aria-disabled")).toBe("false")
  })

  it("can clear an active batch, then select the same file again", () => {
    const { input } = setup()
    fireEvent.change(input, { target: { files: [font] } })
    const first = FakeWorker.jobs[0]!
    fireEvent.click(screen.getByRole("button", { name: messages.clear }))
    expect(first.terminate).toHaveBeenCalledOnce()
    fireEvent.change(input, { target: { files: [font] } })
    const next = FakeWorker.jobs[1]!
    next.respond(0, new ArrayBuffer(64))
    expect(
      screen.getByText("\u20662 KiB\u2069 original · \u206664 B\u2069 WOFF2")
    ).toBeTruthy()
  })
})
