export const REST_CHECK_MS = 3000

export function readSticks(axes: readonly number[]) {
  return [readStick(axes[0]!, axes[1]!), readStick(axes[2]!, axes[3]!)]
}

function readStick(x: number, y: number) {
  return { x, y, offset: Math.hypot(x, y) }
}

export function createRestSampler() {
  const totals = [
    { sum: 0, peak: 0 },
    { sum: 0, peak: 0 },
  ]
  let count = 0

  return {
    sample(axes: readonly number[]) {
      count += 1
      readSticks(axes).forEach(({ offset }, index) => {
        const total = totals[index]!
        total.sum += offset
        total.peak = Math.max(total.peak, offset)
      })
    },
    result() {
      return totals.map(({ sum, peak }) => ({ average: sum / count, peak }))
    },
  }
}
