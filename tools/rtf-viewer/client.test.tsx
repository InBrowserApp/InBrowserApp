import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import type { RtfDocument, PageLayout } from "rtf-viewer"
import Client from "./client"
import m from "./messages/en.json"

const mocks = vi.hoisted(() => ({ open: vi.fn(), render: vi.fn() }))
vi.mock("./open-document", () => ({ openDocument: mocks.open }))
let model: RtfDocument
function layout(index: number): PageLayout {
  return {
    index,
    width: 600,
    height: 800,
    decorations: [],
    lines: [
      {
        x: 10,
        y: 10,
        width: 200,
        height: 20,
        paragraphIndex: 0,
        fragments: [
          {
            kind: "text",
            text: `Page ${index + 1} `,
            x: 10,
            y: 10,
            width: 80,
            height: 20,
            baseline: 25,
            font: "12px serif",
            fontSize: 12,
            color: "#000",
            highlight: null,
            underline: false,
            strike: false,
          },
          {
            kind: "text",
            text: "searchable text",
            x: 90,
            y: 10,
            width: 120,
            height: 20,
            baseline: 25,
            font: "12px serif",
            fontSize: 12,
            color: "#000",
            highlight: null,
            underline: false,
            strike: false,
          },
          {
            kind: "image",
            imageId: "image",
            x: 0,
            y: 40,
            width: 20,
            height: 20,
          },
        ],
      },
    ],
  }
}
function choose(name = "sample.rtf") {
  fireEvent.change(screen.getByLabelText(m.open), {
    target: { files: [new File(["owned"], name)] },
  })
}
async function opened() {
  choose()
  await screen.findByLabelText(m.page)
  await waitFor(() => expect(screen.queryByText(m.rendering)).toBeNull())
}
beforeEach(() => {
  vi.clearAllMocks()
  mocks.open.mockReset()
  mocks.render.mockReset().mockResolvedValue(undefined)
  model = {
    pageCount: 3,
    diagnostics: [],
    getPageSize: () => ({ width: 600, height: 800 }),
    getPageLayout: layout,
    renderPage: mocks.render,
    destroy: vi.fn(),
  } as unknown as RtfDocument
  mocks.open.mockResolvedValue(model)
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(632)
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(432)
  vi.spyOn(HTMLElement.prototype, "scrollTo").mockImplementation(() => {})
  vi.spyOn(HTMLElement.prototype, "scrollIntoView").mockImplementation(() => {})
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    }
  )
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

test("opens selectable text, navigates by page and keyboard, fits, zooms and closes", async () => {
  render(<Client messages={m} />)
  expect(screen.getByText(m.drop)).toBeTruthy()
  await opened()
  expect(screen.getByText("searchable text")).toBeTruthy()
  expect(screen.getByRole("img", { name: m.image })).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: m.next }))
  await screen.findByLabelText("Page 2")
  fireEvent.click(screen.getByRole("button", { name: m.previous }))
  await screen.findByLabelText("Page 1")
  const region = screen.getByRole("region", { name: m.reader })
  fireEvent.keyDown(region, { key: "PageDown" })
  await screen.findByLabelText("Page 2")
  fireEvent.keyDown(region, { key: "PageUp" })
  fireEvent.keyDown(region, { key: "End", ctrlKey: true })
  await screen.findByLabelText("Page 3")
  fireEvent.keyDown(region, { key: "Home", ctrlKey: true })
  fireEvent.keyDown(region, { key: "ArrowDown" })
  await screen.findByLabelText("Page 1")
  fireEvent.change(screen.getByLabelText(m.page), { target: { value: "3" } })
  fireEvent.keyDown(screen.getByLabelText(m.page), { key: "Enter" })
  await screen.findByLabelText("Page 3")
  fireEvent.click(screen.getByRole("button", { name: m.zoomIn }))
  fireEvent.click(screen.getByRole("button", { name: m.zoomOut }))
  fireEvent.click(screen.getByRole("button", { name: m.fit }))
  expect((screen.getByLabelText(m.zoom) as HTMLInputElement).value).toBe("75")
  fireEvent.click(screen.getByRole("button", { name: m.fitPage }))
  expect((screen.getByLabelText(m.zoom) as HTMLInputElement).value).toBe("37")
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  expect(screen.getByText(m.drop)).toBeTruthy()
  expect(model.destroy).toHaveBeenCalledOnce()
})

