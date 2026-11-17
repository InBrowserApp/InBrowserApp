import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { unzipSync, strFromU8 } from "fflate"
import Client from "./client"
import { convertBatch, batchZip } from "./batch"
import m from "./messages/en.json"

const srt = "1\n00:00:01,000 --> 00:00:02,000\nHello\n"
const options = { source: "auto", target: "vtt", fps: 25, offset: 0 } as const

beforeEach(() => {
  vi.stubGlobal("URL", {
    createObjectURL: vi.fn(() => "blob:subtitles"),
    revokeObjectURL: vi.fn(),
  })
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
  })
})
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

function paste(text = srt) {
  fireEvent.change(screen.getByRole("textbox", { name: m.input }), {
    target: { value: text },
  })
}
function selectOption(label: string | RegExp, option: string | RegExp) {
  fireEvent.keyDown(screen.getByRole("combobox", { name: label }), {
    key: "ArrowDown",
  })
  fireEvent.click(screen.getByRole("option", { name: option }))
}

async function convert() {
  fireEvent.click(screen.getByRole("button", { name: m.convert }))
  await screen.findByRole("status")
  await screen.findByRole("link", { name: m.download })
}

describe("subtitle conversion interface", () => {
  it("converts pasted text, previews, copies and downloads a file, clears stale results", async () => {
    render(<Client messages={m} />)
    expect(
      (screen.getByRole("button", { name: m.convert }) as HTMLButtonElement)
        .disabled
    ).toBe(true)
    expect(screen.getByText(m.emptyOutput)).toBeTruthy()
    expect(screen.getAllByRole("button", { name: m.open })).toHaveLength(1)
    paste()
    await convert()
    expect(screen.getByRole("cell", { name: "Hello" })).toBeTruthy()
    expect(
      screen.getByRole("link", { name: m.download }).getAttribute("download")
    ).toBe("subtitles.vtt")
    fireEvent.click(screen.getByRole("button", { name: m.code }))
    expect(
      (screen.getByRole("textbox", { name: m.code }) as HTMLTextAreaElement)
        .value
    ).toContain("WEBVTT")
    fireEvent.click(screen.getByRole("button", { name: m.copy }))
    await screen.findByText(m.copied)
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining("00:00:01.000 --> 00:00:02.000")
    )
    fireEvent.click(screen.getByRole("button", { name: m.preview }))
    selectOption(m.target, "SubRip · SRT")
    expect(screen.getByText(m.emptyOutput)).toBeTruthy()
    await convert()
    expect(
      screen.getByRole("link", { name: m.download }).getAttribute("download")
    ).toBe("subtitles.srt")
    fireEvent.click(screen.getByRole("button", { name: m.clear }))
    expect(
      (screen.getByRole("textbox", { name: m.input }) as HTMLTextAreaElement)
        .value
    ).toBe("")
  })

  it("loads an example, exposes format help, changes settings and reports invalid input", async () => {
    render(<Client messages={m} />)
    fireEvent.click(screen.getByRole("button", { name: m.example }))
    expect(
      (screen.getByRole("textbox", { name: m.input }) as HTMLTextAreaElement)
        .value
    ).toContain("你好")
    fireEvent.click(screen.getByText(m.options))
    expect(
      screen
        .getByRole("spinbutton", { name: m.fps })
        .getAttribute("aria-describedby")
    ).toBeTruthy()
    expect(
      screen
        .getByRole("combobox", { name: m.encoding })
        .getAttribute("aria-describedby")
    ).toBeTruthy()
    selectOption(m.source, "SubRip · SRT")
    selectOption(m.encoding, "GB18030")
    fireEvent.change(
      screen.getByRole("spinbutton", { name: new RegExp("Frame rate") }),
      { target: { value: "30" } }
    )
    fireEvent.change(
      screen.getByRole("spinbutton", { name: new RegExp("Time offset") }),
      { target: { value: "500" } }
    )
    await convert()
    expect(screen.getByRole("cell", { name: "00:00:01.750" })).toBeTruthy()
    fireEvent.change(
      screen.getByRole("spinbutton", { name: new RegExp("Frame rate") }),
      { target: { value: "" } }
    )
    fireEvent.change(
      screen.getByRole("spinbutton", { name: new RegExp("Time offset") }),
      { target: { value: "" } }
    )
    fireEvent.click(screen.getByRole("button", { name: m.convert }))
    expect((await screen.findByRole("alert")).textContent).toBe(
      m.invalidOptions
    )
    fireEvent.change(
      screen.getByRole("spinbutton", { name: new RegExp("Frame rate") }),
      { target: { value: "25" } }
    )
    fireEvent.change(
      screen.getByRole("spinbutton", { name: new RegExp("Time offset") }),
      { target: { value: "0" } }
    )
    paste("broken")
    fireEvent.click(screen.getByRole("button", { name: m.convert }))
    expect((await screen.findByRole("alert")).textContent).toBe(m.invalid)
    fireEvent.click(screen.getByText(m.formats))
    expect(screen.getByText(m.bitmapHint)).toBeTruthy()
  })

  it("accepts multiple files and drops, removes files, downloads a ZIP and selects results", async () => {
    render(<Client messages={m} />)
    const fileInput = screen.getByLabelText(m.open)
    fireEvent.click(screen.getByRole("button", { name: m.open }))
    fireEvent.change(fileInput, {
      target: {
        files: [
          new File([srt], "one.srt"),
          new File([srt], "two.srt"),
          new File(["bad"], "bad.srt"),
        ],
      },
    })
    expect(screen.getAllByRole("listitem")).toHaveLength(3)
    await convert()
    expect(
      screen.getByRole("link", { name: m.downloadAll }).getAttribute("download")
    ).toBe("subtitles.zip")
    expect(screen.getByRole("alert").textContent).toContain("bad.vtt")
    selectOption(m.output, "two.vtt")
    expect(
      screen.getByRole("link", { name: m.download }).getAttribute("download")
    ).toBe("two.vtt")
    selectOption(m.output, /^bad.vtt/)
    expect(screen.getByRole("alert").textContent).toBe(m.unsupported)
    fireEvent.click(
      screen.getByRole("button", { name: `${m.remove}: bad.srt` })
    )
    expect(screen.getAllByRole("listitem")).toHaveLength(2)
    const card = screen.getByText(m.inputHint).closest('[data-slot="card"]')!
    fireEvent.dragOver(card, { dataTransfer: { dropEffect: "none" } })
    fireEvent.drop(card, {
      dataTransfer: { files: [new File([srt], "drop.srt")] },
    })
    expect(screen.getAllByRole("listitem")).toHaveLength(1)
    await convert()
    expect(
      screen.getByRole("link", { name: m.download }).getAttribute("download")
    ).toBe("drop.vtt")
    fireEvent.click(screen.getByRole("button", { name: m.clear }))
    fireEvent.change(fileInput, { target: { files: [] } })
    fireEvent.drop(card, { dataTransfer: { files: [] } })
    expect(screen.queryByRole("listitem")).toBeNull()
  })

  it("limits the table preview while keeping the complete output", async () => {
    render(<Client messages={m} />)
    paste(
      Array.from(
        { length: 101 },
        (_, index) =>
          `${index + 1}\n00:00:01,000 --> 00:00:02,000\nCue ${index + 1}`
      ).join("\n\n")
    )
    await convert()
    expect(screen.getAllByRole("row")).toHaveLength(101)
    expect(screen.getByText(m.previewLimit)).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: m.code }))
    expect(screen.queryByText(m.previewLimit)).toBeNull()
    expect(
      (screen.getByRole("textbox", { name: m.code }) as HTMLTextAreaElement)
        .value
    ).toContain("Cue 101")
  })

  it("previews exported precision and displays TXT without a timestamp table", async () => {
    render(<Client messages={m} />)
    paste("1\n00:00:01,250 --> 00:00:03,500\nOne\nTwo")
    selectOption(m.target, "MPL2 · MPL")
    await convert()
    expect(screen.getByRole("cell", { name: "00:00:01.300" })).toBeTruthy()
    expect(screen.getByText("subtitles.mpl")).toBeTruthy()
    selectOption(m.target, `${m.text} · TXT`)
    await convert()
    expect(screen.queryByRole("table")).toBeNull()
    expect(
      (screen.getByRole("textbox", { name: m.code }) as HTMLTextAreaElement)
        .value
    ).toBe("One\nTwo\n")
    expect(screen.getByText(m.transcriptNote)).toBeTruthy()
  })
})

describe("batch files", () => {
  it("reports per-file decoding and reading errors, avoids duplicate ZIP paths", async () => {
    const unreadable = new File([srt], "unreadable.srt")
    vi.spyOn(unreadable, "arrayBuffer").mockRejectedValue(
      new Error("read failed")
    )
    const results = await convertBatch(
      [
        new File([srt], "test.srt"),
        new File([srt], "TEST.srt"),
        new File([srt], "test.srt"),
        new File([new Uint8Array([255])], "encoding.srt"),
        unreadable,
      ],
      "",
      "auto",
      options
    )
    expect(results.map((result) => result.name)).toEqual([
      "test.vtt",
      "TEST (2).vtt",
      "test (3).vtt",
      "encoding.vtt",
      "unreadable.vtt",
    ])
    expect(results[3]!.error).toBe("encodingError")
    expect(results[4]!.error).toBe("readError")
    const zip = unzipSync(new Uint8Array(await batchZip(results).arrayBuffer()))
    expect(Object.keys(zip)).toHaveLength(3)
    expect(strFromU8(zip["test.vtt"]!)).toContain("WEBVTT")
    expect((await convertBatch([], "", "auto", options))[0]!.error).toBe(
      "empty"
    )
  })
})
