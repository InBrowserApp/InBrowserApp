import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import Client from "./client"
import { useAnalysis } from "./use-analysis"
import m from "./messages/en.json"
import type { Reply } from "./types"

const workers: FakeWorker[] = []
let constructorFails = false
let postFails = false
class FakeWorker {
  onmessage: ((event: { data: Reply }) => void) | null = null
  onerror: (() => void) | null = null
  onmessageerror: (() => void) | null = null
  terminate = vi.fn()
  postMessage = vi.fn(() => {
    if (postFails) throw new Error("post failed")
  })
  constructor() {
    if (constructorFails) throw new Error("worker unavailable")
    workers.push(this)
  }
}
const result: Reply = {
  result: {
    media: {
      "@ref": "",
      track: [
        { "@type": "General", Format: "MPEG-4", Duration: 1.5 },
        {
          "@type": "Video",
          Format: "AVC",
          CodecID: "avc1",
          Width: 1920,
          Height: 1080,
        },
        { "@type": "Audio", Format: "AAC", Channels: 2, SamplingRate: 48000 },
      ],
    },
  },
}
const file = new File(["media"], "clip.mp4")
const other = new File(["audio"], "song.flac")
const clipboard = vi.fn(async () => {})
const createUrl = vi.fn(() => "blob:metadata")
const revokeUrl = vi.fn()
beforeEach(() => {
  workers.length = 0
  constructorFails = false
  postFails = false
  vi.stubGlobal("Worker", FakeWorker)
  vi.stubGlobal("navigator", {
    ...navigator,
    clipboard: { writeText: clipboard },
  })
  vi.spyOn(URL, "createObjectURL").mockImplementation(createUrl)
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(revokeUrl)
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})
function choose(selected = file) {
  fireEvent.change(screen.getByLabelText(m.chooseFile), {
    target: { files: [selected] },
  })
}
function complete(index = 0, data = result) {
  act(() => workers[index]!.onmessage?.({ data }))
}

describe("media viewer", () => {
  it("opens the picker, analyzes once, displays track data and exports a report", async () => {
    const { container, unmount } = render(<Client messages={m} language="en" />)
    const picker = screen.getByLabelText(m.chooseFile)
    const click = vi.spyOn(picker, "click")
    fireEvent.click(
      screen.getByRole("button", { name: new RegExp(m.chooseFile) })
    )
    expect(click).toHaveBeenCalledOnce()
    choose()
    expect(screen.getByText(m.reading)).toBeTruthy()
    expect(workers[0]!.postMessage).toHaveBeenCalledWith(file)
    expect((picker as HTMLInputElement).value).toBe("")
    complete()
    expect(screen.queryByText(m.reading)).toBeNull()
    expect(screen.getByRole("heading", { name: "Audio 1" })).toBeTruthy()
    expect(screen.getAllByText("1920 × 1080")).toHaveLength(2)
    expect(screen.getByText("48 kHz")).toBeTruthy()
    expect(screen.getByText("avc1").closest("details")?.open).toBe(false)
    expect(screen.getByText("AVC").closest("details")).toBeNull()
    expect(
      screen.getByRole("link", { name: "Audio: 1" }).getAttribute("href")
    ).toBe("#media-audio-1")
    expect(container.querySelector("#media-audio-1 h2")?.textContent).toBe(
      "Audio 1"
    )
    expect(screen.queryByRole("link", { name: "Subtitles: 0" })).toBeNull()
    fireEvent.click(screen.getByRole("button", { name: m.copyReport }))
    await act(async () => {})
    expect(clipboard).toHaveBeenCalledWith(
      expect.stringContaining("Codec: AVC")
    )
    const download = screen.getByRole("link", { name: m.downloadJson })
    expect(download.getAttribute("download")).toBe("clip.mp4.mediainfo.json")
    expect(download.getAttribute("href")).toBe("blob:metadata")
    expect(container.querySelector("details pre")?.textContent).toContain(
      '"name": "clip.mp4"'
    )
    fireEvent.click(screen.getByRole("button", { name: m.changeFile }))
    expect(click).toHaveBeenCalledTimes(2)
    unmount()
    expect(revokeUrl).toHaveBeenCalledWith("blob:metadata")
    expect(workers[0]!.terminate).toHaveBeenCalled()
  })
  it("cancels old analysis on replacement/remove and ignores stale replies", () => {
    render(<Client messages={m} language="en" />)
    choose()
    choose(other)
    expect(workers[0]!.terminate).toHaveBeenCalledOnce()
    complete(0)
    expect(screen.queryByRole("heading", { name: "Video 1" })).toBeNull()
    complete(1, { error: "parseError" })
    expect(screen.getByRole("alert").textContent).toContain(m.parseError)
    fireEvent.click(screen.getByRole("button", { name: m.removeFile }))
    expect(screen.queryByRole("alert")).toBeNull()
    expect(
      screen.getByRole("button", { name: new RegExp(m.chooseFile) })
    ).toBeTruthy()
    expect(workers[1]!.terminate).toHaveBeenCalled()
  })
  it("handles nested drag/drop and cancelled file pickers", () => {
    const { container } = render(<Client messages={m} language="en" />)
    fireEvent.change(screen.getByLabelText(m.chooseFile), {
      target: { files: [] },
    })
    expect(workers).toHaveLength(0)
    const dropzone = container.querySelector(".border-dashed")!
    const dataTransfer = { files: [file], dropEffect: "none" }
    fireEvent.dragEnter(dropzone)
    fireEvent.dragEnter(dropzone)
    fireEvent.dragOver(dropzone, { dataTransfer })
    fireEvent.dragLeave(dropzone)
    expect(dropzone.className).toContain("border-foreground")
    fireEvent.dragLeave(dropzone)
    expect(dropzone.className).not.toContain("border-foreground")
    fireEvent.drop(dropzone, { dataTransfer: { files: [] } })
    expect(workers).toHaveLength(0)
    fireEvent.drop(dropzone, { dataTransfer })
    expect(workers).toHaveLength(1)
    expect(screen.getByText(file.name)).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: m.removeFile }))
    expect(workers[0]!.terminate).toHaveBeenCalledOnce()
  })
  it("reports empty files without starting the parser", () => {
    render(<Client messages={m} language="en" />)
    choose(new File([], "empty.mp4"))
    expect(workers).toHaveLength(0)
    expect(screen.getByRole("alert").textContent).toContain(m.emptyFile)
  })
  it("reports worker startup failures and lets the user retry", () => {
    constructorFails = true
    render(<Client messages={m} language="en" />)
    choose()
    expect(screen.getByRole("alert").textContent).toContain(m.loadError)
    constructorFails = false
    choose(other)
    expect(workers).toHaveLength(1)
    complete(0, { result: {} })
    expect(screen.queryByRole("alert")).toBeNull()
    expect(screen.getAllByText(m.notAvailable)).toHaveLength(4)
  })
})