test("searches across pages, highlights ranges across fragments and wraps matches", async () => {
  render(<Client messages={m} />)
  await opened()
  fireEvent.click(screen.getByRole("button", { name: m.search }))
  const input = screen.getByRole("searchbox")
  fireEvent.change(input, { target: { value: "1 search" } })
  fireEvent.click(screen.getByRole("button", { name: m.find }))
  await waitFor(() =>
    expect(document.querySelectorAll("[data-match]")).toHaveLength(2)
  )
  fireEvent.change(input, { target: { value: "searchable" } })
  fireEvent.click(screen.getByRole("button", { name: m.previousMatch }))
  await screen.findByLabelText("Page 3")
  fireEvent.click(screen.getByRole("button", { name: m.nextMatch }))
  await screen.findByLabelText("Page 1")
  fireEvent.click(screen.getByRole("button", { name: m.previousMatch }))
  await screen.findByLabelText("Page 3")
  fireEvent.change(input, { target: { value: "missing" } })
  fireEvent.click(screen.getByRole("button", { name: m.find }))
  await screen.findByText(m.noMatches)
  fireEvent.click(screen.getByRole("button", { name: m.nextMatch }))
  fireEvent.change(input, { target: { value: "" } })
  await waitFor(() =>
    expect(document.querySelectorAll("[data-match]")).toHaveLength(0)
  )
  fireEvent.click(screen.getByRole("button", { name: m.closeSearch }))
})

test("reports failed searches without claiming no matches and allows retry", async () => {
  render(<Client messages={m} />)
  await opened()
  model.getPageLayout = (index) => {
    if (index === 1) throw new RangeError("array buffer allocation failed")
    return layout(index)
  }
  fireEvent.click(screen.getByRole("button", { name: m.search }))
  fireEvent.change(screen.getByRole("searchbox"), {
    target: { value: "searchable" },
  })
  fireEvent.click(screen.getByRole("button", { name: m.find }))
  expect((await screen.findByRole("alert")).textContent).toBe(m.resourceLimit)
  expect(screen.queryByText(m.noMatches)).toBeNull()
  model.getPageLayout = layout
  fireEvent.click(screen.getByRole("button", { name: m.find }))
  await waitFor(() =>
    expect(document.querySelector("[data-match]")).toBeTruthy()
  )
  expect(screen.queryByRole("alert")).toBeNull()
})

test.each([
  [new Error("empty"), m.empty],
  [new Error("out of memory"), m.resourceLimit],
  [new Error("damaged"), m.invalid],
  [null, m.invalid],
])(
  "reports load failure and recovers on replacement",
  async (error, message) => {
    mocks.open.mockRejectedValueOnce(error)
    render(<Client messages={m} />)
    choose()
    await screen.findByText(message)
    choose("replacement.rtf")
    await screen.findByLabelText(m.page)
    expect(screen.queryByText(message)).toBeNull()
  }
)

test("surfaces known omissions and page allocation errors while retaining navigation", async () => {
  Object.defineProperty(model, "diagnostics", {
    value: [
      { code: "unsupported-vector-image", offset: 0, message: "private" },
    ],
  })
  mocks.render.mockRejectedValueOnce(
    new RangeError("Output canvas exceeds 32 million pixels")
  )
  render(<Client messages={m} />)
  choose()
  await screen.findByText(m.canvasLimit)
  expect(screen.getByText(m.imageNote)).toBeTruthy()
  expect(screen.getByText(m.limited)).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: m.next }))
  await waitFor(() => expect(screen.queryByText(m.canvasLimit)).toBeNull())
})

test("reports non-canvas rendering errors and releases every canvas", async () => {
  mocks.render.mockRejectedValue("failed")
  const { unmount } = render(<Client messages={m} />)
  choose()
  await screen.findByText(m.pageError)
  const canvas = document.querySelector("canvas")!
  expect(canvas.getAttribute("width")).toBe("0")
  unmount()
  await waitFor(() => expect(canvas.getAttribute("height")).toBe("0"))
})

test("aborts and discards late opening, rejection, and drawing after replacement", async () => {
  let finish!: (value: RtfDocument) => void
  mocks.open.mockImplementationOnce(
    () =>
      new Promise<RtfDocument>((resolve) => {
        finish = resolve
      })
  )
  render(<Client messages={m} />)
  choose()
  await waitFor(() => expect(mocks.open).toHaveBeenCalled())
  const signal = mocks.open.mock.calls[0]![1] as AbortSignal
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  await act(async () => finish(model))
  expect(signal.aborted).toBe(true)
  expect(model.destroy).toHaveBeenCalled()
  let reject!: (error: Error) => void
  mocks.open.mockImplementationOnce(
    () =>
      new Promise((_, fail) => {
        reject = fail
      })
  )
  choose()
  await waitFor(() => expect(mocks.open).toHaveBeenCalledTimes(2))
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  await act(async () => reject(new Error("late")))
  expect(screen.queryByText(m.invalid)).toBeNull()
  let rendered!: () => void
  mocks.render.mockImplementationOnce(
    () =>
      new Promise<void>((resolve) => {
        rendered = resolve
      })
  )
  choose()
  await screen.findByLabelText(m.page)
  const canvas = document.querySelector("canvas")!
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  await act(async () => rendered())
  expect(canvas.getAttribute("width")).toBe("0")
})
