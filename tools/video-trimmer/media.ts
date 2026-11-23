import {
  BlobSource,
  BufferTarget,
  Conversion,
  Input,
  MP4,
  Mp4OutputFormat,
  Output,
  WEBM,
  WebMOutputFormat,
} from "mediabunny"

import type { ClipRange, VideoFormat } from "./types"

function openVideo(file: File) {
  return new Input({ formats: [MP4, WEBM], source: new BlobSource(file) })
}

export async function inspectVideo(file: File, playbackDuration: number) {
  using input = openVideo(file)
  const format = (await input.getFormat()) === MP4 ? "mp4" : "webm"
  // MediaRecorder WebM files can lack a duration in the container header.
  const duration = Number.isFinite(playbackDuration)
    ? playbackDuration
    : await input.computeDuration()
  if (!(duration > 0)) throw new Error("Missing video duration")
  return { format, duration } as const
}

export async function exportVideo(
  file: File,
  format: VideoFormat,
  trim: ClipRange | undefined,
  signal: AbortSignal,
  onProgress: (value: number) => void
) {
  signal.throwIfAborted()
  using input = openVideo(file)
  const target = new BufferTarget()
  const output = new Output({
    format: format === "mp4" ? new Mp4OutputFormat() : new WebMOutputFormat(),
    target,
  })
  const conversion = await Conversion.init({
    input,
    output,
    trim,
    // Re-encode cuts to avoid including frames or audio outside the selection.
    copy: trim ? false : undefined,
    showWarnings: false,
  })
  signal.throwIfAborted()
  if (
    !conversion.isValid ||
    conversion.discardedTracks.some(
      ({ track }) => track.isVideoTrack() || track.isAudioTrack()
    )
  ) {
    throw new Error(
      "The output format cannot preserve the video and audio tracks"
    )
  }

  let cancellation: Promise<void> | undefined
  const cancel = () => {
    cancellation = conversion.cancel()
  }
  signal.addEventListener("abort", cancel, { once: true })
  conversion.onProgress = onProgress
  try {
    await conversion.execute()
    return new Blob([target.buffer!], { type: `video/${format}` })
  } finally {
    signal.removeEventListener("abort", cancel)
    await cancellation
  }
}
