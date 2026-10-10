import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { renderSlide, type Slide } from "@silurus/ooxml/pptx"

const geometry = {
  x: 0,
  y: 0,
  width: 914400,
  height: 914400,
  rotation: 0,
  flipH: false,
  flipV: false,
}
const picture = {
  ...geometry,
  type: "picture" as const,
  imagePath: "image.png",
  mimeType: "image/png",
  stroke: null,
}
const media = {
  ...geometry,
  type: "media" as const,
  mediaKind: "video" as const,
  posterPath: "image.png",
  posterMimeType: "image/png",
  mediaPath: "video.mp4",
  mimeType: "video/mp4",
}
beforeEach(() => {
  vi.stubGlobal(
    "createImageBitmap",
    vi.fn().mockRejectedValue(new Error("bad image"))
  )
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
    function (this: HTMLCanvasElement) {
      return new Proxy(
        { canvas: this, measureText: () => ({ width: 10 }) },
        {
          get(target, key) {
            return key in target ? target[key as keyof typeof target] : vi.fn()
          },
        }
      ) as unknown as CanvasRenderingContext2D
    }
  )
})
afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
function draw(slide: Partial<Slide>, failOnError: boolean) {
  const options = {
    width: 96,
    dpr: 1,
    failOnError,
    skipMediaControls: true,
    fetchImage: async () => new Blob(["broken"], { type: "image/png" }),
    fetchMedia: async () => new Blob(["broken"], { type: "image/png" }),
  }
  return renderSlide(
    document.createElement("canvas"),
    { index: 0, slideNumber: 1, elements: [], background: null, ...slide },
    914400,
    914400,
    options
  )
}

test("the export opt-in rejects parser error pages while normal viewing still renders them", async () => {
  await expect(
    draw({ parseError: "private source diagnostic" }, true)
  ).rejects.toThrow("Slide could not be parsed")
  await expect(
    draw({ parseError: "private source diagnostic" }, false)
  ).resolves.toBeTruthy()
})
test.each([
  ["picture", { elements: [picture] }],
  ["media poster", { elements: [media] }],
  [
    "background",
    {
      background: {
        fillType: "image",
        imagePath: "image.png",
        mimeType: "image/png",
      },
    },
  ],
] as const)(
  "the export opt-in rejects an undecodable %s while preserving default viewer behavior",
  async (_name, slide) => {
    await expect(draw(slide as Partial<Slide>, true)).rejects.toThrow(
      "bad image"
    )
    await expect(draw(slide as Partial<Slide>, false)).resolves.toBeTruthy()
  }
)
test("a valid blank slide remains exportable", async () => {
  await expect(draw({}, true)).resolves.toBeTruthy()
})
