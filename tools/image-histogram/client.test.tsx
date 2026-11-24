import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import ImageHistogram from "./client"
import { countPixels, createHistogram } from "./core/histogram"
import type { Reply } from "./histogram.worker"
import messages from "./messages/en.json"

class TestWorker {
  static jobs: TestWorker[] = []
  onmessage?: (event: { data: Reply }) => void
  onerror?: () => void
  postMessage = vi.fn()
  terminate = vi.fn()

  constructor() {
    TestWorker.jobs.push(this)
  }
}

const photo = new File(["image"], "photo.png", { type: "image/png" })
const preview = new Blob(["preview"], { type: "image/webp" })
const context = {
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  fill: vi.fn(),
}

function histogram() {
  const result = createHistogram()
  countPixels(result, Uint8ClampedArray.of(0, 0, 0, 255, 255, 0, 255, 255))
  return result
}

function chooseFile(container: HTMLElement, file = photo) {
  fireEvent.change(container.querySelector('input[type="file"]')!, {
    target: { files: [file] },
  })
}

function reply(job: TestWorker, value: Reply) {
  act(() => job.onmessage!({ data: value }))
}

beforeEach(() => {
  TestWorker.jobs = []
  vi.stubGlobal("Worker", TestWorker)
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:preview")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    context as unknown as CanvasRenderingContext2D
  )
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe("Image Histogram Viewer", () => {
  it("opens the local picker, plots a sample, and inspects RGB values", () => {
    const { container } = render(
      <ImageHistogram lang="en" messages={messages} />
    )
    const input =
      container.querySelector<HTMLInputElement>('input[type="file"]')!
    const click = vi.spyOn(input, "click")
    fireEvent.click(screen.getByRole("button", { name: messages.chooseImage }))
    expect(click).toHaveBeenCalledOnce()

    fireEvent.click(screen.getByRole("button", { name: messages.trySample }))
    const job = TestWorker.jobs[0]!
    expect(job.postMessage).toHaveBeenCalledWith("sample")
    expect(screen.getByRole("status").textContent).toContain(messages.loading)
    reply(job, { preview, histogram: histogram(), width: 2, height: 1 })

    expect(
      container
        .querySelector("figcaption")
        ?.textContent?.includes(messages.sampleName)
    ).toBeTruthy()
    expect(screen.getByText("2 × 1")).toBeTruthy()
    expect(
      screen.getByRole("img", { name: messages.preview }).getAttribute("src")
    ).toBe("blob:preview")
    expect(context.stroke).toHaveBeenCalled()

    fireEvent.click(screen.getByRole("button", { name: messages.rgb }))
    fireEvent.change(screen.getByRole("combobox", { name: messages.scale }), {
      target: { value: "logarithmic" },
    })
    const slider = screen.getByRole("slider", { name: messages.level })
    fireEvent.change(slider, { target: { value: "255" } })
    expect(slider.getAttribute("aria-valuetext")).toBe(
      "255 · Red 1 · Green 0 · Blue 1"
    )
    expect(screen.getAllByText("50%")).toHaveLength(4)

    const canvas = container.querySelector("canvas")!
    vi.spyOn(canvas, "getBoundingClientRect").mockReturnValue(
      new DOMRect(20, 0, 256, 200)
    )
    fireEvent.pointerMove(canvas, { clientX: 500, pointerType: "mouse" })
    expect((slider as HTMLInputElement).value).toBe("255")
    fireEvent.pointerDown(canvas, { clientX: 1, pointerType: "touch" })
    expect((slider as HTMLInputElement).value).toBe("0")
  })

  it("replaces pending work and keeps the previous good result on failure", () => {
    const { container, unmount } = render(
      <ImageHistogram lang="en" messages={messages} />
    )
    const picker = container.querySelector('input[type="file"]')!
    const dropzone = picker.parentElement!
    fireEvent.dragOver(dropzone, { dataTransfer: { types: ["text/plain"] } })
    fireEvent.dragOver(dropzone, { dataTransfer: { types: ["Files"] } })
    fireEvent.dragLeave(dropzone, { relatedTarget: picker })
    fireEvent.dragLeave(dropzone, { relatedTarget: null })
    fireEvent.drop(dropzone, { dataTransfer: { files: [] } })
    fireEvent.drop(dropzone, { dataTransfer: { files: [photo] } })

    const first = TestWorker.jobs[0]!
    expect(first.postMessage).toHaveBeenCalledWith(photo)
    const replacement = new File(["valid"], "replacement.png")
    chooseFile(container, replacement)
    expect(first.terminate).toHaveBeenCalledOnce()
    reply(first, { preview, histogram: histogram(), width: 1, height: 1 })
    expect(screen.queryByText(photo.name)).toBeNull()

    const second = TestWorker.jobs[1]!
    reply(second, { preview, histogram: histogram(), width: 2, height: 1 })
    chooseFile(container)
    act(() => TestWorker.jobs[2]!.onerror!())
    expect(screen.getByRole("alert").textContent).toContain(messages.error)
    expect(
      container
        .querySelector("figcaption")
        ?.textContent?.includes(replacement.name)
    ).toBeTruthy()

    chooseFile(container)
    const pending = TestWorker.jobs[3]!
    unmount()
    expect(pending.terminate).toHaveBeenCalledOnce()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:preview")
  })

  it("shows an empty result for transparent pixels and lets the user retry", () => {
    const { container } = render(
      <ImageHistogram lang="en" messages={messages} />
    )
    chooseFile(container)
    reply(TestWorker.jobs[0]!, null)
    expect(screen.getByRole("alert").textContent).toContain(messages.error)

    chooseFile(container)
    reply(TestWorker.jobs[1]!, {
      preview,
      histogram: createHistogram(),
      width: 1,
      height: 1,
    })
    expect(screen.getByRole("status").textContent).toContain(
      messages.transparent
    )
    expect(screen.queryByRole("slider")).toBeNull()
    expect(
      screen.getByRole("button", { name: messages.replaceImage })
    ).toBeTruthy()
  })
})
