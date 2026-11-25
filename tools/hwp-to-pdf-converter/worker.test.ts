// @vitest-environment node
import { readFileSync } from "node:fs"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs"
import type { Reply, Request } from "./protocol"

const gothic = readFileSync(
  new URL("./fonts/NanumGothic-Regular.ttf", import.meta.url)
)
const svg = (body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300">${body}</svg>`

const mock = vi.hoisted(() => ({
  init: vi.fn(),
  source: vi.fn(),
  fonts: vi.fn(),
  cjk: vi.fn(),
  preflight: vi.fn(),
  binary: vi.fn(),
  xml: vi.fn(),
  count: vi.fn(),
  info: vi.fn(),
  svg: vi.fn(),
  refs: vi.fn(),
  freeDoc: vi.fn(),
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
vi.mock("./fonts", () => ({
  loadFonts: mock.fonts,
  loadCjkFont: mock.cjk,
}))
vi.mock("@workspace/hwp/preflight", () => ({ preflight: mock.preflight }))
vi.mock("@workspace/hwp/wasm", () => ({ loadWasmSource: mock.source }))
vi.mock("@rhwp/core/rhwp_bg.wasm?gzip-url", () => ({
  default: "/hwp.wasm.gz",
}))
vi.mock("./core/binary", () => ({ binaryResources: mock.binary }))
vi.mock("./core/xml", () => ({ xmlResources: mock.xml }))
let replies: Reply[]
let scope: { onmessage: ((e: { data: Request }) => void) | null }
beforeEach(async () => {
  vi.resetModules()
  vi.resetAllMocks()
  mock.source.mockResolvedValue(new Response())
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
            ...(reply.type === "page" ? { svg: reply.svg } : {}),
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
  mock.measure.mockReturnValue({ width: 12 })
  mock.fonts.mockResolvedValue([
    { family: "Nanum Gothic", weight: "400", bytes: gothic.buffer },
    { family: "Nanum Gothic", weight: "700", bytes: gothic.buffer },
  ])
  mock.binary.mockReturnValue([])
  mock.xml.mockReturnValue([])
  mock.count.mockReturnValue(2)
  mock.info.mockReturnValue('{"width":200,"height":300}')
  mock.refs.mockReturnValue("[]")
  mock.svg.mockImplementation((page: number) =>
    svg(
      `<text x="10" y="30" font-size="14">한글 River ${page + 1}</text>` +
        '<text x="10" y="60" font-size="14" fill-opacity="0">·</text>'
    )
  )
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
  "writes selectable Korean and Latin text in source page order and dimensions (%i)",
  async (prefix) => {
    const result = await run(prefix)
    expect(result.type).toBe("result")
    if (result.type !== "result") return
    const task = getDocument({ data: result.bytes })
    try {
      const pdf = await task.promise
      expect(pdf.numPages).toBe(2)
      for (const number of [1, 2]) {
        const page = await pdf.getPage(number)
        expect(page.view).toEqual([0, 0, 150, 225])
        const { items } = await page.getTextContent()
        expect(
          items.flatMap((item) => ("str" in item ? [item.str] : []))
        ).toEqual([`한글 River ${number}`, "·"])
      }
    } finally {
      await task.destroy()
    }
    expect(mock.freeDoc).toHaveBeenCalledOnce()
    expect(mock.cjk).not.toHaveBeenCalled()
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
test("embeds the supplemental font once when a page needs it", async () => {
  mock.cjk.mockResolvedValue(
    readFileSync(
      new URL(
        "../../packages/lib/libreoffice/fonts/NotoSansCJKsc-Regular.otf",
        import.meta.url
      )
    ).buffer
  )
  mock.svg.mockReturnValue(
    svg(
      '<text x="10" y="30" style="font-weight:bold;font-style:italic" font-family="Noto Sans CJK SC">漢字</text>'
    )
  )
  const result = await run()
  expect(result.type).toBe("result")
  if (result.type !== "result") return
  const task = getDocument({ data: result.bytes })
  try {
    const pdf = await task.promise
    const page = await pdf.getPage(2)
    expect((await page.getTextContent()).items[0]).toMatchObject({
      str: "漢字",
    })
  } finally {
    await task.destroy()
  }
  expect(mock.cjk).toHaveBeenCalledOnce()
})
test.each(["empty", "external", "bounds", "invalidSvg", "resource"])(
  "rejects %s content and frees opened documents",
  async (mode) => {
    if (mode === "empty") mock.count.mockReturnValue(0)
    if (mode === "external") mock.refs.mockReturnValue('[{"loaded":false}]')
    if (mode === "bounds") mock.info.mockReturnValue('{"width":0,"height":300}')
    if (mode === "invalidSvg") mock.svg.mockReturnValue(svg('<path d="M"/>'))
    if (mode === "resource")
      mock.svg.mockImplementation(() => {
        throw new Error("memory allocation")
      })
    const result = await run()
    expect(result.type).toBe("error")
    expect(mock.freeDoc).toHaveBeenCalledOnce()
  }
)