describe("analysis lifecycle", () => {
  it.each(["onerror", "onmessageerror"] as const)(
    "handles %s and stops the worker",
    (event) => {
      const { result, unmount } = renderHook(() => useAnalysis(file))
      act(() => workers[0]![event]?.())
      expect(result.current).toEqual({
        busy: false,
        reply: { error: "loadError" },
      })
      expect(workers[0]!.terminate).toHaveBeenCalledOnce()
      unmount()
      act(() => workers[0]![event]?.())
      expect(workers[0]!.terminate).toHaveBeenCalledTimes(2)
    }
  )
  it("never pairs a completed result with a replacement or removed file", () => {
    const renders: { file: File | null; reply: Reply | null }[] = []
    const hook = renderHook(
      ({ selected }: { selected: File | null }) => {
        const state = useAnalysis(selected)
        renders.push({ file: selected, reply: state.reply })
        return state
      },
      { initialProps: { selected: file as File | null } }
    )
    complete()
    expect(hook.result.current.reply).toEqual(result)
    hook.rerender({ selected: other })
    expect(
      renders
        .filter((render) => render.file === other)
        .every((render) => render.reply === null)
    ).toBe(true)
    expect(hook.result.current.busy).toBe(true)
    complete(0)
    expect(hook.result.current.reply).toBeNull()
    const next: Reply = {
      result: {
        media: { "@ref": "", track: [{ "@type": "Audio", Format: "FLAC" }] },
      },
    }
    complete(1, next)
    expect(hook.result.current).toEqual({ reply: next, busy: false })
    hook.rerender({ selected: null })
    expect(
      renders
        .filter((render) => render.file === null)
        .every((render) => render.reply === null)
    ).toBe(true)
    expect(hook.result.current).toEqual({ reply: null, busy: false })
  })
  it("shows localized clipboard failure feedback and allows retry", async () => {
    render(<Client messages={m} language="en" />)
    choose()
    complete()
    clipboard.mockRejectedValueOnce(new Error("Write permission denied"))
    fireEvent.click(screen.getByRole("button", { name: m.copyReport }))
    await act(async () => {})
    expect(screen.getByRole("button", { name: m.copyFailed })).toBeTruthy()
    expect(screen.getByRole("link", { name: m.downloadJson })).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: m.copyFailed }))
    await act(async () => {})
    expect(screen.getByRole("button", { name: m.copied })).toBeTruthy()
  })
  it("cleans up a failed postMessage", () => {
    postFails = true
    const { result } = renderHook(() => useAnalysis(file))
    expect(result.current.reply).toEqual({ error: "loadError" })
    expect(workers[0]!.terminate).toHaveBeenCalledOnce()
  })
})
