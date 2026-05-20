import { describe, expect, test } from "vitest"

import { createLosslessImg2WebpArgs } from "./img2webp-encoder"

describe("createLosslessImg2WebpArgs", () => {
  test("uses lossless min-size animation options", () => {
    expect(
      createLosslessImg2WebpArgs(
        ["/frame-0.png", "/frame-1.png"],
        [80, 120],
        0,
        "/out.webp"
      )
    ).toEqual([
      "-min_size",
      "-loop",
      "0",
      "-lossless",
      "-q",
      "100",
      "-m",
      "6",
      "-d",
      "80",
      "/frame-0.png",
      "-d",
      "120",
      "/frame-1.png",
      "-o",
      "/out.webp",
    ])
  })

  test("normalizes durations and loop counts for img2webp", () => {
    expect(
      createLosslessImg2WebpArgs(["/frame.png"], [0], -1, "/out.webp")
    ).toEqual([
      "-min_size",
      "-loop",
      "0",
      "-lossless",
      "-q",
      "100",
      "-m",
      "6",
      "-d",
      "1",
      "/frame.png",
      "-o",
      "/out.webp",
    ])
  })

  test("uses the default frame duration when no delay is provided", () => {
    expect(
      createLosslessImg2WebpArgs(["/frame.png"], [], 0, "/out.webp")
    ).toContain("100")
  })
})
