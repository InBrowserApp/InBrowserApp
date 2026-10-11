import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { loadFonts } from "./fonts"
const add = vi.fn(),
  load = vi.fn()
beforeEach(() => {
  vi.resetAllMocks()
  vi.stubGlobal("fonts", { add })
  vi.stubGlobal(
    "FontFace",
    class {
      load = load
      constructor(
        public family: string,
        public bytes: ArrayBuffer,
        public options: unknown
      ) {}
    }
  )
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      ok: true,
      arrayBuffer: async () => new ArrayBuffer(4),
    }))
  )
  load.mockResolvedValue({})
})
afterEach(() => vi.unstubAllGlobals())
test("loads only bundled font URLs and installs four worker font faces", async () => {
  const fonts = await loadFonts()
  expect(fonts).toHaveLength(4)
  expect(fonts.every((f) => f.byteLength === 4)).toBe(true)
  expect(add).toHaveBeenCalledTimes(4)
  expect(fetch).toHaveBeenCalledTimes(4)
})
test.each(["FontFace", "fonts"])(
  "rejects unavailable worker %s",
  async (key) => {
    if (key === "FontFace") vi.stubGlobal(key, undefined)
    else Reflect.deleteProperty(globalThis, "fonts")
    await expect(loadFonts()).rejects.toThrow("browserUnsupported")
  }
)
test("rejects failed font requests", async () => {
  vi.mocked(fetch).mockResolvedValue({ ok: false } as Response)
  await expect(loadFonts()).rejects.toThrow("engineUnavailable")
})
