import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, it, vi } from "vitest"
import Client from "./client"
import messages from "./messages/en.json"
import { getSpokenLanguages } from "./models"
import type { TranscriptionResponse } from "./worker-messages"

const workers: FakeWorker[] = []
const decodeAudioData = vi.fn()
const startRendering = vi.fn()
const connect = vi.fn()
const begin = vi.fn()
const decoded = new Float32Array(32000)
const file = new File(["samples"], "team.meeting.wav", { type: "audio/wav" })
const segments = [{ start: 250, end: 1480, text: "Team update" }]
const playback = { play: vi.fn() }

class FakeWorker {
  onmessage?: (event: { data: TranscriptionResponse }) => void
  onerror?: () => void
  postMessage = vi.fn()
  terminate = vi.fn()

  constructor() {
    workers.push(this)
  }

  emit(data: TranscriptionResponse) {
    act(() => this.onmessage?.({ data }))
  }
}

function renderTool() {
  const view = render(
    <Client
      messages={messages}
      lang="en"
      languages={getSpokenLanguages("en")}
    />
  )
  const input = view.container.querySelector("input")!
  const start = screen.getByRole<HTMLButtonElement>("button", {
    name: messages.start,
  })
  return { ...view, input, start }
}

function choose(input: HTMLInputElement, recording = file) {
  fireEvent.change(input, { target: { files: [recording] } })
}

async function chooseModel(name: RegExp) {
  fireEvent.keyDown(screen.getByRole("combobox", { name: messages.model }), {
    key: "ArrowDown",
  })
  fireEvent.click(await screen.findByRole("option", { name }))
}

beforeEach(() => {
  workers.length = 0
  vi.resetAllMocks()
  decodeAudioData.mockResolvedValue({
    length: decoded.length,
    numberOfChannels: 1,
    getChannelData: () => decoded,
  })
  vi.stubGlobal(
    "OfflineAudioContext",
    class {
      destination = {}
      decodeAudioData = decodeAudioData
      startRendering = startRendering
      createBufferSource = () => ({ connect, start: begin })
    }
  )
  vi.stubGlobal("Worker", FakeWorker)
  vi.spyOn(URL, "createObjectURL").mockImplementation(
    () => "blob:" + Math.random()
  )
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined)
  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(playback.play)
  playback.play.mockResolvedValue(undefined)
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

it("transcribes a dropped file, then plays, edits, copies and exports its timed result", async () => {
  const view = renderTool()
  expect(view.start.disabled).toBe(true)
  const drop = screen.getByText(messages.dropFile)
  const dataTransfer = { types: ["Files"], files: [file], dropEffect: "" }
  fireEvent.dragOver(drop, { dataTransfer })
  fireEvent.dragLeave(drop, { relatedTarget: null })
  fireEvent.drop(drop, { dataTransfer })
  expect(screen.getByText(file.name)).toBeDefined()
  expect(view.start.disabled).toBe(false)
  await chooseModel(/^Whisper Small/)
  fireEvent.change(screen.getByLabelText(messages.language), {
    target: { value: "zh" },
  })
  fireEvent.click(view.start)

  await waitFor(() => expect(workers).toHaveLength(1))
  expect(workers[0]?.postMessage).toHaveBeenCalledWith(
    { audio: decoded, model: "small", language: "zh", cpuOnly: false },
    [decoded.buffer]
  )
  const worker = workers[0]!
  worker.emit({ type: "loading", backend: "webgpu", progress: 0.42 })
  expect(
    screen
      .getByRole("progressbar", { name: messages.loading })
      .getAttribute("value")
  ).toBe("0.42")
  worker.emit({
    type: "transcribing",
    backend: "webgpu",
    progress: 0.675,
    etaSeconds: 120,
    preview: "Draft excerpt",
  })
  expect(
    screen
      .getByRole("progressbar", { name: messages.transcribing })
      .getAttribute("value")
  ).toBe("0.675")
  expect(screen.getByText("67.5%")).toBeDefined()
  expect(screen.getByText(/About .*2 min.* remaining/)).toBeDefined()
  expect(
    screen.getByRole("group", { name: messages.livePreview })
  ).toBeDefined()
  expect(screen.getByText("Draft excerpt")).toBeDefined()
  expect(screen.queryByRole("textbox")).toBeNull()
  worker.emit({ type: "done", segments })
  expect(screen.queryByRole("progressbar")).toBeNull()
  expect(screen.queryByText("Draft excerpt")).toBeNull()
  expect(worker.terminate).toHaveBeenCalledOnce()
  fireEvent.click(
    screen.getByRole("button", { name: "Play from 00:00:00.250" })
  )
  expect(view.container.querySelector("audio")?.currentTime).toBe(0.25)
  expect(playback.play).toHaveBeenCalledOnce()
  fireEvent.change(screen.getByRole("textbox"), {
    target: { value: "Corrected & reviewed" },
  })
  const writeText = vi
    .spyOn(navigator.clipboard, "writeText")
    .mockResolvedValue(undefined)
  fireEvent.click(screen.getByRole("button", { name: messages.copy }))
  await screen.findByRole("button", { name: messages.copied })
  expect(writeText).toHaveBeenCalledWith(
    "[00:00:00.250] Corrected & reviewed\n"
  )

  const downloads: HTMLAnchorElement[] = []
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
    this: HTMLAnchorElement
  ) {
    downloads.push(this)
  })
  fireEvent.change(screen.getByLabelText(messages.exportFormat), {
    target: { value: "vtt" },
  })
  fireEvent.click(screen.getByRole("button", { name: "Download VTT" }))
  expect(downloads[0]?.download).toBe("team.meeting.vtt")
  const blob = vi.mocked(URL.createObjectURL).mock.lastCall?.[0] as Blob
  expect(await blob.text()).toContain(
    "00:00:00.250 --> 00:00:01.480\nCorrected &amp; reviewed"
  )

  choose(view.input, new File(["samples"], "different.mp3"))
  expect(screen.queryByRole("textbox")).toBeNull()
  expect(URL.revokeObjectURL).toHaveBeenCalled()
})

