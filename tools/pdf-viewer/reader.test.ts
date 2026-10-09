import { beforeEach, expect, test, vi } from "vitest"
import { openReader } from "./reader"

const mock = vi.hoisted(() => ({
  getDocument: vi.fn(),
  destroy: vi.fn(),
  setDocument: vi.fn(),
  setLinkDocument: vi.fn(),
  dispatch: vi.fn(),
  events: new Map<string, (event?: unknown) => void>(),
  viewer: { currentPageNumber: 1, currentScale: 1, currentScaleValue: "" },
}))
vi.mock("pdfjs-dist", () => ({
  getDocument: mock.getDocument,
  GlobalWorkerOptions: {},
  AnnotationMode: { ENABLE: 1 },
  PasswordResponses: { INCORRECT_PASSWORD: 2 },
}))
vi.mock("./pdf-assets", () => ({ PdfAssets: class {} }))
vi.mock("pdfjs-dist/web/pdf_viewer.mjs", () => ({
  EventBus: class {
    on(name: string, handler: (event?: unknown) => void) {
      mock.events.set(name, handler)
    }
    dispatch = mock.dispatch
  },
  PDFLinkService: class {
    setViewer() {}
    setDocument = mock.setLinkDocument
  },
  PDFFindController: class {},
  PDFSinglePageViewer: class {
    constructor() {
      return Object.assign(mock.viewer, {
        setDocument: mock.setDocument,
        firstPagePromise: Promise.resolve(),
        l10n: { destroy: async () => {} },
      })
    }
  },
}))

function setup(pages = 3) {
  const task = {
    promise: Promise.resolve({ numPages: pages }),
    destroy: mock.destroy,
    onPassword: (_submit: (password: string) => void, _reason: number) => {},
  }
  mock.getDocument.mockReturnValue(task)
  const controller = new AbortController()
  const options = {
    file: { arrayBuffer: async () => new ArrayBuffer(10) } as File,
    container: document.createElement("div"),
    signal: controller.signal,
    onChange: vi.fn(),
    onPassword: vi.fn(),
    onError: vi.fn(),
  }
  return { options, controller, task }
}
beforeEach(() => {
  vi.clearAllMocks()
  mock.events.clear()
  mock.destroy.mockResolvedValue(undefined)
  mock.viewer.currentScaleValue = ""
})

test("wires the local viewer, navigation, search and password events", async () => {
  const { options, controller, task } = setup()
  const reader = await openReader(options)
  expect(mock.getDocument).toHaveBeenCalledWith(
    expect.objectContaining({
      data: expect.any(Uint8Array),
      useWorkerFetch: false,
      enableXfa: false,
      verbosity: 0,
    })
  )
  expect(options.onChange).toHaveBeenCalledWith({ total: 3, page: 1 })
  mock.events.get("pagesinit")!()
  expect(mock.viewer.currentScaleValue).toBe("page-width")
  mock.events.get("pagechanging")!({ pageNumber: 2 })
  mock.events.get("scalechanging")!({ scale: 1.25 })
  expect(options.onChange).toHaveBeenCalledWith({ page: 2 })
  expect(options.onChange).toHaveBeenCalledWith({ zoom: 125 })
  mock.events.get("updatefindmatchescount")!({
    matchesCount: { current: 1, total: 3 },
  })
  mock.events.get("updatefindcontrolstate")!({
    state: 3,
    matchesCount: { current: 0, total: 0 },
  })
  expect(options.onChange).toHaveBeenCalledWith({ searching: true })
  mock.events.get("updatefindcontrolstate")!({
    state: 0,
    matchesCount: { current: 2, total: 3 },
  })
  expect(options.onChange).toHaveBeenCalledWith({ searching: false })
  mock.events.get("pagerendered")!({})
  expect(options.onError).not.toHaveBeenCalled()
  mock.events.get("pagerendered")!({ error: new Error() })
  expect(options.onError).toHaveBeenCalledOnce()
  const submit = vi.fn()
  task.onPassword(submit, 1)
  expect(options.onPassword).toHaveBeenCalledWith(submit, false)
  task.onPassword(submit, 2)
  expect(options.onPassword).toHaveBeenCalledWith(submit, true)
  reader.page(2)
  expect(mock.viewer.currentPageNumber).toBe(2)
  reader.zoom(150)
  expect(mock.viewer.currentScale).toBe(1.5)
  reader.zoom("page-width")
  reader.find("word")
  expect(mock.dispatch).toHaveBeenLastCalledWith(
    "find",
    expect.objectContaining({ type: "", query: "word", findPrevious: false })
  )
  reader.find("word", true)
  expect(mock.dispatch).toHaveBeenLastCalledWith(
    "find",
    expect.objectContaining({ type: "again", findPrevious: true })
  )
  reader.find("")
  controller.abort()
  reader.dispose()
  mock.events.get("pagerendered")!({ error: new Error() })
  expect(options.onError).toHaveBeenCalledOnce()
  expect(mock.setDocument).toHaveBeenLastCalledWith(null)
  expect(mock.destroy).toHaveBeenCalledOnce()
})

test("opens PDFs above 1,000 pages and navigates to the last page", async () => {
  const { options } = setup(1001)
  const reader = await openReader(options)
  expect(options.onChange).toHaveBeenCalledWith({ total: 1001, page: 1 })
  reader.page(1001)
  expect(mock.viewer.currentPageNumber).toBe(1001)
  reader.dispose()
  expect(mock.destroy).toHaveBeenCalledOnce()
})

test("unloads corrupt PDFs instead of leaving workers alive", async () => {
  const broken = setup()
  broken.task.promise = Promise.reject(new Error("corrupt"))
  await expect(openReader(broken.options)).rejects.toThrow("corrupt")
  expect(mock.destroy).toHaveBeenCalledOnce()
})

test("cancels before allocation and while a document is loading", async () => {
  const canceled = setup()
  canceled.controller.abort()
  await expect(openReader(canceled.options)).rejects.toThrow(/abort/i)
  expect(mock.getDocument).not.toHaveBeenCalled()
  const pending = setup()
  let complete!: (value: { numPages: number }) => void
  pending.task.promise = new Promise((resolve) => {
    complete = resolve
  })
  const opening = openReader(pending.options)
  await vi.waitFor(() => expect(mock.getDocument).toHaveBeenCalledOnce())
  pending.controller.abort()
  complete({ numPages: 3 })
  await expect(opening).rejects.toThrow(/abort/i)
  expect(mock.destroy).toHaveBeenCalledOnce()
})
