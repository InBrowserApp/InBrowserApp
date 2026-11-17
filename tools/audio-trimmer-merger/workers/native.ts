import {
  AudioSample,
  AudioSampleSource,
  BufferTarget,
  Mp3OutputFormat,
  Mp4OutputFormat,
  OggOutputFormat,
  Output,
  Quality,
  WebMOutputFormat,
} from "mediabunny"
import { audioLayout, mixBlocks } from "../core/mix"
import { SAMPLE_RATE } from "../core/settings"
import { CODECS, nativeConfig } from "./native-support"
import type { EncodeRequest, NativeFormat } from "../types"

export async function encodeNative(
  { clips, settings }: EncodeRequest,
  onProgress: (value: number) => void
) {
  const format = settings.format as NativeFormat
  const channels = Math.max(...clips.map((clip) => clip.channels.length))
  const config = nativeConfig(format, { channels, quality: settings.quality })
  const target = new BufferTarget()
  const container =
    format === "m4a"
      ? new Mp4OutputFormat()
      : format === "webm"
        ? new WebMOutputFormat()
        : format === "mp3"
          ? new Mp3OutputFormat()
          : new OggOutputFormat()
  const output = new Output({ format: container, target })
  const source = new AudioSampleSource({
    codec: CODECS[format],
    fullCodecString: config.codec,
    quality: new Quality({
      bitrate: config.bitrate,
      bitrateMode: config.bitrateMode,
    }),
  })
  output.addAudioTrack(source)
  const { frames } = audioLayout(
    clips.map((clip) => clip.channels[0]!.length),
    settings.join
  )
  let completed = 0
  try {
    await output.start()
    for (const block of mixBlocks(clips, settings.smooth, settings.join)) {
      const length = block[0]!.length
      const data = new Float32Array(length * channels)
      for (let channel = 0; channel < channels; channel++)
        data.set(block[channel]!, channel * length)
      const sample = new AudioSample({
        data,
        format: "f32-planar",
        numberOfChannels: channels,
        sampleRate: SAMPLE_RATE,
        timestamp: completed / SAMPLE_RATE,
      })
      try {
        // Await the encoder's backpressure instead of queuing the whole recording.
        await source.add(sample)
      } finally {
        sample.close()
      }
      completed += length
      onProgress(Math.min(99, Math.round((completed / frames) * 100)))
    }
    source.close()
    await output.finalize()
    return target.buffer!
  } catch (error) {
    await output.cancel()
    throw error
  }
}
