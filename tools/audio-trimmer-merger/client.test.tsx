import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import AudioEditorClient from "./client"
import { useAudioEditor } from "./client/use-audio-editor"
import { usePreview } from "./client/use-preview"
import { encodeWav } from "./core/audio"
import copy from "./messages/en.json"
import { DEFAULT_SETTINGS } from "./core/settings"
import meta from "./meta/en.json"
import type { AudioClip } from "./types"

const messages = { ...copy, meta }
const buffer = (channels = 1) =>
  ({
    duration: 2,
    length: 96000,
    numberOfChannels: channels,
    getChannelData: () => new Float32Array(96000).fill(0.5),
  }) as unknown as AudioBuffer
let decode: ReturnType<typeof vi.fn>
const encoders: FakeWorker[] = []
const currentWorker = () => encoders.at(-1)!
let source: {
  buffer: AudioBuffer | null
  connect: ReturnType<typeof vi.fn>
  disconnect: ReturnType<typeof vi.fn>
  start: ReturnType<typeof vi.fn>
  stop: ReturnType<typeof vi.fn>
  onended: (() => void) | null
}
let resume: ReturnType<typeof vi.fn>
let close: ReturnType<typeof vi.fn>
const file = (name = "voice.wav") =>
  new File(["sound"], name, { type: "audio/wav" })
class FakeWorker {
  onmessage: ((event: { data: object }) => void) | null = null
  onerror: (() => void) | null = null
  terminate = vi.fn()
  postMessage = vi.fn((data) =>
    this.onmessage?.({
      data: {
        buffer: encodeWav(data.clips, data.settings.smooth, data.settings.join),
      },
    })
  )
  constructor() {
    encoders.push(this)
  }
}

