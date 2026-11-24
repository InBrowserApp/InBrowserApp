const SAMPLE_RATE = 48_000

function encodeMonoWav(samples: Float32Array, sampleRate: number) {
  const dataSize = samples.length * 2
  const buffer = new ArrayBuffer(44 + dataSize)
  const view = new DataView(buffer)
  function writeTag(offset: number, tag: string) {
    for (let i = 0; i < tag.length; i++) {
      view.setUint8(offset + i, tag.charCodeAt(i))
    }
  }

  writeTag(0, "RIFF")
  view.setUint32(4, 36 + dataSize, true)
  writeTag(8, "WAVEfmt ")
  view.setUint32(16, 16, true) // PCM format chunk size
  view.setUint16(20, 1, true) // PCM format
  view.setUint16(22, 1, true) // Mono
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  writeTag(36, "data")
  view.setUint32(40, dataSize, true)

  for (let i = 0; i < samples.length; i++) {
    const sample = Math.min(
      32767,
      Math.max(-32768, Math.round(samples[i]! * 32768))
    )
    view.setInt16(44 + i * 2, sample, true)
  }
  return new Blob([buffer], { type: "audio/wav" })
}

export type SplitResult =
  | { error: "monoError" | "multichannelError" }
  | { left: Blob; right: Blob }

export async function splitStereoFile(
  file: File,
  signal: AbortSignal
): Promise<SplitResult> {
  const data = await file.arrayBuffer()
  signal.throwIfAborted()
  const context = new OfflineAudioContext(2, 1, SAMPLE_RATE)
  const audio = await context.decodeAudioData(data)
  signal.throwIfAborted()
  if (audio.numberOfChannels === 1) return { error: "monoError" }
  if (audio.numberOfChannels > 2) return { error: "multichannelError" }
  return {
    left: encodeMonoWav(audio.getChannelData(0), audio.sampleRate),
    right: encodeMonoWav(audio.getChannelData(1), audio.sampleRate),
  }
}
