import { beforeEach, expect, test, vi } from "vitest"
import { openReader } from "./reader"
import { assertOfficeArchive } from "@workspace/document-reader"
vi.mock("@workspace/document-reader", async (original) => ({
  ...(await original<typeof import("@workspace/document-reader")>()),
  assertOfficeArchive: vi.fn(),
}))

const mock = vi.hoisted(() => ({
  load: vi.fn(),
  create: vi.fn(),
  documentDestroy: vi.fn(),
  destroy: vi.fn(),
  fitWidth: vi.fn(),
  fitPage: vi.fn(),
  getScale: vi.fn(),
  goToSlide: vi.fn(),
  setScale: vi.fn(),
  findText: vi.fn(),
  findNext: vi.fn(),
  findPrev: vi.fn(),
  clearFind: vi.fn(),
  resize: vi.fn(),
  disconnect: vi.fn(),
}))
vi.mock("@silurus/ooxml/pptx", () => ({
  PptxPresentation: { load: mock.load },
  PptxViewer: { fromPresentation: mock.create },
}))
function setup() {
  const controller = new AbortController()
  const container = document.createElement("div")
  const doc = {
    slideCount: 3,
    slideWidth: 12192000,
    slideHeight: 6858000,
    renderSlide: vi.fn().mockResolvedValue(undefined),
    destroy: mock.documentDestroy,
  }
  mock.load.mockResolvedValue(doc)
  const options = {
    file: { arrayBuffer: async () => new ArrayBuffer(10) } as File,
    container,
    signal: controller.signal,
    onChange: vi.fn(),
    onError: vi.fn(),
  }
  return { controller, options, doc }
}
beforeEach(() => {
  vi.resetAllMocks()
  mock.create.mockReturnValue(mock)
  for (const method of [
    mock.fitPage,
    mock.fitWidth,
    mock.goToSlide,
    mock.setScale,
  ])
    method.mockResolvedValue(undefined)
  mock.getScale.mockReturnValue(1)
  mock.findText.mockResolvedValue([{}, {}])
  mock.findNext.mockResolvedValue({ matchIndex: 0 })
  mock.findPrev.mockResolvedValue({ matchIndex: 1 })
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(callback: () => void) {
        mock.resize.mockImplementation(callback)
      }
      observe() {}
      disconnect = mock.disconnect
    }
  )
})
const flush = async () => {
  await new Promise((resolve) => setTimeout(resolve, 0))
}

test("renders one page with local fonts, resource limits, navigation and search", async () => {
  const { options, controller, doc } = setup()
  const reader = await openReader(options)
  expect(assertOfficeArchive).toHaveBeenCalledWith(
    expect.any(ArrayBuffer),
    "pptx"
  )
  expect(mock.load).toHaveBeenCalledWith(
    expect.any(ArrayBuffer),
    expect.objectContaining({
      useGoogleFonts: false,
      resourceLimits: expect.objectContaining({ maxArchiveEntries: 10000 }),
    })
  )
  expect(mock.create).toHaveBeenCalledWith(
    expect.any(HTMLCanvasElement),
    doc,
    expect.objectContaining({
      enableTextSelection: true,
      enableHyperlinks: false,
      dpr: 1,
    })
  )
  const callbacks = mock.create.mock.calls[0]![2]
  callbacks.onSlideChange(2, 3)
  callbacks.onScaleChange(1.5)
  expect(options.onChange).toHaveBeenCalledWith({ page: 3, total: 3 })
  await reader.thumbnail(document.createElement("canvas"), 2)
  expect(doc.renderSlide).toHaveBeenCalledWith(
    expect.any(HTMLCanvasElement),
    1,
    expect.objectContaining({ dpr: 1 })
  )
  reader.page(2)
  expect(mock.goToSlide).toHaveBeenCalledWith(1)
  mock.resize()
  expect(mock.fitPage).toHaveBeenCalledTimes(2)
  reader.zoom(150)
  expect(mock.setScale).toHaveBeenCalledWith(1.5)
  mock.resize()
  expect(mock.fitPage).toHaveBeenCalledTimes(2)
  reader.zoom("page-width")
  expect(mock.fitWidth).toHaveBeenCalledOnce()
  mock.resize()
  expect(mock.fitWidth).toHaveBeenCalledTimes(2)
  reader.fitPage()
  expect(mock.fitPage).toHaveBeenCalledTimes(3)
  reader.find("hello")
  await flush()
  expect(options.onChange).toHaveBeenCalledWith({ matches: 2 })
  expect(options.onChange).toHaveBeenCalledWith({
    current: 1,
    searching: false,
  })
  reader.find("hello", true)
  await flush()
  expect(mock.findText).toHaveBeenCalledOnce()
  expect(options.onChange).toHaveBeenCalledWith({
    current: 2,
    searching: false,
  })
  mock.findNext.mockResolvedValue(null)
  reader.find("absent")
  await flush()
  expect(options.onChange).toHaveBeenCalledWith({
    current: 0,
    searching: false,
  })
  reader.find("")
  expect(mock.clearFind).toHaveBeenCalledOnce()
  callbacks.onError(new Error("render"))
  expect(options.onError).toHaveBeenCalledOnce()
  controller.abort()
  await reader.thumbnail(document.createElement("canvas"), 1)
  reader.dispose()
  expect(mock.destroy).toHaveBeenCalledOnce()
  expect(mock.documentDestroy).toHaveBeenCalledOnce()
  expect(mock.disconnect).toHaveBeenCalledOnce()
  expect(options.container.children).toHaveLength(0)
  callbacks.onSlideChange(0, 3)
  callbacks.onScaleChange(2)
  callbacks.onError(new Error())
  expect(options.onError).toHaveBeenCalledOnce()
})

