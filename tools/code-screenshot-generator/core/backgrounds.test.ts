import { describe, expect, test } from "vitest"

import {
  getBackgroundPreviewCss,
  getBackgroundPreviewSize,
  resolveBackgroundCss,
  resolveBackgroundSvg,
  type BackgroundConfig,
} from "./backgrounds"
import { getBackgroundPreset } from "./themes"

const oneColorRadial: BackgroundConfig = {
  type: "preset",
  preset: {
    id: "single",
    labelKey: "single",
    type: "radial",
    colors: ["#111111"],
  },
}
const defaultAngleLinear: BackgroundConfig = {
  type: "preset",
  preset: {
    id: "default-angle",
    labelKey: "defaultAngle",
    type: "linear",
    colors: ["#111111", "#222222"],
  },
}

describe("code screenshot backgrounds", () => {
  test("resolves simple background modes", () => {
    expect(resolveBackgroundCss({ type: "none" })).toBe("none")
    expect(resolveBackgroundCss({ type: "transparent" })).toBe("transparent")
    expect(resolveBackgroundCss({ type: "solid", color: "#123456" })).toBe(
      "#123456"
    )
    expect(resolveBackgroundSvg({ type: "none" })).toEqual({
      defs: "",
      fill: "none",
    })
    expect(resolveBackgroundSvg({ type: "transparent" })).toEqual({
      defs: "",
      fill: "none",
    })
    expect(resolveBackgroundSvg({ type: "solid", color: "#abcdef" })).toEqual({
      defs: "",
      fill: "#abcdef",
    })
  })

  test("resolves preset CSS and SVG backgrounds", () => {
    const linear: BackgroundConfig = {
      type: "preset",
      preset: getBackgroundPreset("aurora"),
    }
    const radial: BackgroundConfig = {
      type: "preset",
      preset: getBackgroundPreset("noir"),
    }

    expect(resolveBackgroundCss(linear)).toContain("linear-gradient(135deg")
    expect(resolveBackgroundCss(defaultAngleLinear)).toContain(
      "linear-gradient(135deg"
    )
    expect(resolveBackgroundCss(radial)).toContain("radial-gradient")
    expect(resolveBackgroundCss(oneColorRadial)).toContain("#111111")
    expect(resolveBackgroundSvg(linear).defs).toContain("linearGradient")
    expect(resolveBackgroundSvg(defaultAngleLinear).defs).toContain(
      'stop-color="#222222"'
    )
    expect(resolveBackgroundSvg(radial).defs).toContain("radialGradient")
    expect(resolveBackgroundSvg(oneColorRadial).defs).toContain('cx="0.2"')
  })

  test("resolves preview patterns", () => {
    expect(getBackgroundPreviewCss({ type: "transparent" })).toContain(
      "linear-gradient(45deg"
    )
    expect(getBackgroundPreviewCss({ type: "none" })).toBe("none")
    expect(getBackgroundPreviewSize({ type: "transparent" })).toBe("20px 20px")
    expect(getBackgroundPreviewSize({ type: "none" })).toBe("cover")
  })

  test("falls back unknown background presets", () => {
    expect(getBackgroundPreset("missing").id).toBe("aurora")
  })
})
