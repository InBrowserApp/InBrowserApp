import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import AbcNotationPreviewer from "./client"
import messages from "./messages/en.json"

const { renderAbc } = vi.hoisted(() => ({ renderAbc: vi.fn() }))
vi.mock("abcjs", () => ({
  renderAbc,
  TuneBook: class {
    tunes: { abc: string; id: string }[]
    constructor(text: string) {
      this.tunes = text
        .split(/\n(?=X:)/)
        .map((abc, index) => ({ abc, id: String(index + 1) }))
    }
  },
}))

let resize: (width: number) => void
const disconnect = vi.fn()
class TestResizeObserver {
  constructor(notify: (entries: { contentRect: { width: number } }[]) => void) {
    resize = (width) => notify([{ contentRect: { width } }])
  }
  observe() {}
  disconnect = disconnect
}

function textbox() {
  return screen.getByRole<HTMLTextAreaElement>("textbox", {
    name: messages.source,
  })
}
function edit(value: string) {
  fireEvent.change(textbox(), { target: { value } })
}
function pick(file: File) {
  fireEvent.change(document.querySelector("input[type=file]")!, {
    target: { files: [file] },
  })
}

beforeEach(() => {
  vi.stubGlobal("ResizeObserver", TestResizeObserver)
  renderAbc.mockReset()
  renderAbc.mockImplementation((target: HTMLElement, source: string) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.textContent = source
    target.append(svg)
    return [{ lines: [{ staff: [{ voices: [[{ el_type: "note" }]] }] }] }]
  })
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  vi.unstubAllGlobals()
})

describe("ABC notation previewer", () => {
  it("loads a sample, updates the score, and clears the output with the input", async () => {
    const app = render(<AbcNotationPreviewer messages={messages} />)
    expect(screen.getByRole("status").textContent).toBe(messages.empty)
    fireEvent.click(screen.getByRole("button", { name: messages.example }))
    expect(textbox().value).toContain("T:Morning Path")
    expect(screen.queryByRole("button", { name: messages.example })).toBeNull()
    expect(screen.getByRole("status").textContent).toBe(messages.loading)
    const score = screen.getByRole("region", { name: messages.preview })
    await waitFor(() => expect(score.querySelector("svg")).toBeTruthy())
    edit("X:1\nT:New title\nK:D\nDEFG|")
    await waitFor(() => expect(score.textContent).toContain("New title"))
    edit("  ")
    expect(score.querySelector("svg")).toBeNull()
    expect(screen.getByRole("status").textContent).toBe(messages.empty)
    app.unmount()
    expect(disconnect).toHaveBeenCalledOnce()
  })

  it("renders a tune book and adapts to a narrow score area", async () => {
    render(<AbcNotationPreviewer messages={messages} />)
    const input = document.querySelector<HTMLInputElement>("input[type=file]")!
    const click = vi.spyOn(input, "click").mockImplementation(() => {})
    fireEvent.click(screen.getByRole("button", { name: messages.open }))
    expect(click).toHaveBeenCalledOnce()
    const tunes = "X:1\nT:First\nK:C\nCD|\nX:2\nT:Second\nK:D\nEF|"
    pick(new File([tunes], "collection.abc"))
    const score = screen.getByRole("region", { name: messages.preview })
    await waitFor(() => expect(score.querySelectorAll("svg")).toHaveLength(2))
    expect(textbox().value).toBe(tunes)
    act(() => resize(300))
    await waitFor(() =>
      expect(renderAbc.mock.calls.at(-1)?.[2].staffwidth).toBe(280)
    )
    expect(score.querySelectorAll("svg")).toHaveLength(2)
  })

  it("shows diagnostics as text when the parser cannot find notes and recovers", async () => {
    renderAbc.mockReturnValueOnce([
      {
        lines: [],
        warnings: ['Line 1: <span style="color:red">&lt;&gt;&amp;</span>'],
      },
    ])
    render(<AbcNotationPreviewer messages={messages} />)
    edit("X:1\nK:C")
    await screen.findByText(messages.noNotes)
    expect(screen.getByText(messages.warnings)).toBeTruthy()
    expect(screen.getByText("Line 1: <>&").querySelector("span")).toBeNull()
    renderAbc.mockImplementationOnce(() => {
      throw new Error("render failed")
    })
    edit("X:1\nK:C\n??")
    expect((await screen.findByRole("alert")).textContent).toBe(
      messages.invalid
    )
    edit("X:1\nK:C\nCDEF|")
    await waitFor(() => expect(screen.queryByRole("alert")).toBeNull())
  })

  it("identifies which tune produced a warning in a book", async () => {
    renderAbc.mockReturnValue([
      {
        lines: [{ staff: [{ voices: [[{ el_type: "note" }]] }] }],
        warnings: ["Music Line:4:3: Unknown character"],
      },
    ])
    render(<AbcNotationPreviewer messages={messages} />)
    edit("X:1\nK:C\nCD@|\nX:2\nK:D\nEF@|")
    expect(
      (
        await screen.findByText("X:1 · Music Line:4:3: Unknown character")
      ).getAttribute("lang")
    ).toBe("en")
    expect(
      screen.getByText("X:2 · Music Line:4:3: Unknown character")
    ).toBeTruthy()
  })

  it("keeps editor text after a file-read error or a stale import", async () => {
    render(<AbcNotationPreviewer messages={messages} />)
    edit("K:D\nD2")
    const unreadable = new File([], "unreadable.abc")
    vi.spyOn(unreadable, "text").mockRejectedValueOnce(new Error("read failed"))
    pick(unreadable)
    expect((await screen.findByRole("alert")).textContent).toBe(
      messages.fileError
    )
    expect(textbox().value).toBe("K:D\nD2")
    const delayed = new File([], "slow.abc")
    let finish!: (value: string) => void
    vi.spyOn(delayed, "text").mockReturnValueOnce(
      new Promise((resolve) => (finish = resolve))
    )
    pick(delayed)
    edit("K:E\nE2")
    await act(async () => finish("K:F\nF2"))
    expect(textbox().value).toBe("K:E\nE2")
    expect(screen.queryByRole("alert")).toBeNull()
  })
})
