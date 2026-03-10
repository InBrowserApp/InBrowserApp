import type {
  FitMode,
  ImagePlacement,
  PageDimensions,
  PageOrientation,
  PageSizePreset,
} from '../types'

const PT_PER_MM = 72 / 25.4

const pageDimensionsByPreset: Record<PageSizePreset, PageDimensions> = {
  a3: {
    width: 841.89,
    height: 1190.55,
  },
  a4: {
    width: 595.28,
    height: 841.89,
  },
  a5: {
    width: 419.53,
    height: 595.28,
  },
  b5: {
    width: 498.9,
    height: 708.66,
  },
  letter: {
    width: 612,
    height: 792,
  },
  legal: {
    width: 612,
    height: 1008,
  },
  tabloid: {
    width: 792,
    height: 1224,
  },
}

export function mmToPt(value: number) {
  return value * PT_PER_MM
}

export function getBasePageDimensions(pageSize: PageSizePreset): PageDimensions {
  return pageDimensionsByPreset[pageSize]
}

export function resolvePageDimensions(
  pageSize: PageSizePreset,
  orientation: PageOrientation,
  imageWidth: number,
  imageHeight: number,
): PageDimensions {
  const basePage = getBasePageDimensions(pageSize)

  if (orientation === 'portrait') {
    return basePage
  }

  if (orientation === 'landscape') {
    return {
      width: basePage.height,
      height: basePage.width,
    }
  }

  if (imageWidth > imageHeight) {
    return {
      width: basePage.height,
      height: basePage.width,
    }
  }

  return basePage
}

export function getImagePlacement({
  page,
  imageWidth,
  imageHeight,
  marginPt,
  fitMode,
}: {
  page: PageDimensions
  imageWidth: number
  imageHeight: number
  marginPt: number
  fitMode: FitMode
}): ImagePlacement {
  const contentWidth = Math.max(1, page.width - marginPt * 2)
  const contentHeight = Math.max(1, page.height - marginPt * 2)
  const widthScale = contentWidth / imageWidth
  const heightScale = contentHeight / imageHeight
  const scale =
    fitMode === 'cover' ? Math.max(widthScale, heightScale) : Math.min(widthScale, heightScale)
  const width = imageWidth * scale
  const height = imageHeight * scale

  return {
    x: (page.width - width) / 2,
    y: (page.height - height) / 2,
    width,
    height,
  }
}
