import mediaInfoFactory from "mediainfo.js"
import wasmUrl from "mediainfo.js/MediaInfoModule.wasm?url"
import type { MediaInfo } from "mediainfo.js"
import type { Reply } from "./types"

export async function analyze(file: File): Promise<Reply> {
  let engine: MediaInfo
  try {
    engine = await mediaInfoFactory({
      format: "object",
      locateFile: () => wasmUrl,
    })
  } catch {
    return { error: "loadError" }
  }
  try {
    const result = await engine.analyzeData(
      file.size,
      async (size, offset) =>
        new Uint8Array(await file.slice(offset, offset + size).arrayBuffer())
    )
    if (
      !result.media?.track.some(
        (track) => track["@type"] === "Audio" || track["@type"] === "Video"
      )
    ) {
      return { error: "parseError" }
    }
    return { result }
  } catch {
    return { error: "parseError" }
  } finally {
    engine.close()
  }
}
