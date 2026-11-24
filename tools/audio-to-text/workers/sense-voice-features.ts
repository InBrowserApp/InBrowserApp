import {
  FFT,
  mel_filter_bank,
  window_function,
} from "@huggingface/transformers"
import { SAMPLE_RATE } from "../worker-messages"

const FRAME_SIZE = 400
const FRAME_HOP = 160
const FFT_SIZE = 512
const MEL_BINS = 80
const STACK = 7
const STACK_HOP = 6
const FEATURE_WIDTH = MEL_BINS * STACK

const window = window_function(FRAME_SIZE, "hamming", { periodic: false })
const melFilters = mel_filter_bank(
  FFT_SIZE / 2 + 1,
  MEL_BINS,
  20,
  SAMPLE_RATE / 2,
  SAMPLE_RATE,
  undefined,
  "kaldi",
  true
)

function parseNormalization(source: string) {
  // The pinned Kaldi am.mvn contains splice, mean shift, and inverse deviation.
  const [, shift, scale] = Array.from(
    source.matchAll(/\[([^\]]+)\]/g),
    (match) => Float32Array.from(match[1]!.trim().split(/\s+/), Number)
  )
  if (shift?.length !== FEATURE_WIDTH || scale?.length !== FEATURE_WIDTH)
    throw new Error("Invalid SenseVoice normalization parameters")
  return { shift, scale }
}

function senseVoiceFeatures(
  samples: Float32Array,
  normalization: ReturnType<typeof parseNormalization>
) {
  const frameCount = 1 + Math.floor((samples.length - FRAME_SIZE) / FRAME_HOP)
  const frames = Math.max(0, 1 + Math.floor((frameCount - STACK) / STACK_HOP))
  if (frames === 0)
    return { frames, values: new Float32Array(0), width: FEATURE_WIDTH }

  // The sherpa export stacks complete frames without padding either edge.
  const usedFrames = (frames - 1) * STACK_HOP + STACK
  const fft = new FFT(FFT_SIZE)
  const input = new Float64Array(FFT_SIZE)
  const output = new Float64Array(fft.outputBufferSize)
  const power = new Float64Array(FFT_SIZE / 2 + 1)
  const fbank = new Float32Array(usedFrames * MEL_BINS)
  for (let frame = 0; frame < usedFrames; frame++) {
    const offset = frame * FRAME_HOP
    let mean = 0
    for (let i = 0; i < FRAME_SIZE; i++) {
      const sample = samples[offset + i]! * 32768
      input[i] = sample
      mean += sample
    }
    mean /= FRAME_SIZE
    for (let i = FRAME_SIZE - 1; i > 0; i--) {
      input[i] = (input[i]! - mean - 0.97 * (input[i - 1]! - mean)) * window[i]!
    }
    input[0] = (input[0]! - mean) * (1 - 0.97) * window[0]!
    fft.realTransform(output, input)
    for (let bin = 0; bin < power.length; bin++) {
      power[bin] = output[2 * bin]! ** 2 + output[2 * bin + 1]! ** 2
    }
    for (let mel = 0; mel < MEL_BINS; mel++) {
      const filter = melFilters[mel]!
      let energy = 0
      for (let bin = 0; bin < power.length; bin++) {
        energy += power[bin]! * filter[bin]!
      }
      fbank[frame * MEL_BINS + mel] = Math.log(Math.max(2 ** -23, energy))
    }
  }

  const { shift, scale } = normalization
  const values = new Float32Array(frames * FEATURE_WIDTH)
  for (let frame = 0; frame < frames; frame++) {
    const source = frame * STACK_HOP * MEL_BINS
    const target = frame * FEATURE_WIDTH
    for (let i = 0; i < FEATURE_WIDTH; i++) {
      values[target + i] = (fbank[source + i]! + shift[i]!) * scale[i]!
    }
  }
  return { frames, values, width: FEATURE_WIDTH }
}

export { parseNormalization, senseVoiceFeatures }
