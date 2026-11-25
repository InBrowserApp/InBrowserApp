import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { writeMidi } from "midi-file"
import { afterEach, describe, expect, it, vi } from "vitest"
import { downloadBlob } from "@workspace/ui/lib/download-blob"
import MidiToMusicXml from "./client"
import messages from "./messages/en.json"

vi.mock("@workspace/ui/lib/download-blob", () => ({ downloadBlob: vi.fn() }))

const clip = Uint8Array.from(
  writeMidi({
    header: { format: 0, numTracks: 1, ticksPerBeat: 480 },
    tracks: [
      [
        {
          type: "noteOn",
          deltaTime: 70,
          channel: 0,
          noteNumber: 60,
          velocity: 75,
        },
        {
          type: "noteOff",
          deltaTime: 100,
          channel: 0,
          noteNumber: 60,
          velocity: 0,
        },
        { type: "endOfTrack", deltaTime: 0 },
      ],
    ],
  })
)
function select(file: File) {
  fireEvent.change(document.querySelector("input[type=file]")!, {
    target: { files: [file] },
  })
}
function submit() {
  fireEvent.submit(
    screen.getByRole("button", { name: messages.download }).closest("form")!
  )
}

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe("MIDI to MusicXML tool", () => {
  it("downloads a score using the selected quantization grid", async () => {
    render(<MidiToMusicXml messages={messages} />)
    const download = screen.getByRole<HTMLButtonElement>("button", {
      name: messages.download,
    })
    expect(download.disabled).toBe(true)
    submit()
    expect(downloadBlob).not.toHaveBeenCalled()
    select(new File([clip], "Practice.MIDI"))
    fireEvent.change(screen.getByLabelText(messages.quantization), {
      target: { value: "8" },
    })
    submit()
    await waitFor(() => expect(downloadBlob).toHaveBeenCalledOnce())
    const [blob, name] = vi.mocked(downloadBlob).mock.calls[0]!
    expect(name).toBe("Practice.musicxml")
    expect(await blob.text()).toContain("<duration>8</duration>")
  })

  it("shows errors, retains the grid, and retries with a different file", async () => {
    render(<MidiToMusicXml messages={messages} />)
    select(new File(["broken"], "broken.mid"))
    fireEvent.change(screen.getByLabelText(messages.quantization), {
      target: { value: "32" },
    })
    submit()
    expect((await screen.findByRole("alert")).textContent).toBe(
      messages.invalidMidi
    )
    const unreadable = new File([clip], "unreadable.mid")
    vi.spyOn(unreadable, "arrayBuffer").mockRejectedValue(
      new Error("read failed")
    )
    select(unreadable)
    submit()
    expect((await screen.findByRole("alert")).textContent).toBe(
      messages.invalidMidi
    )
    select(new File([clip], "ready.mid"))
    expect(screen.queryByRole("alert")).toBeNull()
    expect(
      screen.getByLabelText<HTMLSelectElement>(messages.quantization).value
    ).toBe("32")
    submit()
    await waitFor(() => expect(downloadBlob).toHaveBeenCalledOnce())
  })
})
