import { readFileSync } from "node:fs"
import { expect, test } from "vitest"
import { writeArrayBuffer } from "geotiff"
import { readRaster } from "./raster"

test("opens the compressed example with its embedded coordinates", async () => {
  const bytes = readFileSync("tools/geotiff-viewer/elevation-example.tif")
  const image = await readRaster(new Blob([new Uint8Array(bytes)]))
  expect(image.details).toEqual({
    width: 320,
    height: 212,
    bands: 1,
    color: false,
    crs: "EPSG:4326",
    bounds: [-122.58, 47.498, -122.26, 47.71],
    noData: 0,
  })
  expect(image.pixels).toHaveLength(320 * 212 * 4)
  expect(image.band).toBe(0)
})

test("derives bounds from a nonzero tie point and pixel centers", async () => {
  const bytes = writeArrayBuffer([0, 10, 20, 30], {
    width: 2,
    height: 2,
    GTModelTypeGeoKey: 1,
    GTRasterTypeGeoKey: 2,
    ProjectedCSTypeGeoKey: 32651,
    ModelTiepoint: [10, 10, 0, 100, 200, 0],
    ModelPixelScale: [10, 10, 0],
    GDAL_NODATA: "0",
  })
  const image = await readRaster(new Blob([bytes]))
  expect(image.details.crs).toBe("EPSG:32651")
  expect(image.details.bounds).toEqual([-5, 285, 15, 305])
  expect(Array.from(image.pixels)).toEqual([
    0, 0, 0, 0, 0, 0, 0, 255, 128, 128, 128, 255, 255, 255, 255, 255,
  ])
})

test("shows declared RGB alpha and allows a band to be viewed on its own", async () => {
  const bytes = writeArrayBuffer([255, 0, 128, 0, 0, 255, 0, 128], {
    width: 2,
    height: 1,
    PhotometricInterpretation: 2,
    SamplesPerPixel: 4,
    BitsPerSample: [8, 8, 8, 8],
    ExtraSamples: [2],
    PlanarConfiguration: 1,
  })
  const file = new Blob([bytes])
  const image = await readRaster(file)
  expect(image.band).toBe(-1)
  expect(Array.from(image.pixels)).toEqual([255, 0, 128, 0, 0, 255, 0, 128])
  const green = await readRaster(file, 1)
  expect(green.band).toBe(1)
  expect(Array.from(green.pixels)).toEqual([0, 0, 0, 255, 255, 255, 255, 255])
})

test("rejects files with no TIFF header", async () => {
  await expect(readRaster(new Blob(["bad input"]))).rejects.toThrow(
    /byte order|bounds|buffer/i
  )
})
