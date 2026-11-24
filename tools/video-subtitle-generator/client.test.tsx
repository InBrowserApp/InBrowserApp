import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import Client from "./client"
import messages from "./messages/en.json"

const { readVideoAudio, recognize, embedSubtitles, downloadBlob } = vi.hoisted(
  () => ({
    readVideoAudio: vi.fn(),
    recognize: vi.fn(),
    embedSubtitles: vi.fn(),
    downloadBlob: vi.fn(),
  })
)
vi.mock("./media", () => ({ readVideoAudio, embedSubtitles }))
vi.mock("./recognize", () => ({ recognize }))
vi.mock("@workspace/ui/lib/download-blob", () => ({ downloadBlob }))

const video = new File(["video"], "meeting.mp4", { type: "video/mp4" })
const srt = new File(
  ["1\n00:00:00,500 --> 00:00:02,000\nHello from the meeting.\n"],
  "meeting.srt"
)

function choose(file = video) {
  fireEvent.change(screen.getByLabelText(messages.chooseVideo), {
    target: { files: [file] },
  })
}

function importSrt(file = srt) {
  fireEvent.change(screen.getByLabelText(messages.importSrt), {
    target: { files: [file] },
  })
}

function click(name: string) {
  fireEvent.click(screen.getByRole("button", { name }))
}

describe("video subtitle workspace", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:preview")
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it("keeps edited cues after an invalid import and exports them as SRT and MKV", async () => {
    embedSubtitles.mockResolvedValue(new Blob(["subtitled"]))
    render(<Client lang="en" messages={messages} />)
    choose()
    importSrt()
    const text = await screen.findByRole("textbox", {
      name: messages.subtitleText,
    })
    expect((text as HTMLTextAreaElement).value).toBe("Hello from the meeting.")
    fireEvent.change(text, { target: { value: "Edited subtitle" } })
    importSrt(new File(["bad"], "bad.srt"))
    expect((await screen.findByRole("alert")).textContent).toBe(
      messages.invalidSrt
    )
    expect((text as HTMLTextAreaElement).value).toBe("Edited subtitle")

    click(messages.downloadSrt)
    const [blob, name] = downloadBlob.mock.calls[0]!
    expect(name).toBe("meeting.srt")
    expect(await blob.text()).toContain("Edited subtitle")
    fireEvent.change(screen.getByLabelText(messages.exportFormat), {
      target: { value: "mkv" },
    })
    click(messages.exportVideo)
    await waitFor(() =>
      expect(embedSubtitles).toHaveBeenCalledWith(
        video,
        expect.stringContaining("Edited subtitle"),
        "mkv",
        expect.any(AbortSignal)
      )
    )
    await waitFor(() =>
      expect(downloadBlob).toHaveBeenLastCalledWith(
        expect.any(Blob),
        "meeting-subtitled.mkv"
      )
    )
  })

  it("cancels recognition and ignores a response arriving after cancellation", async () => {
    const audio = new Float32Array([0.1])
    readVideoAudio.mockResolvedValue(audio)
    let complete: (
      segments: Array<{ start: number; end: number; text: string }>
    ) => void
    recognize.mockImplementation(
      () =>
        new Promise((resolve) => {
          complete = resolve
        })
    )
    render(<Client lang="en" messages={messages} />)
    choose()
    fireEvent.change(screen.getByLabelText(messages.speechLanguage), {
      target: { value: "en" },
    })
    click(messages.generate)
    await waitFor(() =>
      expect(recognize).toHaveBeenCalledWith(
        audio,
        "en",
        expect.any(AbortSignal),
        expect.any(Function)
      )
    )
    click(messages.cancel)
    expect(recognize.mock.calls[0]![2].aborted).toBe(true)
    complete!([{ start: 0, end: 1000, text: "Cancelled" }])
    click(messages.addSubtitle)
    expect(
      (
        screen.getByRole("textbox", {
          name: messages.subtitleText,
        }) as HTMLTextAreaElement
      ).value
    ).toBe("")
  })
})
