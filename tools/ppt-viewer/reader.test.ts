import { beforeEach, expect, test, vi } from "vitest"
import type { PresentationDocument } from "@extend-ai/react-pptx"
import { openReader } from "./reader"

const mock = vi.hoisted(() => ({
  parse: vi.fn(),
  create: vi.fn(),
  render: vi.fn(),
  destroy: vi.fn(),
  resize: vi.fn(),
  disconnect: vi.fn(),
  draw: vi.fn(),
}))
vi.mock("@extend-ai/react-pptx", () => ({
  parsePresentation: mock.parse,
  setWasmSource: vi.fn(),
  createPptxThumbnailRenderer: mock.create,
  PptxViewerError: class extends Error {
    constructor(
      public code: string,
      message: string
    ) {
      super(message)
    }
  },
}))
const flush = () => new Promise((resolve) => setTimeout(resolve, 0))
function setup(count = 3) {
  const doc = {
    size: { widthEmu: 9525000, heightEmu: 7143750 },
    assets: {},
    slides: Array.from({ length: count }, (_, i) => ({
      nodes:
        i === 2
          ? []
          : [
              {
                type: "shape",
                paragraphs: [{ runs: [{ text: `Local slide ${i + 1}` }] }],
              },
            ],
    })),
  } as unknown as PresentationDocument
  mock.parse.mockResolvedValue({
    kind: "parsed-presentation",
    document: doc,
    warnings: [],
  })
  const container = document.createElement("div")
  Object.defineProperties(container, {
    clientWidth: { value: 1024 },
    clientHeight: { value: 774 },
  })
  const controller = new AbortController()
  const file = new File(
    [new Uint8Array([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])],
    "owned.ppt"
  )
  const options = {
    file,
    container,
    signal: controller.signal,
    onChange: vi.fn(),
    onError: vi.fn(),
  }
  return { doc, controller, options }
}
beforeEach(() => {
  vi.resetAllMocks()
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    drawImage: mock.draw,
  } as unknown as CanvasRenderingContext2D)
  mock.render.mockImplementation(async () => ({
    data: document.createElement("canvas"),
    width: 200,
    height: 150,
  }))
  mock.create.mockReturnValue({
    renderSlide: mock.render,
    destroy: mock.destroy,
  })
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

test("renders with local fonts, size-aware fit, direct navigation, search and cleanup", async () => {
  const { options, controller } = setup()
  const reader = await openReader(options)
  expect(mock.parse).toHaveBeenCalledWith(
    options.file,
    expect.objectContaining({ maxInputBytes: Number.MAX_SAFE_INTEGER })
  )
  expect(mock.create).toHaveBeenCalledWith(
    expect.anything(),
    expect.objectContaining({
      fonts: {
        loadEmbeddedFonts: false,
        waitForFonts: false,
        reportMissingFonts: false,
      },
    })
  )
  expect(options.onChange).toHaveBeenCalledWith({
    page: 1,
    total: 3,
    zoom: 100,
  })
  expect(
    options.container.querySelector("canvas")!.getAttribute("aria-label")
  ).toContain("Local slide 1")
  reader.page(2)
  await flush()
  expect(mock.render).toHaveBeenLastCalledWith(
    1,
    expect.objectContaining({ maxWidth: 1000 })
  )
  reader.page(0)
  reader.page(4)
  reader.page(1.5)
  expect(mock.render).toHaveBeenCalledTimes(2)
  reader.zoom(150)
  await flush()
  expect(mock.render).toHaveBeenLastCalledWith(
    1,
    expect.objectContaining({ maxWidth: 1500 })
  )
  mock.resize()
  expect(mock.render).toHaveBeenCalledTimes(3)
  reader.zoom("page-width")
  await flush()
  mock.resize()
  await flush()
  reader.fitPage()
  await flush()
  reader.find("LOCAL")
  await flush()
  expect(options.onChange).toHaveBeenLastCalledWith(
    expect.objectContaining({ matches: 2, current: 1 })
  )
  reader.find("LOCAL", true)
  await flush()
  expect(options.onChange).toHaveBeenLastCalledWith(
    expect.objectContaining({ matches: 2, current: 2 })
  )
  reader.find("slide", true)
  await flush()
  reader.find("missing")
  reader.find("")
  expect(options.onChange).toHaveBeenLastCalledWith(
    expect.objectContaining({ matches: 0, current: 0 })
  )
  const target = document.createElement("canvas")
  await reader.thumbnail(target, 2)
  expect(target.width).toBe(200)
  controller.abort()
  reader.dispose()
  reader.page(1)
  reader.fitPage()
  await reader.thumbnail(target, 1)
  expect(mock.destroy).toHaveBeenCalledOnce()
  expect(mock.disconnect).toHaveBeenCalledOnce()
  expect(options.container.children).toHaveLength(0)
})

