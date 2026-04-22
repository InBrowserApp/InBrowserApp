import { describe, expect, it } from "vitest"

import { createLayer } from "./gradient"
import { createGradientSvgMarkup } from "./svg"

describe("createGradientSvgMarkup", () => {
  it("builds a downloadable SVG wrapper around the active gradient", () => {
    const svg = createGradientSvgMarkup(
      [
        createLayer({
          stops: [
            { color: "#000000FF", position: 0 },
            { color: "#FFFFFFFF", position: 100 },
          ],
          type: "linear",
        }),
        createLayer({
          blendMode: "screen",
          stops: [
            { color: "#FFFFFF00", position: 0 },
            { color: "#FFFFFFFF", position: 100 },
          ],
        }),
      ],
      "rgba",
      320,
      180
    )

    expect(svg).toContain("<svg")
    expect(svg).toContain('width="320"')
    expect(svg).toContain("background-image:")
    expect(svg).toContain("background-blend-mode:normal, screen;")
  })
})
