// ITU-R BS.1770-5 Annex 2 interpolation filter for 48 kHz PCM.
const firstPhase = [
  0.001708984375, 0.010986328125, -0.0196533203125, 0.033203125,
  -0.0594482421875, 0.1373291015625, 0.97216796875, -0.102294921875,
  0.047607421875, -0.026611328125, 0.014892578125, -0.00830078125,
]
const secondPhase = [
  -0.0291748046875, 0.029296875, -0.0517578125, 0.089111328125, -0.16650390625,
  0.465087890625, 0.77978515625, -0.2003173828125, 0.1015625, -0.0582275390625,
  0.0330810546875, -0.0189208984375,
]
const phases = [
  firstPhase,
  secondPhase,
  [...firstPhase].reverse(),
  [...secondPhase].reverse(),
]

export function truePeak(samples: Float32Array) {
  // Duplicate the 12-sample history to read each window without wraparound.
  const window = new Float32Array(24)
  let peak = 0
  let cursor = 0
  for (let index = 0; index < samples.length + 11; index++) {
    const sample = index < samples.length ? samples[index]! : 0
    window[cursor] = window[cursor + 12] = sample
    cursor = (cursor + 1) % 12
    peak = Math.max(peak, Math.abs(sample))
    for (const phase of phases) {
      let filtered = 0
      for (let tap = 0; tap < 12; tap++) {
        filtered += window[cursor + tap]! * phase[tap]!
      }
      peak = Math.max(peak, Math.abs(filtered))
    }
  }
  return 20 * Math.log10(peak)
}
