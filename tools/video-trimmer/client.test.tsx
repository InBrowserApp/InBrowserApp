import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import VideoTrimmer from "./client"
import { exportVideo, inspectVideo } from "./media"
import messages from "./messages/en.json"

vi.mock("./media", () => ({
  inspectVideo: vi.fn(),
  exportVideo: vi.fn(),
}))

beforeEach(() => {
  vi.spyOn(URL, "createObjectURL")
    .mockReturnValueOnce("blob:source")
    .mockReturnValue("blob:clip")
  vi.spyOn(URL, "revokeObjectURL")
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue()
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {})
})

afterEach(() => {
  cleanup()
  vi.resetAllMocks()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

async function loadVideo() {
  const file = new File(["video"], "demo.webm", { type: "video/webm" })
  vi.mocked(inspectVideo).mockResolvedValue({ format: "webm", duration: 10 })
  const { container } = render(
    <VideoTrimmer messages={messages} language="en" />
  )
  fireEvent.change(container.querySelector('input[type="file"]')!, {
    target: { files: [file] },
  })
  const video = container.querySelector("video")!
  Object.defineProperties(video, {
    videoWidth: { value: 320 },
    duration: { value: 10 },
  })
  fireEvent.loadedMetadata(video)
  await screen.findByRole("textbox", { name: messages.start })
  return { file, video }
}

describe("video trimmer", () => {
  it("previews the chosen range and downloads the export with its output extension", async () => {
    vi.mocked(exportVideo).mockResolvedValue(
      new Blob(["clip"], { type: "video/mp4" })
    )
    const { file, video } = await loadVideo()
    expect(screen.getByLabelText(messages.format)).toHaveProperty(
      "value",
      "webm"
    )
    fireEvent.change(screen.getByRole("textbox", { name: messages.start }), {
      target: { value: "1,25" },
    })
    fireEvent.change(screen.getByRole("textbox", { name: messages.end }), {
      target: { value: "٤٫٢٥" },
    })
    fireEvent.click(screen.getByRole("button", { name: messages.previewClip }))
    expect(video.currentTime).toBe(1.25)
    expect(video.play).toHaveBeenCalledOnce()
    video.currentTime = 4.3
    fireEvent.timeUpdate(video)
    expect(video.currentTime).toBe(4.25)

    fireEvent.change(screen.getByLabelText(messages.format), {
      target: { value: "mp4" },
    })
    fireEvent.click(screen.getByRole("button", { name: messages.exportClip }))
    const download = await screen.findByRole("link", {
      name: messages.downloadClip,
    })
    expect(download.getAttribute("download")).toBe("demo-trimmed.mp4")
    expect(exportVideo).toHaveBeenCalledWith(
      file,
      "mp4",
      { start: 1.25, end: 4.25 },
      expect.any(AbortSignal),
      expect.any(Function)
    )

    fireEvent.change(screen.getByRole("textbox", { name: messages.end }), {
      target: { value: "5" },
    })
    expect(
      screen.queryByRole("link", { name: messages.downloadClip })
    ).toBeNull()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:clip")
  })

  it("keeps the previous timeline through an invalid edit and lets the user cancel an export", async () => {
    vi.mocked(exportVideo).mockImplementation(
      (_file, _format, _range, signal) =>
        new Promise((_resolve, reject) => {
          signal.addEventListener("abort", () => reject(signal.reason), {
            once: true,
          })
        })
    )
    await loadVideo()
    const start = screen.getByRole("textbox", { name: messages.start })
    const end = screen.getByRole("textbox", { name: messages.end })
    fireEvent.change(start, { target: { value: "2" } })
    fireEvent.change(end, { target: { value: "1" } })
    fireEvent.blur(end)
    expect(screen.getByRole("alert").textContent).toBe(messages.rangeError)
    expect(
      screen
        .getByRole("slider", { name: messages.start })
        .getAttribute("aria-valuenow")
    ).toBe("2")
    fireEvent.click(screen.getByRole("button", { name: messages.exportClip }))
    expect(exportVideo).not.toHaveBeenCalled()

    fireEvent.change(end, { target: { value: "5" } })
    fireEvent.click(screen.getByRole("button", { name: messages.exportClip }))
    await waitFor(() => expect(exportVideo).toHaveBeenCalledOnce())
    fireEvent.click(screen.getByRole("button", { name: messages.cancel }))
    await waitFor(() =>
      expect(screen.queryByRole("button", { name: messages.cancel })).toBeNull()
    )
    expect(end).toHaveProperty("value", "5")
    expect(screen.queryByRole("alert")).toBeNull()
  })
})
