import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import type { OFDDocument, OFDPage, RenderOptions } from "@ofdjs/viewer"
import Client from "./client"
import m from "./messages/en.json"

const mocks = vi.hoisted(() => ({
  open: vi.fn(),
  render: vi.fn(),
  page: vi.fn(),
  cancel: vi.fn(),
}))
vi.mock("./open-document", () => ({ openDocument: mocks.open }))
let model: OFDDocument
let intersections: IntersectionObserverCallback
function page(number: number): OFDPage {
  return {
    pageNumber: number,
    getViewport: ({ scale = 1, rotation = 0 } = {}) => ({
      width: (rotation % 180 ? 800 : 600) * scale,
      height: (rotation % 180 ? 600 : 800) * scale,
      scale,
      rotation,
      unit: 1,
    }),
    render: mocks.render,
  } as unknown as OFDPage
}
function choose(name = "sample.ofd") {
  fireEvent.change(screen.getByLabelText(m.open), {
    target: { files: [new File(["owned"], name)] },
  })
}
async function opened() {
  choose()
  await screen.findByLabelText(m.page)
  await screen.findByRole("img", { name: "Page 1" })
}
beforeEach(() => {
  vi.clearAllMocks()
  vi.spyOn(window, "matchMedia").mockReturnValue({
    matches: true,
  } as MediaQueryList)
  mocks.open.mockReset()
  mocks.page.mockReset()
  mocks.render.mockReset()
  mocks.page.mockImplementation(async (number: number) => page(number))
  model = {
    numPages: 3,
    diagnostics: [],
    getPage: mocks.page,
    destroy: vi.fn(),
  } as unknown as OFDDocument
  mocks.open.mockResolvedValue(model)
  mocks.render.mockImplementation(
    ({ canvasContext, viewport }: RenderOptions) => {
      if (canvasContext) {
        canvasContext.canvas.width = viewport.width
        canvasContext.canvas.height = viewport.height
      }
      return { promise: Promise.resolve(), cancel: mocks.cancel }
    }
  )
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
    function (this: HTMLCanvasElement) {
      return { canvas: this } as never
    }
  )
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(600)
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(400)
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    }
  )
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        intersections = callback
      }
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

test("opens, navigates, fits, zooms, rotates and closes a local document", async () => {
  render(<Client messages={m} />)
  expect(screen.getByText(m.drop)).toBeTruthy()
  await opened()
  expect(screen.getByText(m.visualOnly)).toBeTruthy()
  expect(screen.queryByRole("searchbox")).toBeNull()
  fireEvent.click(screen.getByRole("button", { name: m.next }))
  await screen.findByRole("img", { name: "Page 2" })
  fireEvent.click(screen.getByRole("button", { name: m.previous }))
  await screen.findByRole("img", { name: "Page 1" })
  fireEvent.change(screen.getByLabelText(m.page), { target: { value: "3" } })
  fireEvent.keyDown(screen.getByLabelText(m.page), { key: "Enter" })
  await screen.findByRole("img", { name: "Page 3" })
  fireEvent.click(screen.getByRole("button", { name: m.zoomIn }))
  fireEvent.click(screen.getByRole("button", { name: m.zoomOut }))
  fireEvent.click(screen.getByRole("button", { name: m.fit }))
  await waitFor(() =>
    expect((screen.getByLabelText(m.zoom) as HTMLInputElement).value).toBe("94")
  )
  fireEvent.click(screen.getByRole("button", { name: m.rotate }))
  await waitFor(() =>
    expect(mocks.render.mock.calls.at(-1)?.[0].viewport.rotation).toBe(90)
  )
  fireEvent.click(screen.getByRole("button", { name: m.fitPage }))
  await waitFor(() =>
    expect((screen.getByLabelText(m.zoom) as HTMLInputElement).value).toBe("61")
  )
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  expect(screen.getByText(m.drop)).toBeTruthy()
  expect(model.destroy).toHaveBeenCalledOnce()
  expect(mocks.cancel).toHaveBeenCalled()
})

test("renders only visible overview pages and supports overview navigation", async () => {
  render(<Client messages={m} />)
  await opened()
  fireEvent.click(screen.getByRole("button", { name: m.thumbnails }))
  const nav = screen.getByRole("navigation", { name: m.thumbnails })
  const first = nav.querySelector('[data-page="1"]')!
  const second = nav.querySelector('[data-page="2"]')!
  act(() =>
    intersections(
      [
        { target: first, isIntersecting: true },
        { target: second, isIntersecting: true },
      ] as unknown as IntersectionObserverEntry[],
      {} as IntersectionObserver
    )
  )
  await waitFor(() => expect(nav.querySelectorAll("canvas")).toHaveLength(2))
  fireEvent.click(screen.getByRole("button", { name: "Page 2" }))
  expect((screen.getByLabelText(m.page) as HTMLInputElement).value).toBe("2")
  act(() =>
    intersections(
      [
        { target: first, isIntersecting: false },
      ] as unknown as IntersectionObserverEntry[],
      {} as IntersectionObserver
    )
  )
  await waitFor(() => expect(nav.querySelectorAll("canvas")).toHaveLength(1))
  fireEvent.click(screen.getByRole("button", { name: m.thumbnails }))
  expect(screen.queryByRole("navigation")).toBeNull()
})

