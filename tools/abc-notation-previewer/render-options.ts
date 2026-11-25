import type { AbcVisualParams } from "abcjs"

export function abcLayout(staffwidth: number): AbcVisualParams {
  return {
    staffwidth,
    wrap: {
      preferredMeasuresPerLine: 4,
      minSpacing: 1.8,
      maxSpacing: 2.7,
    },
  }
}
