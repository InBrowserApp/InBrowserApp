import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { parseMidi, writeMidi } from "midi-file"
import { afterEach, describe, expect, it, vi } from "vitest"
import MidiTransposer from "./client"
import messages from "./messages/en.json"
import { downloadBlob } from "@workspace/ui/lib/download-blob"

vi.mock("@workspace/ui/lib/download-blob", () => ({ downloadBlob: vi.fn() }))

function midiFile(noteNumber = 60, name = "song.midi") {
  return new File(
    [
      Uint8Array.from(
        writeMidi({
          header: { format: 0, numTracks: 1, ticksPerBeat: 480 },
          tracks: [
            [
              {
                type: "noteOn",
                deltaTime: 0,
                noteNumber,
                channel: 0,
                velocity: 90,
              },
              {
                type: "noteOn",
                deltaTime: 0,
                noteNumber: 36,
                channel: 9,
                velocity: 90,
              },
              { type: "endOfTrack", deltaTime: 480 },
            ],
          ],
        })
      ),
    ],
    name
  )
}

function choose(file: File) {
  const input = document.querySelector("input[type=file]")!
  fireEvent.change(input, { target: { files: [file] } })
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

describe("MIDI transposer", () => {
  it("offers a file picker and downloads editable MIDI with the chosen settings", async () => {
    render(<MidiTransposer messages={messages} />)
    const button = screen.getByRole<HTMLButtonElement>("button", {
      name: messages.download,
    })
    expect(button.disabled).toBe(true)
    const input = document.querySelector<HTMLInputElement>("input[type=file]")!
    const click = vi.spyOn(input, "click").mockImplementation(() => {})
    fireEvent.click(screen.getByRole("button", { name: messages.chooseFile }))
    expect(click).toHaveBeenCalledOnce()
    submit()
    expect(downloadBlob).not.toHaveBeenCalled()
    choose(midiFile())
    expect(screen.getByText("song.midi")).toBeTruthy()
    fireEvent.change(screen.getByLabelText(messages.pitch), {
      target: { value: "2" },
    })
    fireEvent.change(screen.getByLabelText(messages.speed), {
      target: { value: "200" },
    })
    submit()
    await waitFor(() => expect(downloadBlob).toHaveBeenCalledOnce())
    const [blob, name] = vi.mocked(downloadBlob).mock.calls[0]!
    expect(name).toBe("song-edited.mid")
    const result = parseMidi(new Uint8Array(await blob.arrayBuffer()))
    expect(result.tracks[0]?.slice(0, 3)).toMatchObject([
      { type: "setTempo", microsecondsPerBeat: 250_000 },
      { type: "noteOn", noteNumber: 62 },
      { type: "noteOn", noteNumber: 36 },
    ])
  })

  it("shows a recoverable error and keeps settings when the file changes", async () => {
    render(<MidiTransposer messages={messages} />)
    choose(new File(["invalid"], "bad.mid"))
    fireEvent.change(screen.getByLabelText(messages.pitch), {
      target: { value: "12" },
    })
    submit()
    expect((await screen.findByRole("alert")).textContent).toBe(
      messages.invalidFile
    )
    choose(midiFile(127))
    expect(screen.queryByRole("alert")).toBeNull()
    submit()
    expect((await screen.findByRole("alert")).textContent).toBe(
      messages.pitchOutOfRange
    )
    fireEvent.change(screen.getByLabelText(messages.pitch), {
      target: { value: "-2" },
    })
    expect(screen.queryByRole("alert")).toBeNull()
    fireEvent.click(screen.getByRole("checkbox", { name: messages.keepDrums }))
    submit()
    await waitFor(() => expect(downloadBlob).toHaveBeenCalledOnce())
    const [blob] = vi.mocked(downloadBlob).mock.calls[0]!
    expect(
      parseMidi(new Uint8Array(await blob.arrayBuffer())).tracks[0]?.[1]
    ).toMatchObject({ noteNumber: 34 })
  })

  it("explains when reading the selected file fails", async () => {
    render(<MidiTransposer messages={messages} />)
    const file = midiFile()
    vi.spyOn(file, "arrayBuffer").mockRejectedValue(new Error("read failed"))
    choose(file)
    submit()
    expect((await screen.findByRole("alert")).textContent).toBe(
      messages.invalidFile
    )
  })
})
