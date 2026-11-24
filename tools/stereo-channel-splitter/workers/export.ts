/// <reference lib="webworker" />
import { registerFlacEncoder } from "@mediabunny/flac-encoder"
import {
  AudioSampleSink,
  BlobSource,
  FlacOutputFormat,
  Input,
  WAVE,
} from "mediabunny"
import { createEncoder } from "wasm-media-encoders"
import mp3Wasm from "wasm-media-encoders/wasm/mp3?url"

import { createMonoOutput } from "../audio-output"
import { mp3SampleRate } from "../core/formats"
import type { ChannelFiles, DownloadFormat } from "../core/formats"

export type ExportRequest = {
  files: ChannelFiles
  format: Exclude<DownloadFormat, "wav">
}
export type ExportResponse = ChannelFiles | { error: true }

async function encodeMono(blob: Blob, format: ExportRequest["format"]) {
  const input = new Input({ formats: [WAVE], source: new BlobSource(blob) })
  try {
    const track = (await input.getPrimaryAudioTrack())!
    const samples = new AudioSampleSink(track).samples()
    if (format === "flac") {
      const output = createMonoOutput(new FlacOutputFormat(), "flac")
      await output.start()
      for await (const sample of samples) {
        try {
          await output.source.add(sample)
        } finally {
          sample.close()
        }
      }
      return await output.finish()
    }

    const sampleRate = await track.getSampleRate()
    const outputSampleRate = mp3SampleRate(sampleRate)
    const encoder = await createEncoder("audio/mpeg", mp3Wasm)
    encoder.configure({
      channels: 1,
      sampleRate,
      outputSampleRate,
      bitrate: outputSampleRate < 16_000 ? 64 : 128,
    })
    const chunks: Uint8Array<ArrayBuffer>[] = []
    for await (const sample of samples) {
      try {
        const pcm = new Float32Array(sample.numberOfFrames)
        sample.copyTo(pcm, { format: "f32-planar", planeIndex: 0 })
        // The encoder reuses its output memory on the next call.
        chunks.push(new Uint8Array(encoder.encode([pcm])))
      } finally {
        sample.close()
      }
    }
    chunks.push(new Uint8Array(encoder.finalize()))
    return new Blob(chunks, { type: "audio/mpeg" })
  } finally {
    input.dispose()
  }
}

self.onmessage = async ({
  data: { files, format },
}: MessageEvent<ExportRequest>) => {
  try {
    if (format === "flac") registerFlacEncoder()
    const left = await encodeMono(files.left, format)
    const right = await encodeMono(files.right, format)
    self.postMessage({ left, right } satisfies ExportResponse)
  } catch {
    self.postMessage({ error: true } satisfies ExportResponse)
  }
}
