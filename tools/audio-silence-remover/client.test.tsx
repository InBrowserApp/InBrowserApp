import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, it, vi } from "vitest"

import AudioSilenceRemover from "./client"
import { audioLevels } from "./core/silence"
import messages from "./messages/en.json"
import type { Request, Response } from "./workers/remove"

class AudioWorker extends EventTarget {
  onmessage?: (event: MessageEvent<Response>) => void
  onerror?: () => void
  postMessage = vi.fn<(request: Request) => void>()
  terminate = vi.fn()
  constructor() {
    super()
    workers.push(this)
  }
  receive(data: Response) {
    const event = new MessageEvent("message", { data })
    this.onmessage?.(event)
    this.dispatchEvent(event)
  }
}

const workers: AudioWorker[] = []
const decode = vi.fn()
const samples = new Float32Array(4 * 48_000)
samples.fill(0.3, 0, 48_000)
samples.fill(0.3, 3 * 48_000)
const audio = { numberOfChannels: 1, getChannelData: () => samples }
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
})
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

function setup() {
  const { container } = render(
    <AudioSilenceRemover messages={messages} lang="en" />
  )
  const input = container.querySelector('input[type="file"]')!
  const choose = (name: string) =>
    fireEvent.change(input, { target: { files: [new File([], name)] } })
  return { choose }
}

it("shows cuts, updates detection, retries export and downloads the edited file", async () => {
  const { choose } = setup()
  choose("interview.wav")
  expect(screen.getByRole("status").textContent).toBe(messages.analyzing)
  const worker = workers[0]!
  await waitFor(() =>
    expect(worker.postMessage).toHaveBeenCalledWith(
      { type: "analyze", channels: [samples] },
      [expect.any(ArrayBuffer)]
    )
  )
  act(() => worker.receive({ type: "analyzed", audio: audioLevels([samples]) }))
  expect(screen.getByText("1.85 sec")).toBeTruthy()
  const minimum = screen.getByRole("slider", { name: messages.minimum })
  fireEvent.change(minimum, { target: { value: "3" } })
  expect(screen.getByText(messages.noCuts)).toBeTruthy()
  fireEvent.change(minimum, { target: { value: "0.8" } })
  fireEvent.change(screen.getByRole("slider", { name: messages.threshold }), {
    target: { value: "-45" },
  })

  const apply = screen.getByRole("button", { name: messages.cut })
  fireEvent.click(apply)
  expect(apply.hasAttribute("disabled")).toBe(true)
  expect(worker.postMessage).toHaveBeenLastCalledWith({
    type: "edit",
    cuts: [{ start: 51600, end: 140400 }],
  })
  act(() => worker.receive({ type: "error" }))
  expect(screen.getByRole("alert").textContent).toBe(messages.exportError)
  fireEvent.click(apply)
  act(() => worker.receive({ type: "edited", wav: new ArrayBuffer(44) }))
  const link = screen.getByRole("link", { name: messages.download })
  expect(link.getAttribute("download")).toBe("interview-trimmed.wav")
  expect(screen.getByLabelText(messages.preview).getAttribute("src")).toBe(
    link.getAttribute("href")
  )
})

it("recovers from unsupported input, worker errors and all-quiet sound", async () => {
  const { choose } = setup()
  decode.mockResolvedValueOnce({ ...audio, numberOfChannels: 3 })
  choose("surround.wav")
  expect((await screen.findByRole("alert")).textContent).toBe(
    messages.channelError
  )
  decode.mockRejectedValueOnce(new Error("Unrecognized audio"))
  choose("broken.wav")
  await waitFor(() =>
    expect(screen.getByRole("alert").textContent).toBe(messages.readError)
  )
  choose("quiet.wav")
  const worker = workers.at(-1)!
  await waitFor(() => expect(worker.postMessage).toHaveBeenCalledOnce())
  act(() =>
    worker.receive({
      type: "analyzed",
      audio: audioLevels([Float32Array.of(0)]),
    })
  )
  expect(screen.getByText(messages.allQuiet)).toBeTruthy()
  act(() => worker.onerror?.())
  expect(screen.getByRole("alert").textContent).toBe(messages.readError)
})

it("ignores the result of a decode after its file is replaced", async () => {
  const { choose } = setup()
  let release!: (buffer: typeof audio) => void
  decode.mockReturnValueOnce(
    new Promise((resolve) => {
      release = resolve
    })
  )
  choose("first.wav")
  await waitFor(() => expect(decode).toHaveBeenCalledOnce())
  choose("second.wav")
  await act(async () => release(audio))
  expect(workers[0]!.terminate).toHaveBeenCalledOnce()
  expect(workers[0]!.postMessage).not.toHaveBeenCalled()
})