test("navigates with keyboard and reaches slide 1001", async () => {
  const { options } = setup(1001)
  const reader = await openReader(options)
  for (const [key, expected] of [
    ["End", 1000],
    ["Home", 0],
    ["PageDown", 1],
    ["ArrowRight", 2],
    ["PageUp", 1],
    ["ArrowLeft", 0],
  ] as const) {
    options.container.dispatchEvent(
      new KeyboardEvent("keydown", { key, cancelable: true })
    )
    await flush()
    expect(mock.render).toHaveBeenLastCalledWith(expected, expect.anything())
  }
  const count = mock.render.mock.calls.length
  options.container.dispatchEvent(
    new KeyboardEvent("keydown", { key: "ArrowRight", ctrlKey: true })
  )
  options.container.dispatchEvent(new KeyboardEvent("keydown", { key: "x" }))
  expect(mock.render).toHaveBeenCalledTimes(count)
  reader.page(3)
  await flush()
  expect(
    options.container.querySelector("canvas")!.getAttribute("aria-label")
  ).toBe("owned.ppt")
  reader.dispose()
})

test("rejects unrelated containers, empty decks, invalid geometry and parse failure", async () => {
  const invalid = setup()
  invalid.options.file = new File(["PK renamed modern file"], "renamed.ppt")
  await expect(openReader(invalid.options)).rejects.toThrow(
    "Unsupported presentation container"
  )
  expect(mock.parse).not.toHaveBeenCalled()
  await expect(openReader(setup(0).options)).rejects.toThrow("EMPTY")
  const bad = setup()
  bad.doc.size.widthEmu = 0
  await expect(openReader(bad.options)).rejects.toThrow("TOO_LARGE")
  const failed = setup()
  mock.parse.mockRejectedValueOnce(new Error("broken"))
  await expect(openReader(failed.options)).rejects.toThrow("broken")
  expect(mock.create).not.toHaveBeenCalled()
})

test("releases failed rendering and ignores superseded canvases", async () => {
  const first = setup()
  mock.render.mockRejectedValueOnce(new Error("render failed"))
  await expect(openReader(first.options)).rejects.toThrow("render failed")
  expect(mock.destroy).toHaveBeenCalledOnce()
  const { options, controller } = setup()
  const reader = await openReader(options)
  let finish!: (value: unknown) => void
  mock.render.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve
      })
  )
  reader.page(2)
  await flush()
  const stale = document.createElement("canvas")
  stale.width = 100
  reader.page(3)
  await flush()
  finish({ data: stale })
  await flush()
  expect(stale.width).toBe(0)
  expect(
    options.container.querySelector("canvas")!.getAttribute("aria-label")
  ).toBe("owned.ppt")
  mock.render.mockRejectedValueOnce(new Error("later failed"))
  reader.page(1)
  await flush()
  expect(options.onError).toHaveBeenCalledWith(
    expect.objectContaining({ message: "later failed" })
  )
  controller.abort()
})

test("releases work cancelled during initial parsing or rendering and reports canvas allocation failure", async () => {
  const cancelled = setup()
  cancelled.controller.abort()
  await expect(openReader(cancelled.options)).rejects.toThrow("aborted")
  const late = setup()
  mock.parse.mockImplementationOnce(async () => {
    late.controller.abort()
    return { document: late.doc }
  })
  await expect(openReader(late.options)).rejects.toThrow("aborted")
  const rendering = setup()
  mock.render.mockImplementationOnce(async () => {
    rendering.controller.abort()
    return { data: document.createElement("canvas") }
  })
  await expect(openReader(rendering.options)).rejects.toThrow("aborted")
  const allocation = setup()
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValueOnce(null)
  await expect(openReader(allocation.options)).rejects.toThrow("TOO_LARGE")
})
