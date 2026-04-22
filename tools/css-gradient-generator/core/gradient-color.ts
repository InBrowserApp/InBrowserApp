import type { ColorFormat } from "./gradient-types"

let idSeed = 0

function createId(prefix = "id") {
  idSeed += 1
  return prefix + "-" + idSeed
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function normalizeHexColor(value: string) {
  const raw = value.replace(/^#/, "").trim()
  if (!/^[0-9a-fA-F]*$/.test(raw)) {
    return "#000000FF"
  }

  if (raw.length === 3) {
    return (
      "#" +
      raw
        .split("")
        .map((char) => char + char)
        .join("") +
      "FF"
    ).toUpperCase()
  }

  if (raw.length === 4) {
    return (
      "#" +
      raw
        .split("")
        .map((char) => char + char)
        .join("")
    ).toUpperCase()
  }

  if (raw.length === 6) {
    return ("#" + raw + "FF").toUpperCase()
  }

  if (raw.length >= 8) {
    return ("#" + raw.slice(0, 8)).toUpperCase()
  }

  return "#000000FF"
}

function hexToRgba(value: string) {
  const hex = normalizeHexColor(value).slice(1)

  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16),
    a: Number.parseInt(hex.slice(6, 8), 16) / 255,
  }
}

function formatAlpha(value: number) {
  return (Math.round(value * 1000) / 1000).toFixed(3).replace(/\.?0+$/, "")
}

function formatNumber(value: number) {
  return String(Math.round(value * 100) / 100).replace(/\.0+$/, "")
}

function formatColor(value: string, format: ColorFormat) {
  const hex = normalizeHexColor(value)
  if (format === "hex") {
    return hex.endsWith("FF") ? hex.slice(0, 7) : hex
  }

  const rgba = hexToRgba(hex)
  return (
    "rgba(" +
    rgba.r +
    ", " +
    rgba.g +
    ", " +
    rgba.b +
    ", " +
    formatAlpha(rgba.a) +
    ")"
  )
}

export {
  clamp,
  createId,
  formatColor,
  formatNumber,
  hexToRgba,
  normalizeHexColor,
}
