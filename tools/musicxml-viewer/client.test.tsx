import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import MusicXmlViewer from "./client"
import messages from "./messages/en.json"

const { createViewer, load } = vi.hoisted(() => ({
  createViewer: vi.fn(),
  load: vi.fn(),
}))
vi.mock("opensheetmusicdisplay", () => ({
  OpenSheetMusicDisplay: class {
    Zoom = 1
    load = load
    destroy = vi.fn()
    render = vi.fn()

    constructor() {
      createViewer(this)
    }
  },
}))

function choose(file: File) {
  fireEvent.change(document.querySelector("input[type=file]")!, {
    target: { files: [file] },
  })
}
function press(label: string) {
  fireEvent.click(screen.getByRole("button", { name: label }))
}

beforeEach(() => {
  vi.resetAllMocks()
  load.mockResolvedValue({})
})
afterEach(cleanup)

describe("MusicXML viewer", () => {
  it("opens its sample, zooms the score, and clears the viewer", async () => {
    render(<MusicXmlViewer messages={messages} language="en" />)
    const input = document.querySelector<HTMLInputElement>("input[type=file]")!
    const click = vi.spyOn(input, "click").mockImplementation(() => {})
    press(messages.open)
    expect(click).toHaveBeenCalledOnce()
    press(messages.example)
    await screen.findByRole("button", { name: messages.zoomIn })
    const sample = load.mock.calls[0]?.[0] as File
    const display = createViewer.mock.calls[0]?.[0]
    expect(document.activeElement).toBe(
      screen.getByRole("region", { name: messages.preview })
    )
    expect(sample.name).toBe("Morning Steps.musicxml")
    expect(await sample.text()).toContain("<score-partwise")
    expect(display.render).toHaveBeenCalledOnce()
    press(messages.zoomIn)
    expect(
      screen.getByRole("button", { name: `${messages.resetZoom} (120%)` })
        .textContent
    ).toBe("120%")
    expect(display.Zoom).toBe(1.2)
    press(`${messages.resetZoom} (120%)`)
    expect(display.Zoom).toBe(1)
    press(messages.zoomOut)
    press(messages.zoomOut)
    expect(
      screen.getByRole<HTMLButtonElement>("button", { name: messages.zoomOut })
        .disabled
    ).toBe(true)
    press(messages.clear)
    expect(display.destroy).toHaveBeenCalledOnce()
    expect(screen.getByRole("button", { name: messages.example })).toBeTruthy()
  })

  it("recovers from an invalid result without replacing the selected file automatically", async () => {
    load.mockRejectedValueOnce(new Error("invalid score"))
    render(<MusicXmlViewer messages={messages} language="en" />)
    choose(new File(["invalid"], "bad.xml"))
    expect((await screen.findByRole("alert")).textContent).toBe(
      messages.invalidScore
    )
    expect(screen.getByText("bad.xml")).toBeTruthy()
    choose(new File(["score"], "score.mxl"))
    await screen.findByRole("button", { name: messages.zoomIn })
    expect(screen.queryByRole("alert")).toBeNull()
  })

  it("ignores an earlier load after the file has been replaced", async () => {
    let finish!: () => void
    load.mockReturnValueOnce(new Promise<void>((resolve) => (finish = resolve)))
    const app = render(<MusicXmlViewer messages={messages} language="en" />)
    choose(new File(["first"], "first.mxl"))
    await waitFor(() => expect(load).toHaveBeenCalledOnce())
    expect(screen.getByRole("status").textContent).toBe(messages.loading)
    choose(new File(["second"], "second.mxl"))
    await screen.findByRole("button", { name: messages.zoomIn })
    const [first, second] = createViewer.mock.calls.map(([display]) => display)
    await act(async () => finish())
    expect(first.render).not.toHaveBeenCalled()
    expect(first.destroy).toHaveBeenCalledOnce()
    expect(second.render).toHaveBeenCalledOnce()
    app.unmount()
    expect(second.destroy).toHaveBeenCalledOnce()
  })
})
