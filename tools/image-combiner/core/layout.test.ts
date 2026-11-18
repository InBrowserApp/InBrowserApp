import { describe, expect, it } from "vitest"

import { composeLayout, outputIsTooLarge } from "./layout"

const landscape = { width: 400, height: 200 }
const portrait = { width: 120, height: 240 }
const square = { width: 80, height: 80 }
const images = [landscape, portrait, square]
const defaults = { gap: 10, columns: 2, match: null }

describe("image composition geometry", () => {
  it("centers original-sized images along a horizontal strip without outer spacing", () => {
    expect(
      composeLayout(images, { ...defaults, layout: "horizontal" })
    ).toEqual({
      width: 620,
      height: 240,
      placements: [
        { ...landscape, x: 0, y: 20 },
        { ...portrait, x: 410, y: 0 },
        { ...square, x: 540, y: 80 },
      ],
    })
  })

  it("centers original-sized images along a vertical strip in input order", () => {
    expect(
      composeLayout([portrait, landscape], { ...defaults, layout: "vertical" })
    ).toEqual({
      width: 400,
      height: 450,
      placements: [
        { ...portrait, x: 140, y: 0 },
        { ...landscape, x: 0, y: 250 },
      ],
    })
  })

  it("matches the chosen strip dimension while preserving each image's proportions", () => {
    expect(
      composeLayout([landscape, portrait], {
        ...defaults,
        layout: "horizontal",
        match: { height: 100 },
      })
    ).toEqual({
      width: 260,
      height: 100,
      placements: [
        { width: 200, height: 100, x: 0, y: 0 },
        { width: 50, height: 100, x: 210, y: 0 },
      ],
    })
    expect(
      composeLayout([landscape, portrait], {
        ...defaults,
        layout: "vertical",
        match: {},
      })
    ).toEqual({
      width: 120,
      height: 310,
      placements: [
        { width: 120, height: 60, x: 0, y: 0 },
        { width: 120, height: 240, x: 0, y: 70 },
      ],
    })
  })

  it("lays out a grid with consistent cells and a partial final row", () => {
    expect(composeLayout(images, { ...defaults, layout: "grid" })).toEqual({
      width: 810,
      height: 490,
      placements: [
        { ...landscape, x: 0, y: 20 },
        { ...portrait, x: 550, y: 0 },
        { ...square, x: 160, y: 330 },
      ],
    })
    expect(
      composeLayout(images, { ...defaults, layout: "grid", match: {} })
    ).toEqual({
      width: 170,
      height: 170,
      placements: [
        { width: 80, height: 40, x: 0, y: 20 },
        { width: 40, height: 80, x: 110, y: 0 },
        { ...square, x: 0, y: 90 },
      ],
    })
  })

  it("fits a custom grid cell, clips excess columns, and keeps thin images visible", () => {
    expect(
      composeLayout([{ width: 1, height: 900 }], {
        ...defaults,
        layout: "grid",
        columns: 6,
        match: { width: 50, height: 30 },
      })
    ).toEqual({
      width: 50,
      height: 30,
      placements: [{ width: 1, height: 30, x: 24, y: 0 }],
    })
  })

  it("has no placements for empty input", () => {
    expect(composeLayout([], { ...defaults, layout: "horizontal" })).toEqual({
      width: 0,
      height: 0,
      placements: [],
    })
  })

  it("checks the canvas area and both sides independently before export", () => {
    expect(outputIsTooLarge({ width: 8192, height: 8192 })).toBe(false)
    expect(outputIsTooLarge({ width: 8193, height: 8192 })).toBe(true)
    expect(outputIsTooLarge({ width: 16385, height: 1 })).toBe(true)
    expect(outputIsTooLarge({ width: 1, height: 16385 })).toBe(true)
  })
})
