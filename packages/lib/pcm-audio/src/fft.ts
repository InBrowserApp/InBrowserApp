// Reuse the window, permutation and twiddle factors for successive audio frames.
// The caller chooses a power-of-two size and provides room for size / 2 + 1 bins.
export function createPowerSpectrum(size: number) {
  const real = new Float64Array(size)
  const imaginary = new Float64Array(size)
  const permutation = new Uint32Array(size)
  const cosine = new Float64Array(size / 2)
  const sine = new Float64Array(size / 2)
  const hann = new Float64Array(size)
  for (let i = 0; i < size; i++) {
    const angle = (2 * Math.PI * i) / size
    hann[i] = (1 - Math.cos(angle)) / 2
    if (i < size / 2) {
      cosine[i] = Math.cos(angle)
      sine[i] = -Math.sin(angle)
    }
    permutation[i] = (permutation[i >> 1]! >> 1) + ((i & 1) * size) / 2
  }

  return (samples: Float32Array, start: number, power: Float64Array) => {
    for (let i = 0; i < size; i++) {
      const index = permutation[i]!
      real[index] = (samples[start + i] ?? 0) * hann[i]!
      imaginary[index] = 0
    }
    for (let span = 2; span <= size; span *= 2) {
      const half = span / 2
      const step = size / span
      for (let base = 0; base < size; base += span) {
        for (let k = 0; k < half; k++) {
          const left = base + k
          const right = left + half
          const c = cosine[k * step]!
          const s = sine[k * step]!
          const rightReal = real[right]!
          const rightImaginary = imaginary[right]!
          const re = c * rightReal - s * rightImaginary
          const im = s * rightReal + c * rightImaginary
          real[right] = real[left]! - re
          imaginary[right] = imaginary[left]! - im
          real[left]! += re
          imaginary[left]! += im
        }
      }
    }
    for (let bin = 0; bin < power.length; bin++) {
      power[bin] = real[bin]! ** 2 + imaginary[bin]! ** 2
    }
  }
}
