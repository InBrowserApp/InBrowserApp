import {
  AudioSampleSource,
  BufferTarget,
  Output,
  type AudioCodec,
  type OutputFormat,
} from "mediabunny"

export function createMonoOutput(format: OutputFormat, codec: AudioCodec) {
  const target = new BufferTarget()
  const output = new Output({ format, target })
  const source = new AudioSampleSource({ codec })
  output.addAudioTrack(source)
  return {
    source,
    start: () => output.start(),
    cancel: () => output.cancel(),
    async finish() {
      source.close()
      await output.finalize()
      return new Blob([target.buffer!], { type: format.mimeType })
    },
  }
}
