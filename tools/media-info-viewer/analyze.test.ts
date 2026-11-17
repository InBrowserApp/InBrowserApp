import { beforeEach, describe, expect, it, vi } from "vitest"
import { analyze } from "./analyze"
import mediaInfoFactory from "mediainfo.js"

vi.mock("mediainfo.js", () => ({ default: vi.fn() }))
vi.mock("mediainfo.js/MediaInfoModule.wasm?url", () => ({
  default: "/assets/media.wasm",
}))
const engine = { analyzeData: vi.fn(), close: vi.fn() }
beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(mediaInfoFactory).mockResolvedValue(engine as never)
})
describe("chunked analysis", () => {
  it("reads only requested file ranges and closes the analyzer", async () => {
    const source = new Uint8Array([10, 20, 30, 40, 50])
    const file = {
      size: 5,
      slice: vi.fn((start, end) => ({
        arrayBuffer: async () => source.slice(start, end).buffer,
      })),
    } as unknown as File
    const result = {
      media: { track: [{ "@type": "General" }, { "@type": "Audio" }] },
    }
    engine.analyzeData.mockImplementation(async (size, read) => {
      expect(size).toBe(5)
      expect(await read(2, 1)).toEqual(new Uint8Array([20, 30]))
      return result
    })
    expect(await analyze(file)).toEqual({ result })
    expect(file.slice).toHaveBeenCalledWith(1, 3)
    expect(engine.close).toHaveBeenCalledOnce()
    const options = vi.mocked(mediaInfoFactory).mock.calls[0]![0]
    expect(options?.format).toBe("object")
    expect(options?.locateFile?.("ignored", "")).toBe("/assets/media.wasm")
  })
  it("accepts video tracks", async () => {
    engine.analyzeData.mockResolvedValue({
      media: { track: [{ "@type": "Video" }] },
    })
    expect(await analyze({ size: 10 } as File)).toHaveProperty("result")
  })
  it.each([
    {},
    { media: { track: [] } },
    { media: { track: [{ "@type": "General" }, { "@type": "Image" }] } },
  ])("rejects files without audio/video streams", async (result) => {
    engine.analyzeData.mockResolvedValue(result)
    expect(await analyze({ size: 10 } as File)).toEqual({ error: "parseError" })
    expect(engine.close).toHaveBeenCalledOnce()
  })
  it("releases the engine when parsing fails", async () => {
    engine.analyzeData.mockRejectedValue(new Error("parse failed"))
    expect(await analyze({ size: 10 } as File)).toEqual({ error: "parseError" })
    expect(engine.close).toHaveBeenCalledOnce()
  })
  it("distinguishes engine loading errors", async () => {
    vi.mocked(mediaInfoFactory).mockRejectedValue(new Error("load failed"))
    expect(await analyze({ size: 10 } as File)).toEqual({ error: "loadError" })
    expect(engine.close).not.toHaveBeenCalled()
  })
})
