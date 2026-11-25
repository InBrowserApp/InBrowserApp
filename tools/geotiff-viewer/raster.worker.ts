import { readRaster } from "./raster"

self.onmessage = async ({
  data,
}: MessageEvent<{ source: File | "example"; band?: number }>) => {
  try {
    let file = data.source
    if (file === "example") {
      const response = await fetch(
        new URL("./elevation-example.tif", import.meta.url)
      )
      if (!response.ok) throw new Error("Sample is unavailable")
      file = new File([await response.blob()], "elevation-example.tif", {
        type: "image/tiff",
      })
    }
    const preview = await readRaster(file, data.band)
    self.postMessage({ file, preview }, { transfer: [preview.pixels.buffer] })
  } catch {
    self.postMessage(null)
  }
}
