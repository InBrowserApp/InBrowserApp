import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import AbcNotationToPdf from "./client"
import messages from "./messages/en.json"
import type { AbcTune } from "@workspace/score-export/abc"

const { renderPages, exportScore, download } = vi.hoisted(() => ({
  renderPages: vi.fn(),
  exportScore: vi.fn(),
  download: vi.fn(),
}))
vi.mock("@workspace/score-export/abc", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@workspace/score-export/abc")>()),
  renderAbcPages: renderPages,
}))
vi.mock("@workspace/score-export", () => ({ exportScore }))
vi.mock("@workspace/ui/lib/download-blob", () => ({ downloadBlob: download }))

function paper() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  svg.setAttribute("width", "794")
  svg.setAttribute("height", "1123")
  return svg
}
function press(name: string) {
  fireEvent.click(screen.getByRole("button", { name }))
}
function input(file: File) {
  fireEvent.change(document.querySelector("input[type=file]")!, {
    target: { files: [file] },
  })
}
function titles(call: unknown[]) {
  return (call[0] as AbcTune[]).map((tune) => tune.title)
}

let pages: SVGSVGElement[]
beforeEach(() => {
  vi.resetAllMocks()
  pages = [paper()]
  renderPages.mockResolvedValue(pages)
  exportScore.mockResolvedValue({ blob: new Blob(), filename: "score.pdf" })
})
afterEach(cleanup)

async function loadExample() {
  render(<AbcNotationToPdf messages={messages} language="en" />)
  expect(screen.getByRole("status").textContent).toBe(messages.empty)
  press(messages.example)
  await screen.findByText("Page 1 of 1")
}

test("includes tunes in file order by default and prints the selected tune on Letter", async () => {
  await loadExample()
  const check = (name: string) =>
    screen.getByRole<HTMLInputElement>("checkbox", { name })
  expect(check("Morning Path").checked).toBe(true)
  expect(check("Evening Waltz").checked).toBe(true)
  expect(titles(renderPages.mock.calls[0]!)).toEqual([
    "Morning Path",
    "Evening Waltz",
  ])
  expect(renderPages.mock.calls[0]?.[1]).toBe("a4")
  press(messages.clearSelection)
  expect(screen.getByRole("status").textContent).toBe(messages.noSelection)
  expect(
    screen.getByRole<HTMLButtonElement>("button", { name: messages.download })
      .disabled
  ).toBe(true)
  fireEvent.click(check("Evening Waltz"))
  fireEvent.change(screen.getByLabelText(messages.paper), {
    target: { value: "letter" },
  })
  await screen.findByText("Page 1 of 1")
  expect(titles(renderPages.mock.lastCall!)).toEqual(["Evening Waltz"])
  expect(renderPages.mock.lastCall?.[1]).toBe("letter")
  press(messages.download)
  await waitFor(() => expect(download).toHaveBeenCalledOnce())
  expect(exportScore).toHaveBeenCalledWith(pages, "pdf", "Evening Waltz", "en")
  press(messages.selectAll)
  await waitFor(() =>
    expect(titles(renderPages.mock.lastCall!)).toEqual([
      "Morning Path",
      "Evening Waltz",
    ])
  )
})

test("keeps a selection across edits and ignores an obsolete render", async () => {
  await loadExample()
  fireEvent.click(screen.getByRole("checkbox", { name: "Morning Path" }))
  await waitFor(() =>
    expect(titles(renderPages.mock.lastCall!)).toEqual(["Evening Waltz"])
  )
  const editor = screen.getByRole<HTMLTextAreaElement>("textbox", {
    name: messages.source,
  })
  let finish!: (pages: SVGSVGElement[]) => void
  renderPages.mockReturnValueOnce(new Promise((resolve) => (finish = resolve)))
  fireEvent.change(editor, {
    target: {
      value:
        "X:3\nT:Inserted Tune\nK:C\nCDEF|\n\n" +
        editor.value.replace("Evening Waltz", "Revised Waltz"),
    },
  })
  await waitFor(() =>
    expect(titles(renderPages.mock.lastCall!)).toEqual(["Revised Waltz"])
  )
  expect(screen.getByRole("status").textContent).toBe(messages.loading)
  fireEvent.change(screen.getByLabelText(messages.paper), {
    target: { value: "letter" },
  })
  await screen.findByText("Page 1 of 1")
  await act(async () => finish([paper(), paper()]))
  expect(screen.queryByText("Page 1 of 2")).toBeNull()
  expect(
    screen.getByRole<HTMLInputElement>("checkbox", { name: "Revised Waltz" })
      .checked
  ).toBe(true)
})

test("preserves imported text after a read or PDF failure", async () => {
  render(<AbcNotationToPdf messages={messages} language="en" />)
  const source = "X:1\nT:My score\nK:D\nD2E2F2G2|"
  input(new File([source], "practice.txt"))
  await screen.findByText("Page 1 of 1")
  const bad = new File([], "bad.abc")
  vi.spyOn(bad, "text").mockRejectedValueOnce(new Error("unreadable"))
  input(bad)
  expect((await screen.findByRole("alert")).textContent).toBe(
    messages.fileError
  )
  expect(screen.getByRole<HTMLTextAreaElement>("textbox").value).toBe(source)
  exportScore.mockRejectedValueOnce(new Error("export unavailable"))
  press(messages.download)
  expect(await screen.findByText(messages.downloadError)).toBeTruthy()
  press(messages.download)
  await waitFor(() => expect(download).toHaveBeenCalledOnce())
})

test("reports a score without notes and recovers after editing", async () => {
  render(<AbcNotationToPdf messages={messages} language="en" />)
  renderPages
    .mockResolvedValueOnce([])
    .mockRejectedValueOnce(new Error("broken"))
  const editor = screen.getByRole("textbox", { name: messages.source })
  fireEvent.change(editor, { target: { value: "X:1\nK:C" } })
  await screen.findByText(messages.noNotes)
  fireEvent.change(editor, { target: { value: "X:1\nK:C\nCDEF|" } })
  expect((await screen.findByRole("alert")).textContent).toBe(messages.invalid)
  fireEvent.change(editor, { target: { value: "X:1\nK:D\nDEFG|" } })
  await screen.findByText("Page 1 of 1")
})
