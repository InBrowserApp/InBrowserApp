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
import { splitStereoFile, type SplitResult } from "./core/split"
import messages from "./messages/en.json"

vi.mock("./core/split", () => ({ splitStereoFile: vi.fn() }))

const split = vi.mocked(splitStereoFile)

function channels(): SplitResult {
  return { left: new Blob(["left"]), right: new Blob(["right"]) }
}

beforeEach(() => split.mockReset())
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
      name: messages.downloadLeft,
    })
    const right = screen.getByRole("link", { name: messages.downloadRight })
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
      name: messages.downloadLeft,
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
      const result = screen.getByRole("link", { name: messages.downloadLeft })
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
    split.mockRejectedValueOnce(new Error("Invalid audio"))
    fireEvent.change(input, { target: { files: [new File([], "bad.wav")] } })
    expect((await screen.findByRole("alert")).textContent).toBe(
      messages.readError
    )
    expect(split.mock.calls[0]?.[1].aborted).toBe(true)

    await act(async () => finishFirst(channels()))
    expect(
      screen.queryByRole("link", { name: messages.downloadLeft })
    ).toBeNull()
    expect(screen.getByRole("alert").textContent).toBe(messages.readError)
  })
})