test("opens presentations above 1,000 slides and navigates to the last slide", async () => {
  const { options, doc } = setup()
  doc.slideCount = 1001
  const reader = await openReader(options)
  expect(options.onChange).toHaveBeenCalledWith({
    total: 1001,
    page: 1,
    zoom: 100,
  })
  reader.page(1001)
  expect(mock.goToSlide).toHaveBeenCalledWith(1000)
  reader.dispose()
  expect(mock.documentDestroy).toHaveBeenCalledOnce()
})

test("releases empty presentations and those rejected by geometry limits", async () => {
  const empty = setup()
  empty.doc.slideCount = 0
  await expect(openReader(empty.options)).rejects.toThrow("EMPTY")
  for (const width of [0, NaN, 1e8]) {
    const { options, doc } = setup()
    doc.slideWidth = width * 9525
    await expect(openReader(options)).rejects.toThrow("TOO_LARGE")
  }
  expect(mock.documentDestroy).toHaveBeenCalledTimes(4)
  expect(mock.create).not.toHaveBeenCalled()
})

test("cleans up failures and documents that finish loading after cancellation", async () => {
  const { options, controller, doc } = setup()
  let finish!: (document: typeof doc) => void
  mock.load.mockImplementation(
    () =>
      new Promise((resolve) => {
        finish = resolve
      })
  )
  const pending = openReader(options)
  await flush()
  controller.abort()
  finish(doc)
  await expect(pending).rejects.toThrow("aborted")
  expect(mock.documentDestroy).toHaveBeenCalledOnce()
  const next = setup()
  mock.fitPage.mockRejectedValueOnce(new Error("render failed"))
  await expect(openReader(next.options)).rejects.toThrow("render failed")
  expect(mock.destroy).toHaveBeenCalledOnce()
  expect(next.options.container.children).toHaveLength(0)
  mock.load.mockRejectedValueOnce(new Error("invalid"))
  await expect(openReader(setup().options)).rejects.toThrow("invalid")
})

test("ignores superseded searches and reports asynchronous render failures", async () => {
  const { options, controller } = setup()
  const reader = await openReader(options)
  let finish!: (matches: unknown[]) => void
  mock.findText.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve
      })
  )
  reader.find("old")
  reader.find("")
  finish([{}])
  await flush()
  expect(mock.findNext).not.toHaveBeenCalled()
  mock.goToSlide.mockRejectedValueOnce(new Error("page failed"))
  reader.page(2)
  await flush()
  expect(options.onError).toHaveBeenCalledOnce()
  mock.findText.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve
      })
  )
  reader.find("new")
  controller.abort()
  finish([{}])
  await flush()
  expect(mock.findNext).not.toHaveBeenCalled()
})
