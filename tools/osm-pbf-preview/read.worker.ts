import { readOsmPreview } from "./read"

self.onmessage = async ({ data }: MessageEvent<File | "example">) => {
  try {
    let source: Blob | "example" = data
    if (source === "example") {
      const response = await fetch(
        new URL("./bay-example.osm.pbf", import.meta.url)
      )
      if (!response.ok) throw new Error("Sample is unavailable")
      source = await response.blob()
    }
    self.postMessage(await readOsmPreview(source))
  } catch {
    self.postMessage(null)
  }
}
