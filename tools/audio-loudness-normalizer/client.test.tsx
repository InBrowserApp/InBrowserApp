import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import AudioLoudnessNormalizer from "./client"
import messages from "./messages/en.json"
import type { Request, Response } from "./workers/normalize"

class AudioWorker extends EventTarget {
  onmessage: ((event: MessageEvent<Response>) => void) | undefined
  onerror: (() => void) | undefined
  postMessage = vi.fn<(request: Request) => void>()
  terminate = vi.fn()
  constructor() {
    super()
    workers.push(this)
  }
  receive(data: Response) {
    const message = new MessageEvent("message", { data })
    this.onmessage?.(message)
    this.dispatchEvent(message)
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
  const { container } = render(
    <AudioLoudnessNormalizer messages={messages} lang="en" />
  )
  const input = container.querySelector<HTMLInputElement>('input[type="file"]')!
  const choose = (name: string) =>
    fireEvent.change(input, { target: { files: [new File([], name)] } })
  return { choose, input }
}

function lastRender(worker: AudioWorker) {
  const request = worker.postMessage.mock.lastCall?.[0]
  expect(request?.type).toBe("render")
  return request as Extract<Request, { type: "render" }>
}

describe("Audio Loudness Normalizer", () => {
  it("measures local audio, renders a default WAV and refreshes it for a new target", async () => {
    const { choose, input } = setup()
    const click = vi.spyOn(input, "click")
    const revoke = vi.spyOn(URL, "revokeObjectURL")
    fireEvent.click(screen.getByRole("button", { name: messages.chooseFile }))
    expect(click).toHaveBeenCalledOnce()

    choose("episode.take.wav")
    expect(screen.getByRole("status").textContent).toBe(messages.measuring)
    const worker = workers[0]!
    await waitFor(() =>
      expect(worker.postMessage).toHaveBeenCalledWith(
        { type: "measure", channels: [samples] },
        [expect.any(ArrayBuffer)]
      )
    )
    act(() => worker.receive({ type: "measured", loudness: -24, peak: -8 }))
    const target = await screen.findByRole("combobox", {
      name: messages.target,
    })
    await waitFor(() => expect(lastRender(worker).target).toBe(-16))
    const id = lastRender(worker).id
    const deliver = (id: number, limited = false) =>
      act(() =>
        worker.receive({
          type: "rendered",
          id,
          wav: new ArrayBuffer(44),
          metrics: { limited, gain: 3, loudness: -21, peak: -5 },
        })
      )
    deliver(id, true)
    expect(screen.getByText(messages.peakLimited)).toBeTruthy()
    const link = await screen.findByRole("link", { name: messages.download })
    const url = link.getAttribute("href")
    expect(link.getAttribute("download")).toBe("episode.take-normalized.wav")
    expect(screen.getByLabelText(messages.preview).getAttribute("src")).toBe(
      url
    )
    fireEvent.change(target, { target: { value: "custom" } })
    const custom = screen.getByRole("spinbutton")
    fireEvent.change(custom, { target: { value: "" } })
    expect(custom.getAttribute("aria-invalid")).toBe("true")
    expect(screen.queryByRole("link", { name: messages.download })).toBeNull()
    expect(revoke).toHaveBeenCalledWith(url)
    fireEvent.change(custom, { target: { value: "-22.5" } })
    await waitFor(() => expect(lastRender(worker).target).toBe(-22.5))
    const customId = lastRender(worker).id
    deliver(id)
    expect(screen.queryByRole("link", { name: messages.download })).toBeNull()
    act(() => worker.receive({ type: "renderError", id: customId }))
    expect(screen.getByRole("alert").textContent).toContain(
      messages.exportError
    )
    fireEvent.click(screen.getByRole("button", { name: messages.retry }))
    await waitFor(() => expect(lastRender(worker).id).toBeGreaterThan(customId))
    deliver(lastRender(worker).id)
    expect(
      await screen.findByRole("link", { name: messages.download })
    ).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: messages.changeFile }))
    expect(click).toHaveBeenCalledTimes(2)
  })

  it("allows a replacement after invalid input, silence or unsupported channels", async () => {
    const { choose } = setup()
    decode.mockRejectedValueOnce(new Error("Broken file"))
    choose("bad.mp3")
    expect((await screen.findByRole("alert")).textContent).toBe(
      messages.readError
    )

    decode.mockResolvedValueOnce({ ...audio, numberOfChannels: 6 })
    choose("surround.wav")
    await waitFor(() =>
      expect(screen.getByRole("alert").textContent).toBe(messages.channelError)
    )

    const picker = screen.getByRole("button", { name: messages.changeFile })
    fireEvent.dragOver(picker, { dataTransfer: { types: ["Files"] } })
    fireEvent.dragLeave(picker)
    fireEvent.drop(picker, {
      dataTransfer: { files: [new File([], "silent.wav")] },
    })
    const worker = workers.at(-1)!
    await waitFor(() => expect(worker.postMessage).toHaveBeenCalled())
    act(() => worker.receive({ type: "quiet" }))
    expect(screen.getByRole("alert").textContent).toBe(messages.quietError)
    expect(worker.terminate).toHaveBeenCalledOnce()
  })

  it("ignores decoding that finishes after the file is replaced", async () => {
    const { choose } = setup()
    let release!: (buffer: typeof audio) => void
    decode.mockReturnValueOnce(
      new Promise((resolve) => {
        release = resolve
      })
    )
    choose("slow.wav")
    await waitFor(() => expect(decode).toHaveBeenCalledOnce())
    choose("replacement.wav")
    expect(workers[0]!.terminate).toHaveBeenCalledOnce()
    await act(async () => release(audio))
    expect(workers[0]!.postMessage).not.toHaveBeenCalled()
    act(() => workers[1]!.onerror?.())
    expect(screen.getByRole("alert").textContent).toBe(messages.readError)
  })
})
