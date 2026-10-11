import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { PDFDocument } from "pdf-lib"
import type { Reply, Request } from "./protocol"
const mock = vi.hoisted(() => ({
  init: vi.fn(),
  initSvg: vi.fn(),
  fonts: vi.fn(),
  preflight: vi.fn(),
  binary: vi.fn(),
  xml: vi.fn(),
  count: vi.fn(),
  info: vi.fn(),
  svg: vi.fn(),
  refs: vi.fn(),
  freeDoc: vi.fn(),
  freeRaster: vi.fn(),
  freeImage: vi.fn(),
  unresolved: vi.fn(),
  png: vi.fn(),
  render: vi.fn(),
  measure: vi.fn(),
}))
vi.mock("@rhwp/core", () => ({
  default: mock.init,
  HwpDocument: class {
    pageCount = mock.count
    getPageInfo = mock.info
    getExternalImageReferences = mock.refs
    renderPageSvgWithProfile = mock.svg
    free = mock.freeDoc
  },
}))
vi.mock("@resvg/resvg-wasm", () => ({
  initWasm: mock.initSvg,
  Resvg: class {
    free = mock.freeRaster
    imagesToResolve = mock.unresolved
    render = mock.render
  },
}))
vi.mock("./fonts", () => ({ loadFonts: mock.fonts }))
vi.mock("@workspace/hwp/preflight", () => ({ preflight: mock.preflight }))
vi.mock("./core/binary", () => ({ binaryResources: mock.binary }))
vi.mock("./core/xml", () => ({ xmlResources: mock.xml }))
let replies: Reply[]
let scope: { onmessage: ((e: { data: Request }) => void) | null }
beforeEach(async () => {
  vi.resetModules()
  vi.resetAllMocks()
  replies = []
  scope = { onmessage: null }
  vi.stubGlobal("self", scope)
  vi.stubGlobal("postMessage", (reply: Reply) => {
    replies.push(reply)
    if (reply.type === "resources" || reply.type === "page")
      queueMicrotask(() =>
        scope.onmessage?.({
          data: {
            type: "continue",
            ...(reply.type === "page" ? { svg: "<svg/>" } : {}),
          },
        })
      )
  })
  vi.stubGlobal(
    "OffscreenCanvas",
    class {
      getContext() {
        return { measureText: mock.measure, font: "" }
      }
    }
  )
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({}))
  mock.measure.mockReturnValue({ width: 12 })
  mock.fonts.mockResolvedValue([])
  mock.binary.mockReturnValue([])
  mock.xml.mockReturnValue([])
  mock.count.mockReturnValue(2)
  mock.info.mockReturnValue('{"width":200,"height":300}')
  mock.refs.mockReturnValue("[]")
  mock.svg.mockReturnValue("raw")
  mock.unresolved.mockReturnValue([])
  mock.png.mockReturnValue(
    Uint8Array.from(
      atob(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jk1cAAAAASUVORK5CYII="
      ),
      (c) => c.charCodeAt(0)
    )
  )
  mock.render.mockReturnValue({ asPng: mock.png, free: mock.freeImage })
  await import("./worker")
})
afterEach(() => {
  vi.unstubAllGlobals()
  Reflect.deleteProperty(globalThis, "measureTextWidth")
})
async function run(prefix = 0) {
  scope.onmessage?.({ data: { type: "open", bytes: new Uint8Array([prefix]) } })
  await vi.waitFor(() =>
    expect(replies.some((r) => r.type === "result" || r.type === "error")).toBe(
      true
    )
  )
  return replies.at(-1)!
}
test.each([0, 0x50])(
  "creates a real PDF with source physical dimensions and frees every page (%i)",
  async (prefix) => {
    const result = await run(prefix)
    expect(result.type).toBe("result")
    if (result.type !== "result") return
    const pdf = await PDFDocument.load(result.bytes)
    expect(pdf.getPages().map((p) => p.getSize())).toEqual([
      { width: 150, height: 225 },
      { width: 150, height: 225 },
    ])
    expect(mock.freeDoc).toHaveBeenCalledOnce()
    expect(mock.freeRaster).toHaveBeenCalledTimes(2)
    expect(mock.freeImage).toHaveBeenCalledTimes(2)
    const measure = (
      globalThis as unknown as {
        measureTextWidth: (font: string, text: string) => number
      }
    ).measureTextWidth
    expect(measure("bold 14px Batang", "한글")).toBe(12)
    expect(measure("bad", "x")).toBe(12)
    scope.onmessage?.({ data: { type: "continue" } })
  }
)
test.each(["init", "fonts"] as const)(
  "reports %s startup failures",
  async (key) => {
    mock[key].mockRejectedValueOnce(new Error("network failed"))
    expect(await run()).toMatchObject({
      type: "error",
      code: "engineUnavailable",
    })
    expect(mock.freeDoc).not.toHaveBeenCalled()
  }
)
test("preserves font capability and memory errors", async () => {
  mock.fonts.mockRejectedValueOnce(new Error("browserUnsupported"))
  expect(await run()).toMatchObject({ code: "browserUnsupported" })
})
test("requires worker canvas", async () => {
  vi.stubGlobal("OffscreenCanvas", undefined)
  expect(await run()).toMatchObject({ code: "browserUnsupported" })
})
test("requires worker canvas context", async () => {
  vi.stubGlobal(
    "OffscreenCanvas",
    class {
      getContext() {
        return null
      }
    }
  )
  expect(await run()).toMatchObject({ code: "browserUnsupported" })
})
test.each(["empty", "external", "bounds", "unresolved", "raster"])(
  "rejects %s content and frees opened documents",
  async (mode) => {
    if (mode === "empty") mock.count.mockReturnValue(0)
    if (mode === "external") mock.refs.mockReturnValue('[{"loaded":false}]')
    if (mode === "bounds") mock.info.mockReturnValue('{"width":0,"height":300}')
    if (mode === "unresolved")
      mock.unresolved.mockReturnValue(["https://example.invalid"])
    if (mode === "raster")
      mock.render.mockImplementation(() => {
        throw new Error("memory allocation")
      })
    const result = await run()
    expect(result.type).toBe("error")
    expect(mock.freeDoc).toHaveBeenCalledOnce()
    if (mode === "unresolved" || mode === "raster")
      expect(mock.freeRaster).toHaveBeenCalledOnce()
  }
)
