import {
  act,
  cleanup,
  createEvent,
  fireEvent,
  render,
  screen,
} from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import Client from "./client"
import { openVideo, readAudioTracks, type Track } from "./extract"
import messages from "./messages/en.json"

vi.mock("./extract", () => ({
  openVideo: vi.fn(),
  readAudioTracks: vi.fn(),
}))

const clip = new File(["sample"], "holiday.mp4")
const otherClip = new File(["sample"], "other.webm")
const dispose = vi.fn()
const blob = new Blob(["audio"], { type: "audio/mp4" })
const tracks: Track[] = [
  { number: 1, codec: "ac3", language: "und", name: null },
  {
    number: 2,
    codec: "aac",
    language: "spa",
    name: "Commentary",
    output: { extension: "m4a", extract: async () => blob },
  },
  {
    number: 3,
    codec: "aac",
    language: "eng",
    name: null,
    output: { extension: "m4a", extract: async () => blob },
  },
]

function setup() {
  vi.mocked(openVideo, { partial: true }).mockReturnValue({ dispose })
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:track")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
  const { container } = render(<Client messages={messages} language="en" />)
  const input = container.querySelector<HTMLInputElement>('input[type="file"]')!
  const choose = (file: File) =>
    fireEvent.change(input, { target: { files: [file] } })
  return { input, choose }
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.resetAllMocks()
})

describe("video audio extractor", () => {
  it("prepares a supported track and replaces the preview and download when switching", async () => {
    vi.mocked(readAudioTracks).mockResolvedValue(tracks)
    const { input, choose } = setup()
    const click = vi.spyOn(input, "click")
    fireEvent.click(screen.getByRole("button", { name: messages.chooseVideo }))
    expect(click).toHaveBeenCalledOnce()
    choose(clip)
    expect(screen.getByText(messages.reading)).toBeTruthy()
    const link = await screen.findByRole("link", { name: "Download M4A" })
    expect(link.getAttribute("download")).toBe("holiday-track-2.m4a")
    expect(screen.getByLabelText(messages.preview).getAttribute("src")).toBe(
      link.getAttribute("href")
    )
    expect(
      screen.getByRole("option", { name: /Spanish.*Commentary.*AAC/ })
    ).toBeTruthy()

    const select = screen.getByRole("combobox", { name: messages.audioTrack })
    fireEvent.change(select, { target: { value: "1" } })
    expect(screen.getByText(messages.unsupportedTrack)).toBeTruthy()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:track")
    expect(screen.queryByRole("link")).toBeNull()

    fireEvent.change(select, { target: { value: "3" } })
    const newLink = await screen.findByRole("link")
    expect(newLink.getAttribute("download")).toBe("holiday-track-3.m4a")
    fireEvent.error(screen.getByLabelText(messages.preview))
    expect(screen.getByText(messages.previewError)).toBeTruthy()
    expect(screen.getByRole("link")).toBe(newLink)

    fireEvent.click(screen.getByRole("button", { name: messages.changeVideo }))
    expect(click).toHaveBeenCalledTimes(2)
  })

  it("can recover from an unreadable file, a silent file, and a failed extraction", async () => {
    vi.mocked(readAudioTracks)
      .mockRejectedValueOnce(new Error("unsupported"))
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        {
          ...tracks[1]!,
          output: {
            extension: "m4a",
            extract: async () => {
              throw new Error("bad track")
            },
          },
        },
      ])
    const { choose, input } = setup()

    const dropArea = input.parentElement!
    const dataTransfer = { files: [clip], dropEffect: "none" }
    const dragOver = createEvent.dragOver(dropArea, { dataTransfer })
    fireEvent(dropArea, dragOver)
    expect(dragOver.defaultPrevented).toBe(true)
    fireEvent.drop(dropArea, { dataTransfer })
    expect(await screen.findByText(messages.readError)).toBeTruthy()

    choose(otherClip)
    expect(await screen.findByText(messages.noAudio)).toBeTruthy()
    choose(clip)
    expect(await screen.findByText(messages.exportError)).toBeTruthy()
    expect(dispose).toHaveBeenCalledTimes(2)
  })

  it("cancels unfinished extraction when replacing the file", async () => {
    let complete!: (result: Blob) => void
    const extract = vi.fn(
      (_signal: AbortSignal) =>
        new Promise<Blob>((resolve) => {
          complete = resolve
        })
    )
    vi.mocked(readAudioTracks)
      .mockResolvedValueOnce([
        { ...tracks[1]!, output: { extension: "m4a", extract } },
      ])
      .mockResolvedValueOnce([])
    const { choose } = setup()
    choose(clip)
    expect(await screen.findByText(messages.preparing)).toBeTruthy()
    choose(otherClip)
    expect(await screen.findByText(messages.noAudio)).toBeTruthy()
    expect(extract.mock.calls[0]![0].aborted).toBe(true)
    await act(async () => complete(blob))
    expect(URL.createObjectURL).not.toHaveBeenCalled()
    expect(screen.queryByRole("link")).toBeNull()
  })
})
