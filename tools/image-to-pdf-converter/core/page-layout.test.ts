import { describe, expect, test } from "vitest"

import {
  getBasePageDimensions,
  getImagePlacement,
  mmToPt,
  resolvePageDimensions,
} from "./page-layout"

describe("image-to-pdf page layout", () => {
  test("converts millimeters to PDF points", () => {
    expect(mmToPt(25.4)).toBeCloseTo(72)
  })

  test("returns dimensions for known page presets", () => {
    expect(getBasePageDimensions("a4")).toEqual({
      width: 595.28,
      height: 841.89,
    })
    expect(getBasePageDimensions("letter")).toEqual({
      width: 612,
      height: 792,
    })
  })

  test("resolves explicit and automatic orientation", () => {
    expect(resolvePageDimensions("a4", "portrait", 1200, 800)).toEqual({
      width: 595.28,
      height: 841.89,
    })
    expect(resolvePageDimensions("a4", "landscape", 800, 1200)).toEqual({
      width: 841.89,
      height: 595.28,
    })
    expect(resolvePageDimensions("a4", "auto", 1200, 800)).toEqual({
      width: 841.89,
      height: 595.28,
    })
    expect(resolvePageDimensions("a4", "auto", 800, 1200)).toEqual({
      width: 595.28,
      height: 841.89,
    })
  })

  test("places images using contain and cover fit modes", () => {
    expect(
      getImagePlacement({
        page: { width: 200, height: 100 },
        imageWidth: 100,
        imageHeight: 100,
        marginPt: 10,
        fitMode: "contain",
      })
    ).toEqual({
      x: 60,
      y: 10,
      width: 80,
      height: 80,
    })

    expect(
      getImagePlacement({
        page: { width: 200, height: 100 },
        imageWidth: 100,
        imageHeight: 100,
        marginPt: 10,
        fitMode: "cover",
      })
    ).toEqual({
      x: 10,
      y: -40,
      width: 180,
      height: 180,
    })
  })

  test("keeps placement finite for tiny content areas", () => {
    expect(
      getImagePlacement({
        page: { width: 10, height: 10 },
        imageWidth: 0,
        imageHeight: 0,
        marginPt: 10,
        fitMode: "contain",
      })
    ).toEqual({
      x: 5,
      y: 5,
      width: 0,
      height: 0,
    })
  })
})