beforeEach(() => {
  encoders.length = 0
  decode = vi.fn(async () => buffer())
  resume = vi.fn(async () => {})
  close = vi.fn(async () => {})
  source = {
    buffer: null,
    connect: vi.fn(),
    disconnect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    onended: null,
  }
  vi.stubGlobal(
    "OfflineAudioContext",
    class {
      decodeAudioData = decode
    }
  )
  vi.stubGlobal(
    "AudioContext",
    class {
      resume = resume
      close = close
      destination = {}
      createBufferSource = () => source
    }
  )
  vi.stubGlobal("Worker", FakeWorker)
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:audio")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
const inputFiles = async (files: File[]) => {
  fireEvent.change(screen.getByLabelText(copy.addButton), { target: { files } })
  await waitFor(() => expect(screen.queryByText(copy.loading)).toBeNull())
}

describe("audio editor workflow", () => {
  test("imports, trims, reorders, removes, restores and exports clips", async () => {
    render(<AudioEditorClient messages={messages} />)
    expect(screen.getByText(copy.emptyTitle)).toBeTruthy()
    expect(
      (screen.getByText(copy.exportButton) as HTMLButtonElement).disabled
    ).toBe(true)
    await inputFiles([file(), file("music.mp3")])
    expect(screen.getAllByRole("slider")).toHaveLength(4)
    expect(screen.getAllByRole("slider")[0]!.getAttribute("aria-label")).toBe(
      copy.startLabel
    )
    fireEvent.change(
      screen.getAllByLabelText(copy.startLabel, { selector: "input" })[0]!,
      { target: { value: "0.5" } }
    )
    fireEvent.change(
      screen.getAllByLabelText(copy.endLabel, { selector: "input" })[0]!,
      { target: { value: "1.5" } }
    )
    expect(screen.getAllByText("0:01.000").length).toBeGreaterThan(0)
    fireEvent.click(screen.getAllByLabelText(copy.moveDownButton)[0]!)
    expect(screen.getAllByRole("spinbutton")[0]!.getAttribute("value")).toBe(
      "0"
    )
    fireEvent.click(screen.getAllByLabelText(copy.moveUpButton)[1]!)
    fireEvent.click(screen.getAllByLabelText(copy.removeButton)[0]!)
    expect(screen.queryByText("voice.wav")).toBeNull()
    fireEvent.click(screen.getByText(copy.undoButton))
    fireEvent.click(screen.getAllByText(copy.resetButton)[0]!)
    fireEvent.click(screen.getByRole("switch"))
    fireEvent.change(screen.getByLabelText(copy.outputNameLabel), {
      target: { value: "joined.WAV" },
    })
    fireEvent.click(screen.getByText(copy.exportButton))
    expect(await screen.findByText(copy.outputTitle)).toBeTruthy()
    expect(
      screen
        .getByText(copy.downloadButton.replace("{format}", "MP3"))
        .getAttribute("download")
    ).toBe("joined.mp3")
    expect(currentWorker().terminate).toHaveBeenCalledOnce()
    fireEvent.change(screen.getByLabelText(copy.outputNameLabel), {
      target: { value: " " },
    })
    expect(
      screen
        .getByText(copy.downloadButton.replace("{format}", "MP3"))
        .getAttribute("download")
    ).toBe("audio.mp3")
    fireEvent.play(screen.getByLabelText(copy.outputPreviewLabel))
    fireEvent.change(
      screen.getAllByLabelText(copy.startLabel, { selector: "input" })[0]!,
      { target: { value: "0.2" } }
    )
    expect(
      screen.queryByText(copy.downloadButton.replace("{format}", "MP3"))
    ).toBeNull()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:audio")
  })
  test("invalid and empty times show inline errors and disable export, reset recovers", async () => {
    render(<AudioEditorClient messages={messages} />)
    await inputFiles([file()])
    fireEvent.change(
      screen.getByLabelText(copy.startLabel, { selector: "input" }),
      { target: { value: "3" } }
    )
    expect(screen.getByText(copy.rangeError)).toBeTruthy()
    expect(
      (screen.getByText(copy.exportButton) as HTMLButtonElement).disabled
    ).toBe(true)
    fireEvent.change(
      screen.getByLabelText(copy.endLabel, { selector: "input" }),
      { target: { value: "" } }
    )
    expect(screen.queryByText(/NaN/)).toBeNull()
    fireEvent.click(screen.getByText(copy.resetButton))
    expect(screen.queryByText(copy.rangeError)).toBeNull()
    const slider = screen.getAllByRole("slider")[0]!
    fireEvent.keyDown(slider, { key: "ArrowRight" })
  })
  test("selection playback stops on request, edits and natural completion", async () => {
    render(<AudioEditorClient messages={messages} />)
    await inputFiles([file()])
    fireEvent.click(screen.getByText(copy.previewButton))
    expect(await screen.findByText(copy.stopButton)).toBeTruthy()
    expect(source.start).toHaveBeenCalledWith(0, 0, 2)
    fireEvent.click(screen.getByText(copy.stopButton))
    expect(source.stop).toHaveBeenCalled()
    fireEvent.click(screen.getByText(copy.previewButton))
    await screen.findByText(copy.stopButton)
    act(() => source.onended?.())
    expect(screen.queryByText(copy.stopButton)).toBeNull()
  })
  test("file chooser, drag and drop and partial failures preserve readable clips", async () => {
    decode.mockRejectedValueOnce(new Error("codec"))
    render(<AudioEditorClient messages={messages} />)
    const input = screen.getByLabelText(copy.addButton)
    const click = vi.spyOn(input, "click")
    fireEvent.click(screen.getByRole("button", { name: copy.addButton }))
    expect(click).toHaveBeenCalledOnce()
    const card = screen.getByText(copy.addTitle).closest('[data-slot="card"]')!
    const transfer = new DataTransfer()
    transfer.items.add(file("bad.mp3"))
    transfer.items.add(file())
    fireEvent.dragOver(card, { dataTransfer: transfer })

    fireEvent.drop(card, { dataTransfer: transfer })
    expect(await screen.findByText("voice.wav")).toBeTruthy()
    expect(screen.getByRole("alert").textContent).toContain("bad.mp3")
  })
  test("rejects unsupported codecs, channels and unavailable decoding", async () => {
    decode.mockResolvedValueOnce(buffer(6))
    render(<AudioEditorClient messages={messages} />)
    await inputFiles([file("surround.wav")])
    expect(screen.getByRole("alert").textContent).toContain("surround.wav")
    vi.stubGlobal("OfflineAudioContext", undefined)
    await inputFiles([file()])
    expect(screen.getByText(copy.unsupportedError)).toBeTruthy()
  })
  test("constructor failure is handled and importing can be retried", async () => {
    vi.stubGlobal(
      "OfflineAudioContext",
      class {
        constructor() {
          throw Error()
        }
      }
    )
    const { result } = renderHook(() => useAudioEditor(messages))
    await act(() => result.current.addFiles([file()]))
    expect(result.current.error).toBe(copy.unsupportedError)
    expect(result.current.busy).toBeNull()
  })
  test("worker errors release busy state for retry", async () => {
    const { result } = renderHook(() => useAudioEditor(messages))
    await act(() => result.current.addFiles([file()]))
    vi.stubGlobal(
      "Worker",
      class extends FakeWorker {
        override postMessage = vi.fn()
      }
    )
    act(() => result.current.exportAudio())
    expect(result.current.busy).toBe("exporting")
    act(() => currentWorker().onmessage?.({ data: { error: true } }))
    expect(result.current.error).toBe(copy.exportError)
    act(() => result.current.exportAudio())
    act(() => currentWorker().onerror?.())
    expect(result.current.busy).toBeNull()
    vi.stubGlobal(
      "Worker",
      class {
        constructor() {
          throw Error()
        }
      }
    )
    act(() => result.current.exportAudio())
    expect(result.current.error).toBe(copy.exportError)
    expect(result.current.busy).toBeNull()
  })
  test("blocks concurrent operations and ignores decoding after unmount", async () => {
    let resolve!: (audio: AudioBuffer) => void
    decode.mockImplementation(
      () =>
        new Promise((done) => {
          resolve = done
        })
    )
    const { result, unmount } = renderHook(() => useAudioEditor(messages))
    let pending!: Promise<void>
    act(() => {
      pending = result.current.addFiles([file()])
    })
    await waitFor(() => expect(decode).toHaveBeenCalled())
    await act(() => result.current.addFiles([file("ignored.wav")]))
    act(() => result.current.exportAudio())
    expect(decode).toHaveBeenCalledOnce()
    unmount()
    await act(async () => {
      resolve(buffer())
      await pending
    })
    expect(URL.createObjectURL).not.toHaveBeenCalled()
  })
  test("ignores failed decoding after unmount and terminates unfinished export", async () => {
    let reject!: (error: Error) => void
    decode.mockImplementationOnce(
      () =>
        new Promise((_, fail) => {
          reject = fail
        })
    )
    const first = renderHook(() => useAudioEditor(messages))
    let pending!: Promise<void>
    act(() => {
      pending = first.result.current.addFiles([file()])
    })
    await waitFor(() => expect(decode).toHaveBeenCalled())
    first.unmount()
    await act(async () => {
      reject(Error())
      await pending
    })
    const second = renderHook(() => useAudioEditor(messages))
    await act(() => second.result.current.addFiles([file()]))
    vi.stubGlobal(
      "Worker",
      class extends FakeWorker {
        override postMessage = vi.fn()
      }
    )
    act(() => second.result.current.exportAudio())
    second.unmount()
    expect(currentWorker().terminate).toHaveBeenCalled()
  })
  test("empty imports, invalid export, undo and out-of-bounds movement are harmless", async () => {
    const { result } = renderHook(() => useAudioEditor(messages))
    await act(() => result.current.addFiles([]))
    act(() => {
      result.current.exportAudio()
      result.current.undo()
    })
    await act(() => result.current.addFiles([file()]))
    act(() => {
      result.current.move(0, -1)
      result.current.move(0, 1)
    })
    expect(result.current.clips).toHaveLength(1)
    act(() => result.current.setName(" "))
    act(() => result.current.exportAudio())
    expect(result.current.result?.url).toBe("blob:audio")
    act(() => result.current.setSettings({ ...DEFAULT_SETTINGS, smooth: true }))
    expect(result.current.result).toBeNull()
  })
})

describe("preview lifecycle", () => {
  const clip = { id: "a", buffer: buffer(), start: 0.5, end: 1.5 } as AudioClip
  test("resume failure shows actionable error and closes context on unmount", async () => {
    resume.mockRejectedValueOnce(Error())
    const error = vi.fn()
    const { result, unmount } = renderHook(() => usePreview(error))
    await act(() => result.current.play(clip))
    expect(error).toHaveBeenCalledOnce()
    unmount()
    expect(close).toHaveBeenCalledOnce()
  })
  test("pending resume cannot start after stopping or unmounting", async () => {
    let resolve!: () => void
    resume.mockImplementation(
      () =>
        new Promise<void>((done) => {
          resolve = done
        })
    )
    const { result, unmount } = renderHook(() => usePreview(vi.fn()))
    let playing!: Promise<void>
    act(() => {
      playing = result.current.play(clip)
    })
    act(() => result.current.stop())
    await act(async () => {
      resolve()
      await playing
    })
    expect(source.start).not.toHaveBeenCalled()
    act(() => {
      playing = result.current.play(clip)
    })
    unmount()
    await act(async () => {
      resolve()
      await playing
    })
    expect(source.start).not.toHaveBeenCalled()
  })
  test("late resume errors are ignored and active playback is stopped on unmount", async () => {
    let reject!: (error: Error) => void
    resume.mockImplementationOnce(
      () =>
        new Promise<void>((_, fail) => {
          reject = fail
        })
    )
    const error = vi.fn()
    const { result, unmount } = renderHook(() => usePreview(error))
    let playing!: Promise<void>
    act(() => {
      playing = result.current.play(clip)
    })
    act(() => result.current.stop())
    await act(async () => {
      reject(Error())
      await playing
    })
    expect(error).not.toHaveBeenCalled()
    await act(() => result.current.play(clip))
    unmount()
    expect(source.stop).toHaveBeenCalled()
    expect(source.onended).toBeNull()
  })
})

async function chooseOption(label: string, option: string) {
  fireEvent.keyDown(screen.getByLabelText(label), { key: "ArrowDown" })
  fireEvent.click(await screen.findByRole("option", { name: option }))
}

test("format and transition settings update downloads, durations and estimates", async () => {
  render(<AudioEditorClient messages={messages} language="de" />)
  await inputFiles([file()])
  fireEvent.click(screen.getByLabelText(copy.duplicateButton))
  expect(screen.getAllByRole("spinbutton")).toHaveLength(4)
  await chooseOption(copy.joinLabel, copy.joinCrossfade)
  expect(screen.getAllByText("0:03.500").length).toBeGreaterThan(0)
  fireEvent.change(screen.getByLabelText(copy.joinSecondsLabel), {
    target: { value: "5" },
  })
  expect(screen.getAllByText("0:03.000").length).toBeGreaterThan(0)
  fireEvent.change(screen.getByLabelText(copy.joinSecondsLabel), {
    target: { value: "" },
  })
  expect(screen.getByText(copy.joinError)).toBeTruthy()
  expect(
    (screen.getByText(copy.exportButton) as HTMLButtonElement).disabled
  ).toBe(true)
  fireEvent.change(screen.getByLabelText(copy.joinSecondsLabel), {
    target: { value: "0.5" },
  })
  await chooseOption(copy.joinLabel, copy.joinGap)
  expect(screen.getAllByText("0:04.500").length).toBeGreaterThan(0)
  await chooseOption(copy.joinLabel, copy.joinNone)
  fireEvent.click(screen.getByText("WAV", { exact: true }))
  expect(screen.queryByLabelText(copy.qualityLabel)).toBeNull()
  fireEvent.click(screen.getByText(copy.exportButton))
  expect(
    await screen.findByText(copy.downloadButton.replace("{format}", "WAV"))
  ).toBeTruthy()
  expect(
    screen
      .getByText(copy.downloadButton.replace("{format}", "WAV"))
      .getAttribute("download")
  ).toBe("voice.wav")
  fireEvent.click(screen.getByText("OGG", { exact: true }))
  expect(screen.queryByText(copy.outputTitle)).toBeNull()
  expect(screen.getByText(copy.oggQualityNote)).toBeTruthy()
  await chooseOption(copy.qualityLabel, copy.qualityHigh)
  fireEvent.click(screen.getByText("OGG", { exact: true }))
  expect(screen.getByText(copy.formatOggNote)).toBeTruthy()
  fireEvent.click(screen.getByText(copy.exportButton))
  expect(
    await screen.findByText(copy.downloadButton.replace("{format}", "OGG"))
  ).toBeTruthy()
})

test("export progress and cancellation preserve clips and ignore late worker messages", async () => {
  vi.stubGlobal(
    "Worker",
    class extends FakeWorker {
      override postMessage = vi.fn()
    }
  )
  render(<AudioEditorClient messages={messages} />)
  await inputFiles([file()])
  fireEvent.click(screen.getByText(copy.exportButton))
  const worker = currentWorker()
  act(() => worker.onmessage?.({ data: { progress: 42 } }))
  expect(
    (screen.getByLabelText(copy.progressLabel) as HTMLProgressElement).value
  ).toBe(42)
  expect(screen.getByText("42%")).toBeTruthy()
  fireEvent.click(screen.getByText(copy.cancelButton))
  expect(worker.terminate).toHaveBeenCalledOnce()
  act(() => {
    worker.onmessage?.({ data: { buffer: new ArrayBuffer(4) } })
    worker.onerror?.()
  })
  expect(screen.queryByText(copy.outputTitle)).toBeNull()
  expect(screen.queryByRole("alert")).toBeNull()
  expect(screen.getByText("voice.wav")).toBeTruthy()
  fireEvent.click(screen.getByText(copy.exportButton))
  expect(screen.getByText(copy.cancelButton)).toBeTruthy()
})

test("a single remaining clip can export even after an invalid join duration", async () => {
  const { result } = renderHook(() => useAudioEditor(messages))
  await act(() => result.current.addFiles([file(), file("next.wav")]))
  act(() =>
    result.current.setSettings({
      ...DEFAULT_SETTINGS,
      join: { mode: "gap", seconds: NaN },
    })
  )
  expect(result.current.valid).toBe(false)
  act(() => result.current.remove(1))
  expect(result.current.valid).toBe(true)
})
