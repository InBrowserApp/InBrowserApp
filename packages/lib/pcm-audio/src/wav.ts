type Span = { start: number; end: number }

export function encodeWav(
  channels: Float32Array[],
  sampleRate: number,
  gain: number,
  edit?: { spans: Span[]; fadeFrames: number }
) {
  const channelCount = channels.length
  const length = channels[0]!.length
  const spans = edit?.spans ?? [{ start: 0, end: length }]
  const fadeFrames = edit?.fadeFrames ?? 0
  const frames = spans.reduce((total, span) => total + span.end - span.start, 0)
  const frameBytes = channelCount * 2
  const size = frames * frameBytes
  if (size > 0xffffffff - 36) throw new RangeError("WAV exceeds RIFF size")
  const buffer = new ArrayBuffer(44 + size)
  const view = new DataView(buffer)
  view.setUint32(0, 0x52494646) // RIFF
  view.setUint32(4, size + 36, true)
  view.setUint32(8, 0x57415645) // WAVE
  view.setUint32(12, 0x666d7420) // fmt
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, channelCount, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * frameBytes, true)
  view.setUint16(32, frameBytes, true)
  view.setUint16(34, 16, true)
  view.setUint32(36, 0x64617461) // data
  view.setUint32(40, size, true)
  const scale = 10 ** (gain / 20) * 32768
  let byte = 44
  for (const { start, end } of spans) {
    const fadeInEnd = start > 0 ? start + fadeFrames : start
    const fadeOutStart = end < length ? end - fadeFrames : end
    for (let i = start; i < end; i++) {
      let frameScale = scale
      if (i < fadeInEnd) frameScale *= (i - start) / fadeFrames
      if (i >= fadeOutStart) frameScale *= (end - 1 - i) / fadeFrames
      for (const samples of channels) {
        view.setInt16(
          byte,
          Math.max(
            -32768,
            Math.min(32767, Math.round(samples[i]! * frameScale))
          ),
          true
        )
        byte += 2
      }
    }
  }
  return buffer
}
