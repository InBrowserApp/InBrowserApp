import type { FFmpeg } from "@ffmpeg/ffmpeg"
// oxlint-disable-next-line import/default -- Vite returns the emitted worker URL.
import classWorkerURL from "@ffmpeg/ffmpeg/worker?worker&url"
import coreURL from "@ffmpeg/core?url"
import compressedWasmURL from "@ffmpeg/core/wasm?gzip-url"
import { SAMPLE_RATE } from "@workspace/local-speech"
import type { VideoFormat } from "./types"

async function openMedia<T>(
  file: File,
  signal: AbortSignal,
  run: (ffmpeg: FFmpeg, input: string) => Promise<T>
) {
  if (import.meta.env.SSR)
    throw new Error("Video processing requires a browser")
  const { FFmpeg, FFFSType } = await import("@ffmpeg/ffmpeg")
  signal.throwIfAborted()
  const ffmpeg = new FFmpeg()
  const stop = () => ffmpeg.terminate()
  signal.addEventListener("abort", stop, { once: true })
  let wasmURL: string | undefined
  try {
    const response = await fetch(compressedWasmURL, { signal })
    if (!response.ok || !response.body)
      throw new Error("FFmpeg download failed")
    const wasm = response.body.pipeThrough(new DecompressionStream("gzip"))
    wasmURL = URL.createObjectURL(
      await new Response(wasm, {
        headers: { "Content-Type": "application/wasm" },
      }).blob()
    )
    signal.throwIfAborted()
    await ffmpeg.load({ classWorkerURL, coreURL, wasmURL })
    await ffmpeg.createDir("/input")
    const input = "source-video"
    const mounted = await ffmpeg.mount(
      FFFSType.WORKERFS,
      {
        blobs: [{ name: input, data: file }],
      },
      "/input"
    )
    if (!mounted) throw new Error("Could not open video")
    return await run(ffmpeg, `/input/${input}`)
  } finally {
    signal.removeEventListener("abort", stop)
    stop()
    if (wasmURL) URL.revokeObjectURL(wasmURL)
  }
}

export function readVideoAudio(file: File, signal: AbortSignal) {
  return openMedia(file, signal, async (ffmpeg, input) => {
    const output = "audio.f32"
    const status = await ffmpeg.exec([
      "-i",
      input,
      "-map",
      "0:a:0",
      "-ac",
      "1",
      "-ar",
      String(SAMPLE_RATE),
      "-af",
      "aresample=async=1:first_pts=0",
      "-f",
      "f32le",
      output,
    ])
    if (status !== 0) throw new Error("Audio extraction failed")
    const data = await ffmpeg.readFile(output)
    if (typeof data === "string" || !(data.buffer instanceof ArrayBuffer))
      throw new Error("Invalid PCM")
    return new Float32Array(data.buffer, data.byteOffset, data.byteLength / 4)
  })
}

export function embedSubtitles(
  file: File,
  srt: string,
  format: VideoFormat,
  signal: AbortSignal
) {
  return openMedia(file, signal, async (ffmpeg, input) => {
    const output = `subtitled.${format}`
    await ffmpeg.writeFile("subtitles.srt", new TextEncoder().encode(srt))
    const status = await ffmpeg.exec([
      "-i",
      input,
      "-i",
      "subtitles.srt",
      "-map",
      "0:V:0",
      "-map",
      "0:a?",
      "-map",
      "1:s:0",
      "-c:v",
      "copy",
      "-c:a",
      "copy",
      "-c:s",
      format === "mp4" ? "mov_text" : "srt",
      "-disposition:s:0",
      "default",
      output,
    ])
    if (status !== 0) throw new Error("Subtitle embedding failed")
    const data = await ffmpeg.readFile(output)
    if (typeof data === "string" || !(data.buffer instanceof ArrayBuffer))
      throw new Error("Invalid video output")
    return new Blob(
      [new Uint8Array(data.buffer, data.byteOffset, data.byteLength)],
      { type: format === "mp4" ? "video/mp4" : "video/x-matroska" }
    )
  })
}
