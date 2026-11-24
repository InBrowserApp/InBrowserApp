import {
  ADTS,
  AudioSample,
  AudioSampleSink,
  BlobSource,
  FLAC,
  Input,
  MP3,
  MP4,
  OGG,
  QTFF,
  WAVE,
  WEBM,
  WavOutputFormat,
} from "mediabunny"

import { createMonoOutput } from "./audio-output"
import { flacPcmFormat, pcmFormat, supportsFlac } from "./core/formats"
import type { ChannelFiles, PcmFormat } from "./core/formats"

export type SplitResult =
  | { error: "monoError" | "multichannelError" }
  | { files: ChannelFiles; flacAvailable: boolean }

function channelError(numberOfChannels: number) {
  if (numberOfChannels === 1) return "monoError"
  if (numberOfChannels !== 2) return "multichannelError"
}

async function* browserSamples(audio: AudioBuffer) {
  const left = audio.getChannelData(0)
  const right = audio.getChannelData(1)
  const blockSize = 8192
  for (let offset = 0; offset < left.length; offset += blockSize) {
    const end = Math.min(offset + blockSize, left.length)
    const data = new Float32Array((end - offset) * 2)
    data.set(left.subarray(offset, end))
    data.set(right.subarray(offset, end), end - offset)
    yield new AudioSample({
      data,
      format: "f32-planar",
      numberOfChannels: 2,
      sampleRate: audio.sampleRate,
      timestamp: offset / audio.sampleRate,
    })
  }
}

async function writeWavs(
  samples: AsyncIterable<AudioSample>,
  pcm: PcmFormat,
  signal: AbortSignal
): Promise<SplitResult> {
  const left = createMonoOutput(new WavOutputFormat(), pcm)
  const right = createMonoOutput(new WavOutputFormat(), pcm)
  let sampleRate = 0
  let frames = 0
  try {
    await Promise.all([left.start(), right.start()])
    for await (const sample of samples) {
      try {
        signal.throwIfAborted()
        sampleRate = sample.sampleRate
        const format = sample.format.startsWith("f32")
          ? "f32-planar"
          : "s32-planar"
        const timestamp = frames / sampleRate
        for (const [planeIndex, writer] of [left, right].entries()) {
          const options = { format, planeIndex } as const
          const data = new ArrayBuffer(sample.allocationSize(options))
          sample.copyTo(data, options)
          const mono = new AudioSample({
            data,
            format,
            numberOfChannels: 1,
            sampleRate,
            timestamp,
          })
          try {
            await writer.source.add(mono)
          } finally {
            mono.close()
          }
        }
        frames += sample.numberOfFrames
      } finally {
        sample.close()
      }
    }
    if (!frames) throw new Error("Missing audio samples")
    const [leftFile, rightFile] = await Promise.all([
      left.finish(),
      right.finish(),
    ])
    return {
      files: { left: leftFile, right: rightFile },
      flacAvailable: supportsFlac(sampleRate, pcm),
    }
  } catch (error) {
    await Promise.all([left.cancel(), right.cancel()])
    throw error
  }
}

export async function splitStereoFile(
  file: File,
  signal: AbortSignal
): Promise<SplitResult> {
  const input = new Input({
    formats: [WAVE, FLAC, MP3, MP4, OGG, ADTS, WEBM, QTFF],
    source: new BlobSource(file),
  })
  let sampleRate = 48_000
  let pcm: PcmFormat = "pcm-s24"
  try {
    // Keep browser decoding for files the metadata reader does not recognize.
    const track = await input.getPrimaryAudioTrack().catch(() => null)
    signal.throwIfAborted()
    if (track) {
      sampleRate = await track.getSampleRate()
      const codec = await track.getCodec()
      let inputPcm = pcmFormat(codec)
      if (codec === "flac") {
        const description = (await track.getDecoderConfig())?.description
        const bytes = ArrayBuffer.isView(description)
          ? new Uint8Array(
              description.buffer,
              description.byteOffset,
              description.byteLength
            )
          : new Uint8Array(description ?? 0)
        inputPcm = flacPcmFormat(bytes)
      }
      if (inputPcm) {
        const error = channelError(await track.getNumberOfChannels())
        if (error) return { error }
        pcm = inputPcm
        if (await track.canDecode()) {
          return await writeWavs(
            new AudioSampleSink(track).samples(),
            pcm,
            signal
          )
        }
      }
    }
  } finally {
    input.dispose()
  }

  const data = await file.arrayBuffer()
  signal.throwIfAborted()
  const context = new OfflineAudioContext(2, 1, sampleRate)
  const audio = await context.decodeAudioData(data)
  signal.throwIfAborted()
  const error = channelError(audio.numberOfChannels)
  return error ? { error } : writeWavs(browserSamples(audio), pcm, signal)
}
