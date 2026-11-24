import { describe, expect, it } from "vitest"

import { prepareInput, writeMask } from "./mask"

describe("prepareInput", () => {
  it("normalizes RGB by the image peak in the model's planar channel order", () => {
    const input = prepareInput(
      new Uint8ClampedArray([128, 64, 0, 255, 0, 128, 64, 127])
    )
    const expected = [
      (1 - 0.485) / 0.229,
      -0.485 / 0.229,
      (0.5 - 0.456) / 0.224,
      (1 - 0.456) / 0.224,
      -0.406 / 0.225,
      (0.5 - 0.406) / 0.225,
    ]

    expect(input).toHaveLength(expected.length)
    expected.forEach((value, index) => expect(input[index]).toBeCloseTo(value))
  })

  it("produces finite values for an all-black image", () => {
    expect([...prepareInput(new Uint8ClampedArray([0, 0, 0, 255]))]).toEqual([
      Math.fround(-0.485 / 0.229),
      Math.fround(-0.456 / 0.224),
      Math.fround(-0.406 / 0.225),
    ])
  })
})

describe("writeMask", () => {
  it("makes the background transparent while preserving intermediate alpha", () => {
    const rgba = new Uint8ClampedArray(12)
    writeMask(new Float32Array([0.25, 0.5, 0.75]), rgba)
    expect([rgba[3], rgba[7], rgba[11]]).toEqual([0, 128, 255])
  })

  it("keeps a constant prediction meaningful without dividing by zero", () => {
    const rgba = new Uint8ClampedArray(8)
    writeMask(new Float32Array([0.5, 0.5]), rgba)
    expect([rgba[3], rgba[7]]).toEqual([128, 128])
  })
})
