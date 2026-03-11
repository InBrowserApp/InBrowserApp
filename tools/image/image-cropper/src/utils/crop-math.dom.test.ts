import { describe, expect, it } from 'vitest'
import {
  clampCropRect,
  createInitialCropRect,
  moveCropRect,
  moveCropRectByPixels,
  normalizedRectToPixels,
  resizeCropRect,
  setCropRatioKeepingCenter,
} from './crop-math'
import type { ImageSource } from '../types'

const source: ImageSource = {
  file: new File(['image'], 'sample.png', { type: 'image/png' }),
  width: 400,
  height: 200,
  mimeType: 'image/png',
  extension: 'png',
  hasAlpha: true,
}

describe('crop math', () => {
  it('creates centered initial crop rectangles for freeform and fixed ratios', () => {
    expect(createInitialCropRect(source, null)).toEqual({
      x: 0.06,
      y: 0.06,
      width: 0.88,
      height: 0.88,
    })

    expect(createInitialCropRect(source, 1)).toEqual({
      x: 0.28,
      y: 0.06,
      width: 0.44,
      height: 0.88,
    })

    expect(createInitialCropRect(source, 4)).toEqual({
      x: 0.06,
      y: 0.28,
      width: 0.88,
      height: 0.44,
    })
  })

  it('clamps crop rectangles to bounds and minimum size', () => {
    expect(clampCropRect({ x: -1, y: 0.9, width: 0.01, height: 2 }, source, null)).toEqual({
      x: 0,
      y: 0,
      width: 0.06,
      height: 1,
    })

    expect(clampCropRect({ x: 0.9, y: 0.9, width: 0.01, height: 0.01 }, source, 1)).toEqual({
      x: 0.9,
      y: 0.88,
      width: 0.06,
      height: 0.12,
    })

    expect(clampCropRect({ x: 0.8, y: 0.2, width: 1, height: 0.5 }, source, 0.5)).toEqual({
      x: 0.75,
      y: 0,
      width: 0.25,
      height: 1,
    })
  })

  it('moves crop rectangles in normalized and pixel coordinates without crossing bounds', () => {
    expect(moveCropRect({ x: 0.2, y: 0.3, width: 0.4, height: 0.4 }, 0.3, -0.5)).toEqual({
      x: 0.5,
      y: 0,
      width: 0.4,
      height: 0.4,
    })

    expect(
      moveCropRectByPixels({ x: 0.7, y: 0.5, width: 0.3, height: 0.5 }, 100, 60, source),
    ).toEqual({
      x: 0.7,
      y: 0.5,
      width: 0.3,
      height: 0.5,
    })
  })

  it('resizes freeform crop rectangles from edge and corner handles', () => {
    const baseRect = { x: 0.2, y: 0.2, width: 0.4, height: 0.4 }

    expect(resizeCropRect(baseRect, 'w', 0.1, 0, source, null)).toEqual({
      x: 0.30000000000000004,
      y: 0.2,
      width: 0.30000000000000004,
      height: 0.4000000000000001,
    })

    expect(resizeCropRect(baseRect, 'se', 0.2, 0.1, source, null)).toEqual({
      x: 0.2,
      y: 0.2,
      width: 0.6000000000000001,
      height: 0.5,
    })
  })

  it('resizes locked crop rectangles with ratio-preserving corner handles', () => {
    const squareSource: ImageSource = {
      ...source,
      width: 400,
      height: 400,
    }
    const rect = { x: 0.1, y: 0.1, width: 0.4, height: 0.4 }

    expect(resizeCropRect(rect, 'se', 0.2, 0.1, squareSource, 1)).toEqual({
      x: 0.1,
      y: 0.1,
      width: 0.6000000000000001,
      height: 0.6000000000000001,
    })

    expect(resizeCropRect(rect, 'n', 0, 0.2, squareSource, 1)).toEqual({
      x: 0.1,
      y: 0.30000000000000004,
      width: 0.4,
      height: 0.19999999999999996,
    })

    const resizedFromNorthWest = resizeCropRect(rect, 'nw', 0.1, 0.1, squareSource, 1)
    expect(resizedFromNorthWest.x).toBeCloseTo(0.2)
    expect(resizedFromNorthWest.y).toBeCloseTo(0.2)
    expect(resizedFromNorthWest.width).toBeCloseTo(0.3)
    expect(resizedFromNorthWest.height).toBeCloseTo(0.3)
  })

  it('converts normalized rectangles to pixels and applies new ratios around the center', () => {
    expect(normalizedRectToPixels({ x: 0.125, y: 0.255, width: 0.5, height: 0.4 }, source)).toEqual(
      {
        x: 50,
        y: 51,
        width: 200,
        height: 80,
      },
    )

    const ratioRect = setCropRatioKeepingCenter(
      { x: 0.7, y: 0.1, width: 0.25, height: 0.6 },
      source,
      16 / 9,
    )

    expect(ratioRect.x).toBeCloseTo(0.65)
    expect(ratioRect.y).toBeCloseTo(0.203125)
    expect(ratioRect.width).toBeCloseTo(0.35)
    expect(ratioRect.height).toBeCloseTo(0.39375)

    const unclampedRatioRect = setCropRatioKeepingCenter(
      { x: 0.2, y: 0.2, width: 0.2, height: 0.2 },
      source,
      1,
    )
    expect(unclampedRatioRect.x + unclampedRatioRect.width / 2).toBeCloseTo(0.3)
    expect(unclampedRatioRect.y + unclampedRatioRect.height / 2).toBeCloseTo(0.3)

    expect(
      setCropRatioKeepingCenter({ x: 0.9, y: -1, width: 0.2, height: 0.2 }, source, null),
    ).toEqual({
      x: 0.8,
      y: 0,
      width: 0.2,
      height: 0.2,
    })
  })
})
