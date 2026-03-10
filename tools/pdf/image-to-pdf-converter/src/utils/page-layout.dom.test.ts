import { describe, expect, it } from 'vitest'
import { getImagePlacement, mmToPt, resolvePageDimensions } from './page-layout'

describe('mmToPt', () => {
  it('converts millimeters to PDF points', () => {
    expect(mmToPt(25.4)).toBeCloseTo(72)
    expect(mmToPt(12)).toBeCloseTo(34.0157, 3)
  })
})

describe('resolvePageDimensions', () => {
  it('keeps portrait pages in portrait mode', () => {
    expect(resolvePageDimensions('a4', 'portrait', 1600, 900)).toEqual({
      width: 595.28,
      height: 841.89,
    })
  })

  it('swaps dimensions in landscape mode', () => {
    expect(resolvePageDimensions('letter', 'landscape', 900, 1600)).toEqual({
      width: 792,
      height: 612,
    })
  })

  it('uses image aspect ratio in auto mode', () => {
    expect(resolvePageDimensions('a4', 'auto', 1600, 900)).toEqual({
      width: 841.89,
      height: 595.28,
    })
    expect(resolvePageDimensions('a4', 'auto', 900, 1600)).toEqual({
      width: 595.28,
      height: 841.89,
    })
  })
})

describe('getImagePlacement', () => {
  it('fits images inside the content box in contain mode', () => {
    const placement = getImagePlacement({
      page: { width: 600, height: 800 },
      imageWidth: 1000,
      imageHeight: 500,
      marginPt: 50,
      fitMode: 'contain',
    })

    expect(placement.x).toBeCloseTo(50)
    expect(placement.y).toBeCloseTo(275)
    expect(placement.width).toBeCloseTo(500)
    expect(placement.height).toBeCloseTo(250)
  })

  it('allows overflow in cover mode to fill the page', () => {
    const placement = getImagePlacement({
      page: { width: 600, height: 800 },
      imageWidth: 1000,
      imageHeight: 500,
      marginPt: 50,
      fitMode: 'cover',
    })

    expect(placement.x).toBeCloseTo(-400)
    expect(placement.y).toBeCloseTo(50)
    expect(placement.width).toBeCloseTo(1400)
    expect(placement.height).toBeCloseTo(700)
  })
})
