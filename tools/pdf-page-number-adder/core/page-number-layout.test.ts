import { describe, expect, test } from "vitest"

import {
  buildPageNumberLabel,
  resolvePageNumberCoordinates,
} from "./page-number-layout"

describe("page number layout", () => {
  test("builds page labels", () => {
    expect(buildPageNumberLabel(0, 10, 1, "number")).toBe("1")
    expect(buildPageNumberLabel(2, 10, 4, "number-total")).toBe("6/10")
  })

  test("resolves left, center, right, top, and clamped coordinates", () => {
    expect(
      resolvePageNumberCoordinates({
        fontSize: 12,
        marginX: 24,
        marginY: 30,
        pageHeight: 200,
        pageWidth: 100,
        position: "bottom-left",
        textWidth: 20,
      })
    ).toEqual({ x: 24, y: 30 })

    expect(
      resolvePageNumberCoordinates({
        fontSize: 12,
        marginX: 24,
        marginY: 30,
        pageHeight: 200,
        pageWidth: 100,
        position: "top-center",
        textWidth: 20,
      })
    ).toEqual({ x: 40, y: 158 })

    expect(
      resolvePageNumberCoordinates({
        fontSize: 12,
        marginX: 24,
        marginY: 30,
        pageHeight: 200,
        pageWidth: 100,
        position: "bottom-right",
        textWidth: 20,
      })
    ).toEqual({ x: 56, y: 30 })

    expect(
      resolvePageNumberCoordinates({
        fontSize: 20,
        marginX: 80,
        marginY: 50,
        pageHeight: 40,
        pageWidth: 30,
        position: "top-right",
        textWidth: 40,
      })
    ).toEqual({ x: 0, y: 0 })
  })
})
