import { describe, expect, test } from "vitest"

import { createLosslessGif2WebpArgs } from "./gif2webp-encoder"

describe("createLosslessGif2WebpArgs", () => {
  test("enables lossless minimum-size gif2webp output", () => {
    expect(createLosslessGif2WebpArgs("/input.gif", "/output.webp")).toEqual([
      "-quiet",
      "-min_size",
      "-q",
      "100",
      "-m",
      "6",
      "-metadata",
      "none",
      "/input.gif",
      "-o",
      "/output.webp",
    ])
  })
})
