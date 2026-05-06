import type { BackgroundPreset } from "./themes"

type BackgroundConfig =
  | Readonly<{ type: "preset"; preset: BackgroundPreset }>
  | Readonly<{ type: "solid"; color: string }>
  | Readonly<{ type: "none" }>
  | Readonly<{ type: "transparent" }>

type SvgBackground = Readonly<{
  defs: string
  fill: string
}>

const buildGradientStops = (colors: readonly string[]): string => {
  const step = colors.length > 1 ? 100 / (colors.length - 1) : 100

  return colors
    .map(
      (color, index) =>
        `<stop offset="${index * step}%" stop-color="${color}"/>`
    )
    .join("")
}

const resolveBackgroundCss = (background: BackgroundConfig): string => {
  if (background.type === "none") {
    return "none"
  }

  if (background.type === "transparent") {
    return "transparent"
  }

  if (background.type === "solid") {
    return background.color
  }

  const { preset } = background
  const colors = preset.colors.join(", ")

  if (preset.type === "radial") {
    const focus = preset.focus ?? { x: 0.2, y: 0.2 }
    return `radial-gradient(circle at ${focus.x * 100}% ${focus.y * 100}%, ${colors})`
  }

  return `linear-gradient(${preset.angle ?? 135}deg, ${colors})`
}

const resolveBackgroundSvg = (background: BackgroundConfig): SvgBackground => {
  if (background.type === "none" || background.type === "transparent") {
    return { defs: "", fill: "none" }
  }

  if (background.type === "solid") {
    return { defs: "", fill: background.color }
  }

  const { preset } = background

  if (preset.type === "radial") {
    const focus = preset.focus ?? { x: 0.2, y: 0.2 }

    return {
      defs: `<radialGradient id="bgGradient" cx="${focus.x}" cy="${focus.y}" r="0.9">${buildGradientStops(
        preset.colors
      )}</radialGradient>`,
      fill: "url(#bgGradient)",
    }
  }

  const angle = (preset.angle ?? 135) - 90
  const radians = (angle * Math.PI) / 180
  const x = Math.cos(radians)
  const y = Math.sin(radians)
  const x1 = 0.5 - x / 2
  const y1 = 0.5 - y / 2
  const x2 = 0.5 + x / 2
  const y2 = 0.5 + y / 2

  return {
    defs: `<linearGradient id="bgGradient" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${buildGradientStops(
      preset.colors
    )}</linearGradient>`,
    fill: "url(#bgGradient)",
  }
}

const getBackgroundPreviewCss = (background: BackgroundConfig): string => {
  if (background.type === "transparent") {
    return "linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)"
  }

  return resolveBackgroundCss(background)
}

const getBackgroundPreviewSize = (background: BackgroundConfig): string =>
  background.type === "transparent" ? "20px 20px" : "cover"

export {
  getBackgroundPreviewCss,
  getBackgroundPreviewSize,
  resolveBackgroundCss,
  resolveBackgroundSvg,
}
export type { BackgroundConfig }