test("retains navigation when an individual page or its thumbnail is damaged", async () => {
  mocks.page.mockImplementation(async (number: number) => {
    if (number === 2) throw new Error("missing")
    return page(number)
  })
  render(<Client messages={m} />)
  await opened()
  fireEvent.click(screen.getByRole("button", { name: m.next }))
  await screen.findByText(m.pageError)
  fireEvent.click(screen.getByRole("button", { name: m.thumbnails }))
  const target = screen.getByRole("button", { name: "Page 2" })
  act(() =>
    intersections(
      [
        { target, isIntersecting: true },
      ] as unknown as IntersectionObserverEntry[],
      {} as IntersectionObserver
    )
  )
  await screen.findByText(m.thumbnailError)
  fireEvent.click(screen.getByRole("button", { name: m.next }))
  await screen.findByRole("img", { name: "Page 3" })
  expect(screen.queryByText(m.pageError)).toBeNull()
})

test.each([
  [new Error("damaged"), m.invalid],
  [new Error("OFD document contains no pages"), m.empty],
  [new RangeError("allocation"), m.resourceLimit],
  [null, m.invalid],
])(
  "reports document errors without exposing private parser details",
  async (error, message) => {
    mocks.open.mockRejectedValueOnce(error)
    render(<Client messages={m} />)
    choose()
    await screen.findByText(message)
    choose("replacement.ofd")
    await screen.findByLabelText(m.page)
    expect(screen.queryByText(message)).toBeNull()
  }
)

test("shows compatibility warnings and recovers from canvas allocation errors", async () => {
  model.diagnostics.push(
    { code: "SIGNATURE_UNSUPPORTED", message: "private" },
    { code: "MULTI_DOCUMENT", message: "private" }
  )
  mocks.render.mockImplementationOnce(() => ({
    promise: Promise.reject(new Error("Canvas pixel limit exceeded")),
    cancel: mocks.cancel,
  }))
  render(<Client messages={m} />)
  choose()
  await screen.findByText(m.signatureNotice)
  expect(screen.getByText(m.multiDocumentNotice)).toBeTruthy()
  await screen.findByText(m.canvasLimit)
  fireEvent.click(screen.getByRole("button", { name: m.zoomOut }))
  await waitFor(() => expect(screen.queryByText(m.canvasLimit)).toBeNull())
})

test("clears failed canvases and reports generic rendering errors", async () => {
  mocks.render.mockImplementation(() => ({
    promise: Promise.reject("failure"),
    cancel: mocks.cancel,
  }))
  render(<Client messages={m} />)
  choose()
  await screen.findByText(m.pageError)
  expect(
    screen.getByRole("img", { name: "Page 1" }).getAttribute("width")
  ).toBe("0")
  fireEvent.click(screen.getByRole("button", { name: m.thumbnails }))
  const target = screen.getByRole("button", { name: "Page 1" })
  act(() =>
    intersections(
      [
        { target, isIntersecting: true },
      ] as unknown as IntersectionObserverEntry[],
      {} as IntersectionObserver
    )
  )
  await screen.findByText(m.thumbnailError)
})

test("disposes stale loads and ignores stale failures after replacement", async () => {
  let finish!: (document: OFDDocument) => void
  mocks.open.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve
      })
  )
  render(<Client messages={m} />)
  choose("old.ofd")
  await waitFor(() => expect(mocks.open).toHaveBeenCalledOnce())
  const oldSignal = mocks.open.mock.calls[0]![1] as AbortSignal
  choose("current.ofd")
  await screen.findByLabelText(m.page)
  const stale = { ...model, destroy: vi.fn() } as unknown as OFDDocument
  await act(async () => finish(stale))
  expect(stale.destroy).toHaveBeenCalledOnce()
  expect(oldSignal.aborted).toBe(true)
  let reject!: (reason: Error) => void
  mocks.open.mockImplementationOnce(
    () =>
      new Promise((_, fail) => {
        reject = fail
      })
  )
  choose("slow.ofd")
  await waitFor(() => expect(mocks.open).toHaveBeenCalledTimes(3))
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  await act(async () => reject(new Error("stale")))
  expect(screen.getByText(m.drop)).toBeTruthy()
  expect(screen.queryByText(m.invalid)).toBeNull()
})

test("ignores pages and render tasks that finish after navigation or closing", async () => {
  let finishPage!: (page: OFDPage) => void
  mocks.page.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finishPage = resolve
      })
  )
  render(<Client messages={m} />)
  choose()
  await screen.findByLabelText(m.page)
  fireEvent.click(screen.getByRole("button", { name: m.next }))
  await screen.findByRole("img", { name: "Page 2" })
  await act(async () => finishPage(page(1)))
  expect(screen.queryByRole("img", { name: "Page 1" })).toBeNull()
  let finishRender!: () => void
  mocks.render.mockImplementationOnce(() => ({
    promise: new Promise<void>((resolve) => {
      finishRender = resolve
    }),
    cancel: mocks.cancel,
  }))
  fireEvent.click(screen.getByRole("button", { name: m.next }))
  await screen.findByRole("img", { name: "Page 3" })
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  await act(async () => finishRender())
  expect(screen.getByText(m.drop)).toBeTruthy()
})

test("mobile overview gives way to the page and restores keyboard focus", async () => {
  vi.mocked(window.matchMedia).mockReturnValue({
    matches: false,
  } as MediaQueryList)
  render(<Client messages={m} />)
  await opened()
  const toggle = screen.getByRole("button", { name: m.thumbnails })
  fireEvent.click(toggle)
  fireEvent.click(screen.getByRole("button", { name: "Page 2" }))
  await screen.findByRole("img", { name: "Page 2" })
  expect(screen.queryByRole("navigation")).toBeNull()
  expect(document.activeElement).toBe(
    screen.getByRole("region", { name: m.reader })
  )
  fireEvent.click(toggle)
  fireEvent.keyDown(screen.getByRole("button", { name: "Page 2" }), {
    key: "Escape",
  })
  expect(screen.queryByRole("navigation")).toBeNull()
  expect(document.activeElement).toBe(toggle)
})
