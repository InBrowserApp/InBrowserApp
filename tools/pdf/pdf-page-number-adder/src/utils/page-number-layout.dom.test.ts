import { describe, expect, it } from 'vitest'
import { buildPageNumberLabel, resolvePageNumberCoordinates } from './page-number-layout'

describe('page-number-layout', () => {
  it('builds labels for both formats', () => {
    expect(buildPageNumberLabel(0, 3, 5, 'n')).toBe('5')
    expect(buildPageNumberLabel(2, 3, 5, 'n-total')).toBe('7/3')
  })

  it('resolves coordinates for left, center and right alignments', () => {
    expect(
      resolvePageNumberCoordinates({
        pageWidth: 400,
        pageHeight: 600,
        textWidth: 40,
        fontSize: 12,
        marginX: 20,
        marginY: 24,
        position: 'bottom-left',
      }),
    ).toEqual({ x: 20, y: 24 })

    expect(
      resolvePageNumberCoordinates({
        pageWidth: 400,
        pageHeight: 600,
        textWidth: 40,
        fontSize: 12,
        marginX: 20,
        marginY: 24,
        position: 'top-center',
      }),
    ).toEqual({ x: 180, y: 564 })

    expect(
      resolvePageNumberCoordinates({
        pageWidth: 400,
        pageHeight: 600,
        textWidth: 40,
        fontSize: 12,
        marginX: 20,
        marginY: 24,
        position: 'bottom-right',
      }),
    ).toEqual({ x: 340, y: 24 })
  })

  it('clamps coordinates to page bounds', () => {
    expect(
      resolvePageNumberCoordinates({
        pageWidth: 100,
        pageHeight: 100,
        textWidth: 40,
        fontSize: 20,
        marginX: 120,
        marginY: 90,
        position: 'bottom-left',
      }),
    ).toEqual({ x: 60, y: 80 })

    expect(
      resolvePageNumberCoordinates({
        pageWidth: 100,
        pageHeight: 100,
        textWidth: 150,
        fontSize: 80,
        marginX: 10,
        marginY: 30,
        position: 'top-right',
      }),
    ).toEqual({ x: 0, y: 0 })
  })
})
