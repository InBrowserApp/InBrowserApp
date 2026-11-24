import type { Series } from "./types"

const size = 192
const frames = 17

// An analytical CT phantom made from ellipses. It contains no patient data.
function phantom(index: number) {
  const pixels = new Float32Array(size * size)
  const depth = (index - (frames - 1) / 2) / frames
  const inside = (
    x: number,
    y: number,
    cx: number,
    cy: number,
    rx: number,
    ry: number
  ) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const x = (col - size / 2) / (size / 2)
      const y = (row - size / 2) / (size / 2)
      let value = -1024
      if (inside(x, y, 0, 0.02, 0.88, 0.66 - 0.12 * depth)) {
        value = -105
        if (inside(x, y, 0, 0.025, 0.81, 0.59 - 0.12 * depth)) value = 44
        if (
          inside(x, y, -0.37, -0.045, 0.275, 0.43) ||
          inside(x, y, 0.36, -0.025, 0.28 - 0.13 * depth, 0.42)
        ) {
          value = -810
          if (Math.sin(39 * x - 21 * y) + Math.cos(27 * x + 42 * y) > 1.73)
            value = -390
        }
        if (inside(x, y, 0.12, -0.12, 0.235 + depth / 6, 0.235)) value = 58
        if (inside(x, y, 0, 0.355, 0.125, 0.11)) value = 640
        if (inside(x, y, 0, 0.355, 0.074, 0.065)) value = 195
        if (
          inside(x, y, 0, -0.549, 0.069, 0.035) ||
          (x ** 2 / 0.73 ** 2 + y ** 2 / 0.53 ** 2 > 0.99 &&
            x ** 2 / 0.77 ** 2 + y ** 2 / 0.55 ** 2 < 1 &&
            Math.abs(x) > 0.37)
        )
          value = 420
        value += (((row * 31 + col * 19 + ((row * col) % 37)) % 29) - 14) * 1.6
      }
      pixels[row * size + col] = value
    }
  }
  return pixels
}

export function example(name: string): Series[] {
  return [
    {
      modality: "CT",
      description: name,
      frameCount: frames,
      images: [
        {
          fileName: name,
          modality: "CT",
          seriesId: "sample",
          frameCount: frames,
          async frame(index) {
            return {
              width: size,
              height: size,
              aspectRatio: 1,
              pixels: phantom(index),
              inverted: false,
              window: { width: 1450, level: -520 },
              windowFunction: "LINEAR",
            }
          },
          tags: () => [
            { id: "0008,0060", name: "Modality", value: "CT" },
            { id: "0008,103E", name: "Series Description", value: name },
            {
              id: "0028,0008",
              name: "Number of Frames",
              value: String(frames),
            },
            { id: "0028,0010", name: "Rows", value: String(size) },
            { id: "0028,0011", name: "Columns", value: String(size) },
            { id: "0028,1050", name: "Window Center", value: "-520" },
            { id: "0028,1051", name: "Window Width", value: "1450" },
          ],
        },
      ],
    },
  ]
}