it("keeps compatible languages when switching engines and resets unsupported languages to automatic", async () => {
  renderTool()
  const language = screen.getByRole<HTMLSelectElement>("combobox", {
    name: messages.language,
  })
  const codes = () => Array.from(language.options, (option) => option.value)
  const changeLanguage = (value: string) =>
    fireEvent.change(language, { target: { value } })

  expect(codes()).toContain("de")
  expect(codes()).not.toContain("yue")
  changeLanguage("de")
  await chooseModel(/^SenseVoiceSmall/)
  expect(new Set(codes())).toEqual(new Set(["", "zh", "yue", "en", "ja", "ko"]))
  expect(language.value).toBe("")

  changeLanguage("ja")
  await chooseModel(/^Whisper Base/)
  expect(language.value).toBe("ja")
  await chooseModel(/^SenseVoiceSmall/)
  expect(language.value).toBe("ja")

  changeLanguage("yue")
  await chooseModel(/^Whisper Base/)
  expect(language.value).toBe("")
})

it("downloads a timestamped partial TXT with only completed passages", async () => {
  const view = renderTool()
  choose(view.input)
  fireEvent.click(view.start)
  await waitFor(() => expect(workers).toHaveLength(1))
  const worker = workers[0]!
  worker.emit({
    type: "transcribing",
    backend: "wasm",
    progress: 0,
    preview: "Working draft",
  })
  expect(
    screen.getByRole("heading", { name: messages.transcript })
  ).toBeDefined()
  const download = screen.getByRole<HTMLButtonElement>("button", {
    name: messages.downloadPartial,
  })
  expect(download.disabled).toBe(true)

  worker.emit({
    type: "transcribing",
    backend: "wasm",
    progress: 0.4,
    partialSegments: segments,
  })
  worker.emit({
    type: "transcribing",
    backend: "wasm",
    progress: 0.4,
    preview: "Next draft",
  })
  expect(download.disabled).toBe(false)
  expect(screen.getByText("Team update")).toBeDefined()
  expect(screen.getByText("Next draft")).toBeDefined()
  expect(screen.queryByRole("textbox")).toBeNull()

  const links: HTMLAnchorElement[] = []
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
    this: HTMLAnchorElement
  ) {
    links.push(this)
  })
  fireEvent.click(download)
  expect(links[0]?.download).toBe("team.meeting.partial.txt")
  const blob = vi.mocked(URL.createObjectURL).mock.lastCall?.[0] as Blob
  expect(await blob.text()).toBe("[00:00:00.250] Team update\n")

  worker.emit({
    type: "done",
    segments: [{ ...segments[0]!, text: "Final wording" }],
  })
  expect(screen.getByRole("button", { name: "Download TXT" })).toBe(download)
  expect(screen.getByRole<HTMLTextAreaElement>("textbox").value).toBe(
    "Final wording"
  )
  expect(screen.queryByText("Next draft")).toBeNull()
})

it("retries with the same samples on CPU and ignores results from a canceled run", async () => {
  const view = renderTool()
  choose(view.input)
  fireEvent.click(view.start)
  await waitFor(() => expect(workers).toHaveLength(1))
  workers[0]!.emit({ type: "retry", audio: decoded })
  expect(workers[0]!.terminate).toHaveBeenCalledOnce()
  const cpu = workers[1]!
  expect(cpu.postMessage).toHaveBeenCalledWith(
    { audio: decoded, model: "base", language: "", cpuOnly: true },
    [decoded.buffer]
  )
  expect(screen.getByText(messages.cpuFallback)).toBeDefined()
  workers[0]!.emit({ type: "transcribing", backend: "webgpu", progress: 0.9 })
  expect(screen.queryByRole("progressbar")).toBeNull()
  cpu.emit({
    type: "transcribing",
    backend: "wasm",
    progress: 0.25,
    etaSeconds: 8,
    preview: "Retry excerpt",
  })
  expect(screen.getByText("25%")).toBeDefined()
  expect(screen.getByText(/About .*8 sec.* remaining/)).toBeDefined()
  fireEvent.click(screen.getByRole("button", { name: messages.cancel }))
  expect(cpu.terminate).toHaveBeenCalledOnce()
  expect(screen.queryByRole("progressbar")).toBeNull()
  expect(screen.queryByText("Retry excerpt")).toBeNull()
  cpu.emit({ type: "done", segments })
  expect(screen.queryByRole("textbox")).toBeNull()
  expect(screen.getByText(file.name)).toBeDefined()
  expect(view.start.disabled).toBe(false)
})

