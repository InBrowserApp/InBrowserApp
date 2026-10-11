// @vitest-environment jsdom
import { beforeEach, afterEach, expect, test, vi } from "vitest"
import { prepareSvg, validateResources } from "./prepare-svg"
import { fontFamily } from "./font-family"
Object.defineProperty(HTMLImageElement.prototype, "decode", {
  configurable: true,
  value: () => Promise.resolve(),
})
Object.defineProperty(URL, "createObjectURL", {
  configurable: true,
  value: () => "",
})
Object.defineProperty(URL, "revokeObjectURL", {
  configurable: true,
  value: () => {},
})
const svg = (body = "") =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="30">${body}</svg>`
const signal = () => new AbortController().signal
beforeEach(() => {
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:owned")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
  vi.spyOn(HTMLImageElement.prototype, "decode").mockResolvedValue(undefined)
  vi.spyOn(HTMLImageElement.prototype, "naturalWidth", "get").mockReturnValue(2)
  vi.spyOn(HTMLImageElement.prototype, "naturalHeight", "get").mockReturnValue(
    3
  )
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    drawImage: vi.fn(),
  } as unknown as CanvasRenderingContext2D)
  vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue(
    "data:image/png;base64,AQ=="
  )
})
afterEach(() => vi.restoreAllMocks())
test("uses Korean serif/sans fallbacks while retaining other styling", async () => {
  const result = await prepareSvg(
    svg(
      '<text font-family="바탕" style="font-family:Gulim;fill:red">안녕</text>'
    ),
    signal()
  )
  expect(result).toContain('font-family="Nanum Myeongjo"')
  expect(result).toContain("font-family:Nanum Gothic;fill:red")
  expect(fontFamily("sans-serif")).toBe("Nanum Gothic")
})
test("normalizes embedded rasters and safely serializes nested SVGs", async () => {
  const child = svg('<image href="data:image/jpeg;base64,/9j/"/>')
  const result = await prepareSvg(
    svg(`<image href="data:image/svg+xml;base64,${btoa(child)}"/>`),
    signal()
  )
  const encoded = result.match(/data:image\/svg\+xml;base64,([^"]+)/)![1]!
  expect(atob(encoded)).toContain("data:image/png;base64,AQ==")
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:owned")
})
test.each([
  '<image href="https://example.invalid/a"/>',
  "<image/>",
  '<image href="#missing"/>',
  '<image href="data:image/svg+xml;base64,AAAA"/>',
])("rejects missing/unsafe SVG image content %s", async (body) => {
  await expect(prepareSvg(svg(body), signal())).rejects.toThrow("unsupported")
})
test("checks both raster and SVG assets independently of page output", async () => {
  await validateResources(
    [
      {
        bytes: new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]),
        mime: "image/png",
      },
      { bytes: new TextEncoder().encode(svg()), mime: "image/svg+xml" },
    ],
    signal()
  )
  expect(HTMLImageElement.prototype.decode).toHaveBeenCalledTimes(2)
  expect(URL.revokeObjectURL).toHaveBeenCalledTimes(2)
})
test("rejects corrupt image bytes and empty decoded images", async () => {
  vi.mocked(HTMLImageElement.prototype.decode).mockRejectedValueOnce(
    new Error("corrupt")
  )
  await expect(
    validateResources(
      [
        {
          bytes: new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]),
          mime: "image/png",
        },
      ],
      signal()
    )
  ).rejects.toThrow("unsupported")
  vi.spyOn(HTMLImageElement.prototype, "naturalWidth", "get").mockReturnValue(0)
  await expect(
    validateResources(
      [
        {
          bytes: new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]),
          mime: "image/png",
        },
      ],
      signal()
    )
  ).rejects.toThrow("unsupported")
})
test("cancels pending image decoding and revokes its URL", async () => {
  vi.mocked(HTMLImageElement.prototype.decode).mockImplementationOnce(
    () => new Promise(() => {})
  )
  const controller = new AbortController()
  const pending = validateResources(
    [
      {
        bytes: new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]),
        mime: "image/png",
      },
    ],
    controller.signal
  )
  controller.abort()
  await expect(pending).rejects.toMatchObject({ name: "AbortError" })
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:owned")
})
test("reports canvas capability and allocation failures", async () => {
  vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValueOnce(null)
  await expect(
    prepareSvg(
      svg('<image href="data:image/png;base64,iVBORw0KGgo="/>'),
      signal()
    )
  ).rejects.toThrow("browserUnsupported")
  vi.mocked(HTMLCanvasElement.prototype.toDataURL).mockReturnValueOnce("data:,")
  await expect(
    prepareSvg(
      svg('<image href="data:image/png;base64,iVBORw0KGgo="/>'),
      signal()
    )
  ).rejects.toThrow("resource")
})

test("rejects conflicting SVG hrefs and normalizes matching legacy references", async () => {
  const duplicate =
    '<image xmlns:xlink="http://www.w3.org/1999/xlink" href="data:image/png;base64,iVBORw0KGgo=" xlink:href="data:image/png;base64,AAAA"/>'
  await expect(prepareSvg(svg(duplicate), signal())).rejects.toThrow(
    "unsupported"
  )
  const result = await prepareSvg(
    svg(
      duplicate.replace(
        'xlink:href="data:image/png;base64,AAAA"',
        'xlink:href="data:image/png;base64,iVBORw0KGgo="'
      )
    ),
    signal()
  )
  expect(result.match(/href=/g)).toHaveLength(1)
})
test("rejects an SVG disguised as a PNG before invoking the browser decoder", async () => {
  await expect(
    validateResources(
      [
        {
          bytes: new TextEncoder().encode(
            svg('<image href="https://example.invalid/image"/>')
          ),
          mime: "image/png",
        },
      ],
      signal()
    )
  ).rejects.toThrow("unsupported")
  expect(HTMLImageElement.prototype.decode).not.toHaveBeenCalled()
})
