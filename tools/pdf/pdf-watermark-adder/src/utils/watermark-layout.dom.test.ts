import { describe, expect, it } from 'vitest'
import {
  calculateLineHeight,
  calculateTextBlockHeight,
  getRotatedBounds,
  resolveTilePreset,
  resolveWatermarkPlacement,
  resolveWatermarkPlacements,
  rotatePoint,
  WATERMARK_TILE_PRESETS,
} from './watermark-layout'

describe('watermark-layout', () => {
  it('rotates points around the local origin', () => {
    const point = rotatePoint(10, 0, 90)
    expect(point.x).toBeCloseTo(0, 6)
    expect(point.y).toBeCloseTo(10, 6)
  })

  it('computes rotated bounds for rectangles', () => {
    const bounds = getRotatedBounds(100, 40, 90)
    expect(bounds.width).toBeCloseTo(40, 6)
    expect(bounds.height).toBeCloseTo(100, 6)
  })

  it('places a centered watermark within page bounds', () => {
    const placement = resolveWatermarkPlacement({
      pageWidth: 600,
      pageHeight: 800,
      boxWidth: 240,
      boxHeight: 60,
      position: 'center',
      offsetX: 0,
      offsetY: 0,
      rotation: -35,
    })

    expect(placement.left).toBeGreaterThanOrEqual(0)
    expect(placement.bottom).toBeGreaterThanOrEqual(0)
    expect(placement.left + placement.bounds.width).toBeLessThanOrEqual(600)
    expect(placement.bottom + placement.bounds.height).toBeLessThanOrEqual(800)
  })

  it('clamps out-of-bounds offsets back into the page', () => {
    const placement = resolveWatermarkPlacement({
      pageWidth: 300,
      pageHeight: 300,
      boxWidth: 120,
      boxHeight: 40,
      position: 'bottom-right',
      offsetX: 999,
      offsetY: -999,
      rotation: 0,
    })

    expect(placement.left + placement.bounds.width).toBeLessThanOrEqual(300)
    expect(placement.bottom).toBeGreaterThanOrEqual(0)
  })

  it('computes multi-line text block height consistently', () => {
    const lineHeight = calculateLineHeight(48)
    const height = calculateTextBlockHeight(3, 48, lineHeight)

    expect(lineHeight).toBe(57.599999999999994)
    expect(height).toBe(163.2)
  })

  it('creates multiple tiled placements that cover the page', () => {
    const placements = resolveWatermarkPlacements({
      pageWidth: 600,
      pageHeight: 800,
      boxWidth: 240,
      boxHeight: 60,
      position: 'center',
      offsetX: 0,
      offsetY: 0,
      rotation: -35,
      layoutMode: 'tile',
      tileGapX: WATERMARK_TILE_PRESETS.medium.gapX,
      tileGapY: WATERMARK_TILE_PRESETS.medium.gapY,
    })

    expect(placements.length).toBeGreaterThan(6)
    expect(placements.some((placement) => placement.left <= 0)).toBe(true)
    expect(placements.some((placement) => placement.bottom <= 0)).toBe(true)
    expect(placements.some((placement) => placement.left + placement.bounds.width >= 600)).toBe(
      true,
    )
    expect(placements.some((placement) => placement.bottom + placement.bounds.height >= 800)).toBe(
      true,
    )
  })

  it('matches tile presets from the configured spacing values', () => {
    expect(
      resolveTilePreset(WATERMARK_TILE_PRESETS.sparse.gapX, WATERMARK_TILE_PRESETS.sparse.gapY),
    ).toBe('sparse')
    expect(
      resolveTilePreset(WATERMARK_TILE_PRESETS.medium.gapX, WATERMARK_TILE_PRESETS.medium.gapY),
    ).toBe('medium')
    expect(resolveTilePreset(41, 22)).toBe(null)
  })

  it('keeps dense small watermarks covering the full page', () => {
    const placements = resolveWatermarkPlacements({
      pageWidth: 612,
      pageHeight: 792,
      boxWidth: 24,
      boxHeight: 8,
      position: 'center',
      offsetX: 0,
      offsetY: 0,
      rotation: -35,
      layoutMode: 'tile',
      tileGapX: WATERMARK_TILE_PRESETS.dense.gapX,
      tileGapY: WATERMARK_TILE_PRESETS.dense.gapY,
    })

    expect(placements.length).toBeGreaterThan(500)
    expect(placements.some((placement) => placement.left + placement.bounds.width >= 612)).toBe(
      true,
    )
    expect(placements.some((placement) => placement.bottom + placement.bounds.height >= 792)).toBe(
      true,
    )
  })
})
