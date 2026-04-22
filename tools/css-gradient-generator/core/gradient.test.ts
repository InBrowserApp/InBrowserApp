import { beforeEach, describe, expect, it, vi } from "vitest"

import {
  addStop,
  cloneLayer,
  createBackgroundBlendModeDeclaration,
  createBackgroundDeclaration,
  createBackgroundImageDeclaration,
  createCssOutput,
  createGradientCss,
  createLayer,
  createStop,
  formatColor,
  normalizeHexColor,
  parseGradientConfig,
  randomizeLayer,
  serializeGradientConfig,
} from "./gradient"

describe("gradient core", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("normalizes hex colors and formats alpha-aware output", () => {
    expect(normalizeHexColor("#abc")).toBe("#AABBCCFF")
    expect(normalizeHexColor("#abcd")).toBe("#AABBCCDD")
    expect(normalizeHexColor("112233")).toBe("#112233FF")
    expect(normalizeHexColor("#11223344")).toBe("#11223344")
    expect(normalizeHexColor("oops")).toBe("#000000FF")

    expect(formatColor("#112233FF", "hex")).toBe("#112233")
    expect(formatColor("#11223344", "hex")).toBe("#11223344")
    expect(formatColor("#11223380", "rgba")).toBe("rgba(17, 34, 51, 0.502)")
  })

  it("creates, clones, and adds stops with normalized defaults", () => {
    const layer = createLayer({
      angle: 999,
      centerX: -10,
      centerY: 120,
      colorSpace: "invalid" as never,
      radialShape: "triangle" as never,
      radialSize: "huge" as never,
      stops: [{ color: "#abc", position: 20 }],
      type: "weird" as never,
    })

    expect(layer.type).toBe("linear")
    expect(layer.angle).toBe(360)
    expect(layer.centerX).toBe(0)
    expect(layer.centerY).toBe(100)
    expect(layer.colorSpace).toBe("srgb")
    expect(layer.radialShape).toBe("circle")
    expect(layer.radialSize).toBe("farthest-corner")
    expect(layer.stops).toHaveLength(3)

    const cloned = cloneLayer(layer)
    expect(cloned.id).not.toBe(layer.id)
    expect(cloned.stops[0]?.id).not.toBe(layer.stops[0]?.id)

    const nextStop = addStop(
      [
        createStop("#111111FF", 0, "start"),
        createStop("#222222FF", 20, "middle"),
        createStop("#333333FF", 100, "end"),
      ],
      90
    )

    expect(nextStop.position).toBe(90)
    expect(nextStop.color).toBe("#333333FF")
  })

  it("serializes, parses, and renders CSS declarations", () => {
    const linear = createLayer({
      angle: 45,
      colorSpace: "oklch",
      stops: [
        { color: "#000000FF", position: 0 },
        { color: "#FFFFFFFF", position: 100 },
      ],
      type: "linear",
    })
    const radial = createLayer({
      centerX: 25,
      centerY: 75,
      radialShape: "ellipse",
      radialSize: "closest-side",
      stops: [
        { color: "#123456FF", position: 0 },
        { color: "#65432100", position: 100 },
      ],
      type: "radial",
    })
    const conic = createLayer({
      angle: 180,
      centerX: 50,
      centerY: 40,
      stops: [
        { color: "#AA0000FF", position: 0 },
        { color: "#00AA00FF", position: 100 },
      ],
      type: "conic",
    })

    expect(createGradientCss(linear, "hex")).toContain(
      "linear-gradient(45deg in oklch"
    )
    expect(createGradientCss(radial, "rgba")).toContain(
      "radial-gradient(ellipse closest-side at 25% 75%"
    )
    expect(createGradientCss(conic, "hex")).toContain(
      "conic-gradient(from 180deg at 50% 40%"
    )

    expect(createBackgroundImageDeclaration([linear], "hex")).toContain(
      "background-image:"
    )
    expect(createBackgroundBlendModeDeclaration([linear])).toBe("")
    expect(
      createBackgroundBlendModeDeclaration([
        linear,
        createLayer({
          blendMode: "screen",
          stops: [
            { color: "#FFFFFF00", position: 0 },
            { color: "#FFFFFFFF", position: 100 },
          ],
        }),
      ])
    ).toContain("background-blend-mode:")
    expect(createBackgroundDeclaration([linear], "hex")).toContain(
      "background:"
    )
    expect(createCssOutput([linear], "hex")).toContain("background-image:")

    const serialized = serializeGradientConfig([linear, radial])
    expect(parseGradientConfig(serialized)).toHaveLength(2)
    expect(
      parseGradientConfig(
        JSON.stringify([
          {
            angle: 90,
            blendMode: "normal",
            centerX: 50,
            centerY: 50,
            colorSpace: "srgb",
            radialShape: "circle",
            radialSize: "farthest-corner",
            stops: [
              { color: "#000000FF", position: 0 },
              { color: "#FFFFFFFF", position: 100 },
            ],
            type: "linear",
          },
        ])
      )
    ).toHaveLength(1)
    expect(parseGradientConfig("{")).toBeNull()
  })

  it("randomizes a layer deterministically when Math.random is stubbed", () => {
    const values = [
      0.5, 0.25, 0.75, 0.5, 0.1, 0.9, 0.2, 0.4, 0.6, 0.8, 0.3, 0.7,
    ]
    vi.spyOn(Math, "random").mockImplementation(() => values.shift() ?? 0.5)

    const randomized = randomizeLayer(
      createLayer({
        blendMode: "overlay",
        stops: [
          { color: "#000000FF", position: 0 },
          { color: "#FFFFFFFF", position: 100 },
        ],
        type: "radial",
      })
    )

    expect(randomized.type).toBe("radial")
    expect(randomized.blendMode).toBe("overlay")
    expect(randomized.stops).toHaveLength(4)
    expect(randomized.stops.map((stop) => stop.position)).toEqual(
      expect.arrayContaining([0, 27.5, 72.5, 100])
    )
  })
})
