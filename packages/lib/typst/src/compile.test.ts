import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { compile } from "./compile"

const mock = vi.hoisted(() => ({
  init: vi.fn(),
  add: vi.fn(),
  world: vi.fn(),
  compile: vi.fn(),
  pdf: vi.fn(),
  fonts: vi.fn(),
  access: vi.fn(),
  registry: vi.fn(),
}))
vi.mock("@myriaddreamin/typst.ts/compiler", () => ({
  createTypstCompiler: () => ({
    init: mock.init,
    addSource: mock.add,
    runWithWorld: mock.world,
  }),
}))
vi.mock("@myriaddreamin/typst.ts/options.init", () => ({
  loadFonts: mock.fonts,
  withAccessModel: mock.access,
  withPackageRegistry: mock.registry,
}))
vi.mock(
  "@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm?gzip-url",
  () => ({
    default: "/compiler.gz",
  })
)

const file = (bytes = "= Report") =>
  ({ arrayBuffer: async () => new TextEncoder().encode(bytes).buffer }) as File
beforeEach(() => {
  vi.resetAllMocks()
  vi.stubGlobal(
    "DecompressionStream",
    class {
      readable = new ReadableStream({
        start(c) {
          c.enqueue(new Uint8Array([1]))
          c.close()
        },
      })
      writable = new WritableStream()
    }
  )
  vi.stubGlobal(
    "fetch",
    vi.fn().mockImplementation(async () => new Response(new Uint8Array([1])))
  )
  mock.world.mockImplementation(async (_options, callback) =>
    callback({ compile: mock.compile, pdf: mock.pdf })
  )
  mock.compile.mockResolvedValue({ hasError: false })
  mock.pdf.mockResolvedValue({ result: new Uint8Array([37, 80, 68, 70]) })
})
afterEach(() => vi.unstubAllGlobals())

test("keeps warnings, uses local fonts and disables automatic packages", async () => {
  const warning = {
    message: "unknown font family",
    range: "0:0-0:1",
    severity: "warning",
  }
  mock.compile.mockResolvedValue({ hasError: false, diagnostics: [warning] })
  mock.pdf.mockResolvedValue({
    result: new Uint8Array([37, 80]),
    diagnostics: [warning],
  })
  const progress = vi.fn()
  const result = await compile(file(), progress)
  expect(result.pdf?.byteLength).toBe(2)
  expect(result.diagnostics).toHaveLength(2)
  expect(result.diagnostics[0]?.line).toBe(1)
  expect(progress.mock.calls.flat()).toEqual([
    "reading",
    "preparing",
    "compiling",
  ])
  expect(mock.add).toHaveBeenCalledWith("/main.typ", "= Report")
  expect(mock.fonts).toHaveBeenCalledWith(expect.any(Array), { assets: false })
  expect(mock.registry.mock.calls[0]?.[0].resolve({})).toBeUndefined()
  expect(mock.init.mock.calls[0]?.[0].getModule()).toBeInstanceOf(Uint8Array)
  expect(mock.access).toHaveBeenCalledOnce()
})

test("does not export a partial PDF after compiler errors", async () => {
  mock.compile.mockResolvedValue({
    hasError: true,
    diagnostics: [
      { message: "unclosed delimiter", range: "1:0-1:2", severity: "error" },
    ],
  })
  expect(await compile(file(), vi.fn())).toEqual({
    error: "failed",
    diagnostics: [
      { message: "unclosed delimiter", line: 2, column: 1, severity: "error" },
    ],
  })
  expect(mock.pdf).not.toHaveBeenCalled()
})

test("reports absent PDF output and errors at their actual stage", async () => {
  mock.pdf.mockResolvedValue({})
  expect((await compile(file(), vi.fn())).error).toBe("failed")
  mock.world.mockRejectedValue(new Error("out of memory"))
  expect((await compile(file(), vi.fn())).error).toBe("resource")
  expect((await compile(file(""), vi.fn())).error).toBe("empty")
  mock.init.mockRejectedValue(new Error("unavailable"))
  expect((await compile(file(), vi.fn())).error).toBe("engineUnavailable")
  mock.init.mockRejectedValue(new Error("allocation failed"))
  expect((await compile(file(), vi.fn())).error).toBe("resource")
  vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 404 }))
  expect((await compile(file(), vi.fn())).error).toBe("engineUnavailable")
  vi.mocked(fetch).mockResolvedValue(new Response(null))
  expect((await compile(file(), vi.fn())).error).toBe("engineUnavailable")
})