it("highlights the current cue during playback and seeking without taking editor focus", async () => {
  const view = renderTool()
  choose(view.input)
  fireEvent.click(view.start)
  await waitFor(() => expect(workers).toHaveLength(1))
  workers[0]!.emit({
    type: "done",
    segments: [
      { start: 0, end: 1000, text: "Opening" },
      { start: 800, end: 1400, text: "Next topic" },
      { start: 2000, end: 2700, text: "Wrap up" },
    ],
  })

  const audio = view.container.querySelector("audio")!
  const opening = screen.getByRole("button", { name: "Play from 00:00:00.000" })
  const next = screen.getByRole("button", { name: "Play from 00:00:00.800" })
  const wrap = screen.getByRole("button", { name: "Play from 00:00:02.000" })
  const editor = screen.getByRole("textbox", {
    name: "Transcript at 00:00:00.000",
  })

  expect(opening.getAttribute("aria-current")).toBeNull()
  const paused = vi.spyOn(audio, "paused", "get").mockReturnValue(false)
  fireEvent.play(audio)
  expect(opening.getAttribute("aria-current")).toBe("time")
  editor.focus()

  audio.currentTime = 0.8
  fireEvent.timeUpdate(audio)
  expect(opening.getAttribute("aria-current")).toBeNull()
  expect(next.getAttribute("aria-current")).toBe("time")
  expect(document.activeElement).toBe(editor)

  audio.currentTime = 1.4
  fireEvent.timeUpdate(audio)
  expect(next.getAttribute("aria-current")).toBeNull()

  paused.mockReturnValue(true)
  audio.currentTime = 2
  fireEvent.seeking(audio)
  expect(wrap.getAttribute("aria-current")).toBe("time")

  vi.spyOn(audio, "ended", "get").mockReturnValue(true)
  fireEvent.ended(audio)
  expect(wrap.getAttribute("aria-current")).toBeNull()
})

it("keeps the chosen file through decode, model and empty-result failures", async () => {
  const view = renderTool()
  choose(view.input)
  decodeAudioData.mockRejectedValueOnce(Error("unsupported"))
  fireEvent.click(view.start)
  await screen.findByText(messages.decodeError)
  expect(workers).toHaveLength(0)

  fireEvent.click(view.start)
  await waitFor(() => expect(workers).toHaveLength(1))
  workers[0]!.emit({ type: "error", stage: "modelError" })
  await screen.findByText(messages.modelError)

  fireEvent.click(view.start)
  await waitFor(() => expect(workers).toHaveLength(2))
  workers[1]!.emit({ type: "done", segments: [] })
  await screen.findByText(messages.noSpeech)
  expect(screen.getByText(file.name)).toBeDefined()
  expect(view.start.disabled).toBe(false)
})

it("downmixes stereo audio before handing samples to the worker", async () => {
  const view = renderTool()
  const mono = new Float32Array([0.01, 0.25])
  decodeAudioData.mockResolvedValueOnce({
    numberOfChannels: 2,
    length: mono.length,
  })
  startRendering.mockResolvedValueOnce({ getChannelData: () => mono })
  choose(view.input)
  fireEvent.click(view.start)
  await waitFor(() => expect(workers).toHaveLength(1))
  expect(connect).toHaveBeenCalledOnce()
  expect(begin).toHaveBeenCalledOnce()
  expect(workers[0]?.postMessage).toHaveBeenCalledWith(
    expect.objectContaining({ audio: mono }),
    [mono.buffer]
  )
})

it("cancels decoding without starting a worker or losing an existing transcript", async () => {
  const view = renderTool()
  choose(view.input)
  fireEvent.click(view.start)
  await waitFor(() => expect(workers).toHaveLength(1))
  workers[0]!.emit({ type: "done", segments })
  let completeDecode!: (value: unknown) => void
  decodeAudioData.mockReturnValueOnce(
    new Promise((resolve) => {
      completeDecode = resolve
    })
  )
  fireEvent.click(view.start)
  await waitFor(() => expect(decodeAudioData).toHaveBeenCalledTimes(2))
  fireEvent.click(screen.getByRole("button", { name: messages.cancel }))
  await act(async () =>
    completeDecode({
      numberOfChannels: 1,
      getChannelData: () => decoded,
    })
  )
  expect(workers).toHaveLength(1)
  expect(screen.getByRole<HTMLTextAreaElement>("textbox").value).toBe(
    "Team update"
  )
  expect(view.start.disabled).toBe(false)
})
