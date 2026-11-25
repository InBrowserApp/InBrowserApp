import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import MidiToWav from "./client"
import messages from "./messages/en.json"

import type { Response } from "@workspace/midi-audio/worker-client"

const workers: TestWorker[] = []
class TestWorker {
  onmessage?: (event: { data: Response }) => void
  onerror?: () => void
  terminate = vi.fn()
  postMessage = vi.fn()

  constructor() {
    workers.push(this)
  }

  send(data: Response) {
    act(() => this.onmessage?.({ data }))
  }
}

function select(file: File, index = 0) {
  fireEvent.change(document.querySelectorAll("input[type=file]")[index]!, {
    target: { files: [file] },
  })
}

function start() {
  fireEvent.click(screen.getByRole("button", { name: messages.render }))
}

beforeEach(() => {
  workers.length = 0
  vi.stubGlobal("Worker", TestWorker)
})
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe("MIDI to WAV", () => {
  it("renders the chosen MIDI, shows progress, and offers an audio preview and download", () => {
    render(<MidiToWav messages={messages} />)
    expect(
      screen.getByRole<HTMLButtonElement>("button", { name: messages.render })
        .disabled
    ).toBe(true)
    const midi = new File(["midi"], "song.MIDI")
    select(midi)
    start()
    expect(workers[0]?.postMessage).toHaveBeenCalledWith({
      file: midi,
      soundFont: undefined,
    })
    workers[0]!.send({ type: "progress", percent: 55 })
    expect(screen.getByRole("progressbar").getAttribute("value")).toBe("55")
    workers[0]!.send({ type: "complete", wav: new ArrayBuffer(44) })
    expect(workers[0]?.terminate).toHaveBeenCalledOnce()
    expect(screen.getByLabelText(messages.preview)).toBeTruthy()
    expect(
      screen
        .getByRole("link", { name: messages.download })
        .getAttribute("download")
    ).toBe("song.wav")
  })

  it("uses a selected SoundFont, supports cancellation, and recovers with the default", () => {
    const app = render(<MidiToWav messages={messages} />)
    const midi = new File(["midi"], "song.mid")
    const soundFont = new File(["bank"], "invalid.sf2")
    select(midi)
    select(soundFont, 1)
    expect(screen.getByText("invalid.sf2")).toBeTruthy()
    start()
    expect(workers[0]?.postMessage).toHaveBeenCalledWith({
      file: midi,
      soundFont,
    })
    workers[0]!.send({ type: "error", key: "invalidSoundFont" })
    expect(screen.getByRole("alert").textContent).toBe(
      messages.invalidSoundFont
    )
    fireEvent.click(
      screen.getByRole("button", { name: messages.useDefaultSoundFont })
    )
    expect(screen.getByText(messages.defaultSoundFont)).toBeTruthy()
    expect(screen.queryByRole("alert")).toBeNull()
    start()
    fireEvent.click(screen.getByRole("button", { name: messages.cancel }))
    expect(workers[1]!.terminate).toHaveBeenCalledOnce()
    workers[1]!.send({ type: "complete", wav: new ArrayBuffer(44) })
    expect(screen.queryByRole("link", { name: messages.download })).toBeNull()
    start()
    app.unmount()
    expect(workers[2]!.terminate).toHaveBeenCalledOnce()
  })

  it("surfaces worker errors and allows a retry", () => {
    render(<MidiToWav messages={messages} />)
    select(new File(["midi"], "song.mid"))
    start()
    act(() => workers[0]?.onerror?.())
    expect(screen.getByRole("alert").textContent).toBe(messages.renderFailed)
    vi.stubGlobal(
      "Worker",
      class {
        constructor() {
          throw Error("cannot construct")
        }
      }
    )
    start()
    expect(screen.getByRole("alert").textContent).toBe(messages.renderFailed)
  })
})
