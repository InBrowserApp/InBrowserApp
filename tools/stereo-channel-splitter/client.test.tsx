import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import StereoChannelSplitter from "./client"
import { splitStereoFile, type SplitResult } from "./split"
import { encodeDownloads } from "./export"
import type { ChannelFiles } from "./core/formats"
import messages from "./messages/en.json"

vi.mock("./split", () => ({ splitStereoFile: vi.fn() }))

vi.mock("./export", () => ({ encodeDownloads: vi.fn() }))

const encoded = vi.mocked(encodeDownloads)
const split = vi.mocked(splitStereoFile)

function files(): ChannelFiles {
  return { left: new Blob(["left"]), right: new Blob(["right"]) }
}

function channels(): SplitResult {
  return { files: files(), flacAvailable: true }
}

const leftWav = messages.downloadLeft.replace("{format}", "WAV")
const rightWav = messages.downloadRight.replace("{format}", "WAV")

beforeEach(() => {
  split.mockReset()
  encoded.mockReset()
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe("StereoChannelSplitter", () => {
  it("opens the file picker and exposes independent playback and download actions", async () => {
    const { container } = render(<StereoChannelSplitter messages={messages} />)
    const input =
      container.querySelector<HTMLInputElement>('input[type="file"]')!
    const open = vi.spyOn(input, "click")
    fireEvent.click(screen.getByRole("button", { name: messages.chooseFile }))
    expect(open).toHaveBeenCalledOnce()

    split.mockResolvedValueOnce(channels())
    const file = new File([], "interview.take.wav")
    fireEvent.change(input, { target: { files: [file] } })
    const left = await screen.findByRole("link", {
      name: leftWav,
    })
    const right = screen.getByRole("link", { name: rightWav })
    const leftPlayer = screen.getByLabelText(messages.left)
    const rightPlayer = screen.getByLabelText(messages.right)
    expect(left.getAttribute("download")).toBe("interview.take-left.wav")
    expect(right.getAttribute("download")).toBe("interview.take-right.wav")
    expect(left.getAttribute("href")).toBe(leftPlayer.getAttribute("src"))
    expect(right.getAttribute("href")).toBe(rightPlayer.getAttribute("src"))
    expect(left.getAttribute("href")).not.toBe(right.getAttribute("href"))
    const pause = vi.spyOn(leftPlayer as HTMLAudioElement, "pause")
    fireEvent.play(leftPlayer)
    fireEvent.play(rightPlayer)
    expect(pause).toHaveBeenCalledOnce()
  })

  it("keeps the last output when a dropped replacement fails, then swaps URLs on success", async () => {
    const revoke = vi.spyOn(URL, "revokeObjectURL")
    const { container } = render(<StereoChannelSplitter messages={messages} />)
    const picker = screen.getByRole("button", { name: messages.chooseFile })
    const drop = (file: File) =>
      fireEvent.drop(picker, { dataTransfer: { files: [file] } })
    fireEvent.dragOver(picker, { dataTransfer: { types: ["Files"] } })
    fireEvent.dragLeave(picker)

    split.mockResolvedValueOnce(channels())
    drop(new File([], "first.wav"))
    const left = await screen.findByRole("link", {
      name: leftWav,
    })
    const oldUrl = left.getAttribute("href")

    split.mockResolvedValueOnce({ error: "monoError" })
    drop(new File([], "mono.wav"))
    expect((await screen.findByRole("alert")).textContent).toBe(
      messages.monoError
    )
    expect(left.getAttribute("href")).toBe(oldUrl)
    expect(revoke).not.toHaveBeenCalled()

    split.mockResolvedValueOnce(channels())
    fireEvent.change(container.querySelector('input[type="file"]')!, {
      target: { files: [new File([], "next.wav")] },
    })
    await waitFor(() => {
      const result = screen.getByRole("link", { name: leftWav })
      expect(result.getAttribute("download")).toBe("next-left.wav")
      expect(result.getAttribute("href")).not.toBe(oldUrl)
    })
    expect(revoke).toHaveBeenCalledWith(oldUrl)
    expect(screen.queryByRole("alert")).toBeNull()
  })

  it("keeps only the latest selection when reads finish out of order", async () => {
    let finishFirst!: (result: SplitResult) => void
    split.mockReturnValueOnce(
      new Promise((resolve) => {
        finishFirst = resolve
      })
    )
    const { container } = render(<StereoChannelSplitter messages={messages} />)
    const input = container.querySelector('input[type="file"]')!
    fireEvent.change(input, { target: { files: [new File([], "slow.wav")] } })
    expect(screen.getByRole("status").textContent).toBe(messages.processing)
    await waitFor(() => expect(split).toHaveBeenCalledOnce())
    split.mockRejectedValueOnce(new Error("Invalid audio"))
    fireEvent.change(input, { target: { files: [new File([], "bad.wav")] } })
    expect((await screen.findByRole("alert")).textContent).toBe(
      messages.readError
    )
    expect(split.mock.calls[0]?.[1].aborted).toBe(true)

    await act(async () => finishFirst(channels()))
    expect(screen.queryByRole("link", { name: leftWav })).toBeNull()
    expect(screen.getByRole("alert").textContent).toBe(messages.readError)
  })

  it("keeps playback stable while changing format and retries a failed export", async () => {
    const { container } = render(<StereoChannelSplitter messages={messages} />)
    split.mockResolvedValueOnce(channels())
    fireEvent.change(container.querySelector('input[type="file"]')!, {
      target: { files: [new File([], "demo.wav")] },
    })
    const select = await screen.findByRole("combobox", {
      name: messages.formatLabel,
    })
    const wav = await screen.findByRole("link", { name: leftWav })
    const player = screen.getByLabelText(messages.left)
    const previewUrl = wav.getAttribute("href")
    let finishFlac!: (result: ChannelFiles) => void
    encoded.mockReturnValueOnce(
      new Promise((resolve) => {
        finishFlac = resolve
      })
    )
    fireEvent.change(select, { target: { value: "flac" } })
    expect(
      screen.getByText(messages.preparingDownload.replace("{format}", "FLAC"))
    ).toBeTruthy()
    expect(screen.queryByRole("link", { name: leftWav })).toBeNull()
    encoded.mockRejectedValueOnce(new Error("Encode failed"))
    fireEvent.change(select, { target: { value: "mp3" } })
    expect(
      await screen.findByText(messages.exportError.replace("{format}", "MP3"))
    ).toBeTruthy()
    await act(async () => finishFlac(files()))
    expect(
      screen.queryByRole("link", {
        name: messages.downloadLeft.replace("{format}", "FLAC"),
      })
    ).toBeNull()
    expect(encoded.mock.calls[0]?.[1].aborted).toBe(true)
    expect(player.getAttribute("src")).toBe(previewUrl)

    encoded.mockResolvedValueOnce(files())
    fireEvent.click(screen.getByRole("button", { name: messages.retry }))
    const mp3 = await screen.findByRole("link", {
      name: messages.downloadLeft.replace("{format}", "MP3"),
    })
    expect(mp3.getAttribute("download")).toBe("demo-left.mp3")
    expect(mp3.getAttribute("href")).not.toBe(previewUrl)
    fireEvent.change(select, { target: { value: "wav" } })
    expect(
      screen.getByRole("link", { name: leftWav }).getAttribute("href")
    ).toBe(previewUrl)
  })

  it("disables FLAC when it cannot preserve the source", async () => {
    const { container } = render(<StereoChannelSplitter messages={messages} />)
    split.mockResolvedValueOnce({ files: files(), flacAvailable: false })
    fireEvent.change(container.querySelector('input[type="file"]')!, {
      target: { files: [new File([], "float.wav")] },
    })
    const flac = await screen.findByRole<HTMLOptionElement>("option", {
      name: messages.flacOption,
    })
    expect(flac.disabled).toBe(true)
    expect(screen.getByText(messages.flacUnavailable)).toBeTruthy()
  })
})
