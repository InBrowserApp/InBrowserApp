import { expect, test } from "vitest"
import { pngFilename } from "./png"
import type { ImageInfo } from "./types"

const info: ImageInfo = {
  format: "PNG",
  count: 1,
  kind: "image",
  poster: false,
}

test("names still PNGs without losing Unicode and replaces unsafe filename characters", () => {
  expect(pngFilename("图片.HEIC", info, 0)).toBe("图片.png")
  expect(pngFilename("photo", info, 0)).toBe("photo.png")
  expect(pngFilename(" /path\\a:<b>?*|\x00.heic", info, 0)).toBe(
    "_path_a__b_____.png"
  )
  expect(pngFilename(".png", info, 0)).toBe("image.png")
  expect(pngFilename(" ... .png", info, 0)).toBe("image.png")
  expect(pngFilename("...photo...png", info, 0)).toBe("photo.png")
})

test("identifies the selected page, icon variant, collection image, frame or default poster", () => {
  for (const kind of ["page", "variant", "image", "frame"] as const) {
    expect(
      pngFilename("sample.tiff", { ...info, kind, count: 1001 }, 1000)
    ).toBe(`sample-${kind}-1001.png`)
  }
  expect(pngFilename("animated.png", { ...info, poster: true }, 0)).toBe(
    "animated-poster.png"
  )
})
