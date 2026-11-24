import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, it, vi } from "vitest"

import BpmDetector from "./client"
import messages from "./messages/en.json"

class AudioWorker {
  onmessage?: (event: MessageEvent<number | null>) => void
  onerror?: () => void
  postMessage = vi.fn()
  terminate = vi.fn()
  constructor() {
    workers.push(this)
  }
  receive(data: number | null) {
    this.onmessage?.(new MessageEvent("message", { data }))
  }
}

const workers: AudioWorker[] = []
const decode = vi.fn()
const samples = Float32Array.of(0.1)
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
  vi.restoreAllMocks()
})

function setup() {
  const { container } = render(<BpmDetector messages={messages} lang="en" />)
  const input = container.querySelector('input[type="file"]')!
  const choose = (name: string) =>
    fireEvent.change(input, { target: { files: [new File([], name)] } })
  return { choose }
}

it("reports a tempo, copies it, plays the local file, and releases the URL on replacement", async () => {
  const { choose } = setup()
  const copy = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue()
  const revoke = vi.spyOn(URL, "revokeObjectURL")
  choose("loop.wav")
  expect(screen.getByRole("status").textContent).toBe(messages.analyzing)
  const worker = workers[0]!
  await waitFor(() =>
    expect(worker.postMessage).toHaveBeenCalledWith(
      [[samples]],
      [expect.any(ArrayBuffer)]
    )
  )
  act(() => worker.receive(125))
  expect(worker.terminate).toHaveBeenCalledOnce()
  expect(screen.getByRole("status").textContent).toContain("125 BPM")
  expect(screen.getByText("62.5 BPM")).toBeTruthy()
  expect(screen.getByText("250 BPM")).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: messages.copy }))
  expect(await screen.findByText(messages.copied)).toBeTruthy()
  expect(copy).toHaveBeenCalledWith("125")
  const source = screen.getByLabelText(messages.preview).getAttribute("src")
  expect(source).toMatch(/^blob:/)
  choose("another.wav")
  expect(revoke).toHaveBeenCalledWith(source)
})

it("explains when a file has no steady tempo and recovers from invalid input", async () => {
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

  choose("ambient.wav")
  const worker = workers.at(-1)!
  await waitFor(() => expect(worker.postMessage).toHaveBeenCalledOnce())
  act(() => worker.receive(null))
  expect(screen.getByRole("status").textContent).toBe(messages.noTempo)
  expect(screen.queryByRole("button", { name: messages.copy })).toBeNull()
  expect(screen.getByLabelText(messages.preview)).toBeTruthy()
})

it("discards an outdated decode and handles a worker error", async () => {
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
