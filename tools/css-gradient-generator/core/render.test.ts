import { describe, expect, it, vi } from "vitest"

import { createLayer } from "./gradient"
import { drawLayersToCanvas } from "./render"

type GradientMock = {
  addColorStop: ReturnType<typeof vi.fn>
}

function createGradientMock(): GradientMock {
  return {
    addColorStop: vi.fn(),
  }
}

function createContext(options: { conic?: boolean } = {}) {
  const linearGradients: GradientMock[] = []
  const radialGradients: GradientMock[] = []
  const conicGradients: GradientMock[] = []
  const context = {
    clearRect: vi.fn(),
    createConicGradient: options.conic
      ? vi.fn(() => {
          const gradient = createGradientMock()
          conicGradients.push(gradient)
          return gradient
        })
      : undefined,
    createLinearGradient: vi.fn(() => {
      const gradient = createGradientMock()
      linearGradients.push(gradient)
      return gradient
    }),
    createRadialGradient: vi.fn(() => {
      const gradient = createGradientMock()
      radialGradients.push(gradient)
      return gradient
    }),
    fillRect: vi.fn(),
    fillStyle: "",
    globalCompositeOperation: "",
    restore: vi.fn(),
    save: vi.fn(),
    scale: vi.fn(),
    translate: vi.fn(),
  }

  return {
    conicGradients,
    context: context as unknown as CanvasRenderingContext2D,
    linearGradients,
    radialGradients,
  }
}

describe("drawLayersToCanvas", () => {
  it("renders linear and radial layers across all size branches", () => {
    const { context, linearGradients, radialGradients } = createContext()

    const layers = [
      createLayer({
        stops: [
          { color: "#000000FF", position: 0 },
          { color: "#FFFFFFFF", position: 100 },
        ],
        type: "linear",
      }),
      createLayer({
        radialShape: "circle",
        radialSize: "closest-side",
        stops: [
          { color: "#111111FF", position: 0 },
          { color: "#EEEEEEFF", position: 100 },
        ],
        type: "radial",
      }),
      createLayer({
        radialShape: "circle",
        radialSize: "farthest-side",
        stops: [
          { color: "#111111FF", position: 0 },
          { color: "#EEEEEEFF", position: 100 },
        ],
        type: "radial",
      }),
      createLayer({
        radialShape: "circle",
        radialSize: "closest-corner",
        stops: [
          { color: "#111111FF", position: 0 },
          { color: "#EEEEEEFF", position: 100 },
        ],
        type: "radial",
      }),
      createLayer({
        radialShape: "circle",
        radialSize: "farthest-corner",
        stops: [
          { color: "#111111FF", position: 0 },
          { color: "#EEEEEEFF", position: 100 },
        ],
        type: "radial",
      }),
      createLayer({
        radialShape: "ellipse",
        radialSize: "closest-side",
        stops: [
          { color: "#111111FF", position: 0 },
          { color: "#EEEEEEFF", position: 100 },
        ],
        type: "radial",
      }),
      createLayer({
        radialShape: "ellipse",
        radialSize: "farthest-side",
        stops: [
          { color: "#111111FF", position: 0 },
          { color: "#EEEEEEFF", position: 100 },
        ],
        type: "radial",
      }),
      createLayer({
        radialShape: "ellipse",
        radialSize: "closest-corner",
        stops: [
          { color: "#111111FF", position: 0 },
          { color: "#EEEEEEFF", position: 100 },
        ],
        type: "radial",
      }),
      createLayer({
        radialShape: "ellipse",
        radialSize: "farthest-corner",
        stops: [
          { color: "#111111FF", position: 0 },
          { color: "#EEEEEEFF", position: 100 },
        ],
        type: "radial",
      }),
    ]

    expect(drawLayersToCanvas(context, layers, 200, 100)).toBe(true)
    expect(linearGradients).toHaveLength(1)
    expect(radialGradients).toHaveLength(8)
  })

  it("returns false when conic gradients are unsupported", () => {
    const { context } = createContext()

    expect(
      drawLayersToCanvas(
        context,
        [
          createLayer({
            stops: [
              { color: "#000000FF", position: 0 },
              { color: "#FFFFFFFF", position: 100 },
            ],
            type: "conic",
          }),
        ],
        200,
        100
      )
    ).toBe(false)
  })

  it("renders conic gradients when the canvas API supports them", () => {
    const { context, conicGradients } = createContext({ conic: true })

    expect(
      drawLayersToCanvas(
        context,
        [
          createLayer({
            stops: [
              { color: "#000000FF", position: 0 },
              { color: "#FFFFFFFF", position: 100 },
            ],
            type: "conic",
          }),
        ],
        200,
        100
      )
    ).toBe(true)
    expect(conicGradients).toHaveLength(1)
  })

  it("skips zero-radius radial layers without throwing", () => {
    const { context, radialGradients } = createContext()

    expect(
      drawLayersToCanvas(
        context,
        [
          createLayer({
            centerX: 0,
            centerY: 0,
            radialShape: "circle",
            radialSize: "closest-side",
            stops: [
              { color: "#000000FF", position: 0 },
              { color: "#FFFFFFFF", position: 100 },
            ],
            type: "radial",
          }),
        ],
        0,
        100
      )
    ).toBe(true)
    expect(radialGradients).toHaveLength(0)
  })
})
