import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, it, vi } from "vitest"

import AudioSpectrumAnalyzer from "./client"
import { FFT_SIZE, MIN_DB } from "./core/spectrum"
import messages from "./messages/en.json"
import type { Response } from "./workers/analyze"

class AudioWorker {
  onmessage?: (event: MessageEvent<Response>) => void
  onerror?: () => void
  postMessage = vi.fn()
  terminate = vi.fn()
  constructor() {
    workers.push(this)
  }
  receive(data: Response) {
    this.onmessage?.(new MessageEvent("message", { data }))
  }
}

const workers: AudioWorker[] = []
const decode = vi.fn()
const samples = Float32Array.of(0.1)
const audio = { numberOfChannels: 1, getChannelData: () => samples }
const drawing = {
  setTransform: vi.fn(),
  clearRect: vi.fn(),
  fillText: vi.fn(),
  stroke: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
}
beforeEach(() => {
  workers.length = 0
  decode.mockReset().mockResolvedValue(audio)
  vi.stubGlobal("Worker", AudioWorker)
  vi.stubGlobal(
    "OfflineAudioContext",
    class {
      decodeAudioData = decode
    }
  )
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    drawing as unknown as CanvasRenderingContext2D
  )
  vi.spyOn(
    HTMLCanvasElement.prototype,
    "getBoundingClientRect"
  ).mockReturnValue(new DOMRect(0, 0, 610, 240))
})
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  vi.clearAllMocks()
})

function setup() {
  const { container } = render(
    <AudioSpectrumAnalyzer messages={messages} lang="en" />
  )
  const input = container.querySelector('input[type="file"]')!
  const choose = (name: string) =>
    fireEvent.change(input, { target: { files: [new File([], name)] } })
  return { choose, container }
}

it("shows the measured peak and supports scale changes, keyboard inspection and pointer selection", async () => {
  const { choose, container } = setup()
  const revoke = vi.spyOn(URL, "revokeObjectURL")
  const observe = vi.spyOn(ResizeObserver.prototype, "observe")
  choose("tone.wav")
  expect(screen.getByRole("status").textContent).toBe(messages.analyzing)
  const worker = workers[0]!
  await waitFor(() =>
    expect(worker.postMessage).toHaveBeenCalledWith(
      { channels: [samples], frameLength: 1 },
      [expect.any(ArrayBuffer)]
    )
  )
  const levels = new Float32Array(FFT_SIZE / 2 + 1).fill(MIN_DB)
  levels[170] = -12
  act(() => worker.receive({ levels, peak: 170 }))
  expect(worker.terminate).toHaveBeenCalledOnce()
  expect(screen.getByRole("status").textContent).toBe(messages.ready)
  expect(drawing.lineTo).toHaveBeenCalled()

  const slider = screen.getByRole("slider", { name: messages.cursor })
  const canvas = container.querySelector("canvas")!
  expect(observe).toHaveBeenCalledWith(canvas)
  const observed = observe.mock.calls.length
  const draws = drawing.clearRect.mock.calls.length
  expect(slider.getAttribute("aria-valuetext")).toBe("996.1 Hz, -12 dBFS")
  fireEvent.change(slider, { target: { value: String(FFT_SIZE / 4) } })
  expect(slider.getAttribute("aria-valuetext")).toBe("375 Hz, ≤ -100 dBFS")
  expect(observe).toHaveBeenCalledTimes(observed)
  expect(drawing.clearRect).toHaveBeenCalledTimes(draws)
  fireEvent.change(screen.getByRole("combobox", { name: messages.scale }), {
    target: { value: "linear" },
  })
  expect(drawing.clearRect).toHaveBeenCalledTimes(draws + 1)
  fireEvent.change(slider, { target: { value: "0" } })
  expect(slider.getAttribute("aria-valuetext")).toBe("0 Hz, ≤ -100 dBFS")
  fireEvent.pointerMove(canvas, { pointerType: "touch", clientX: 500 })
  expect(slider.getAttribute("aria-valuetext")).toBe("0 Hz, ≤ -100 dBFS")
  fireEvent.pointerMove(canvas, { pointerType: "mouse", clientX: 589 })
  expect(slider.getAttribute("aria-valuetext")).toBe("24,000 Hz, ≤ -100 dBFS")
  fireEvent.pointerDown(canvas, { pointerType: "touch", clientX: 315 })
  expect(slider.getAttribute("aria-valuetext")).toBe("12,000 Hz, ≤ -100 dBFS")
  expect((slider as HTMLInputElement).valueAsNumber).toBe(FFT_SIZE / 4)
  const url = screen.getByLabelText(messages.preview).getAttribute("src")
  expect(url).toMatch(/^blob:/)
  choose("another.wav")
  expect(revoke).toHaveBeenCalledWith(url)
})

it("recovers from an unreadable file, surround audio, and silent audio without canvas", async () => {
  const { choose } = setup()
  decode.mockRejectedValueOnce(new Error("Unreadable"))
  choose("bad.wav")
  expect((await screen.findByRole("alert")).textContent).toBe(
    messages.readError
  )

  decode.mockResolvedValueOnce({ ...audio, numberOfChannels: 3 })
  choose("surround.wav")
  await waitFor(() =>
    expect(screen.getByRole("alert").textContent).toBe(messages.channelError)
  )
  choose("quiet.wav")
  const worker = workers.at(-1)!
  await waitFor(() => expect(worker.postMessage).toHaveBeenCalled())
  vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValue(null)
  act(() =>
    worker.receive({
      levels: new Float32Array(FFT_SIZE / 2 + 1).fill(MIN_DB),
      peak: null,
    })
  )
  expect(screen.getByText(messages.silent)).toBeTruthy()
  expect(screen.getByRole("slider").getAttribute("aria-valuetext")).toBe(
    "5.9 Hz, ≤ -100 dBFS"
  )
})

it("shows a zero-frequency peak for a signal with DC offset", async () => {
  const { choose } = setup()
  choose("offset.wav")
  const worker = workers[0]!
  await waitFor(() => expect(worker.postMessage).toHaveBeenCalled())
  const levels = new Float32Array(FFT_SIZE / 2 + 1).fill(MIN_DB)
  levels[0] = -6
  act(() => worker.receive({ levels, peak: 0 }))
  expect(screen.getByText("0 Hz")).toBeTruthy()
  expect(screen.queryByText(messages.silent)).toBeNull()
  fireEvent.change(screen.getByRole("combobox", { name: messages.scale }), {
    target: { value: "linear" },
  })
  expect(screen.getByRole("slider").getAttribute("aria-valuetext")).toBe(
    "0 Hz, -6 dBFS"
  )
})

it("discards a decode after replacement and handles a worker error", async () => {
  const { choose } = setup()
  let release!: (buffer: typeof audio) => void
  decode.mockReturnValueOnce(
    new Promise((resolve) => {
      release = resolve
    })
  )
  choose("slow.wav")
  await waitFor(() => expect(decode).toHaveBeenCalledOnce())
  choose("quick.wav")
  expect(workers[0]!.terminate).toHaveBeenCalledOnce()
  await act(async () => release(audio))
  expect(workers[0]!.postMessage).not.toHaveBeenCalled()
  act(() => workers[1]!.onerror?.())
  expect(screen.getByRole("alert").textContent).toBe(messages.readError)
})
