import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createImageToPdf, getJpegQuality, normalizeOutputFileName } from './image-to-pdf'
import type { ConverterOptions, ImageQueueItem } from '../types'

const pdfLibMocks = vi.hoisted(() => {
  const drawImageMock = vi.fn()
  const addPageMock = vi.fn(() => ({
    drawImage: drawImageMock,
  }))
  const embedJpgMock = vi.fn(async () => ({ id: 'image' }))
  const saveMock = vi.fn(async () => new Uint8Array([7, 8, 9]))
  const createMock = vi.fn(async () => ({
    addPage: addPageMock,
    embedJpg: embedJpgMock,
    save: saveMock,
  }))

  return {
    createMock,
    embedJpgMock,
    addPageMock,
    drawImageMock,
    saveMock,
  }
})

const imageFileMocks = vi.hoisted(() => ({
  renderImageToJpegMock: vi.fn(),
}))

vi.mock('pdf-lib', () => ({
  PDFDocument: {
    create: pdfLibMocks.createMock,
  },
}))

vi.mock('./image-file', () => ({
  renderImageToJpeg: (file: File, options: { rotation: number; quality: number }) =>
    imageFileMocks.renderImageToJpegMock(file, options),
}))

describe('normalizeOutputFileName', () => {
  it('normalizes whitespace, strips extension, and keeps pdf suffix', () => {
    expect(normalizeOutputFileName('  report.pdf  ')).toBe('report.pdf')
    expect(normalizeOutputFileName(' scan:/set ')).toBe('scan-set.pdf')
    expect(normalizeOutputFileName('   ')).toBe('images.pdf')
  })
})

describe('getJpegQuality', () => {
  it('maps presets to stable quality levels', () => {
    expect(getJpegQuality('best')).toBe(0.92)
    expect(getJpegQuality('balanced')).toBe(0.82)
    expect(getJpegQuality('small')).toBe(0.68)
  })
})

describe('createImageToPdf', () => {
  const options: ConverterOptions = {
    outputName: 'images',
    pageSize: 'a4',
    pageOrientation: 'auto',
    fitMode: 'contain',
    marginMm: 12,
    qualityPreset: 'balanced',
  }

  const items = [
    createQueueItem('photo-1.jpg', 1200, 800, 0),
    createQueueItem('photo-2.jpg', 900, 1400, 90),
  ] satisfies ImageQueueItem[]

  beforeEach(() => {
    pdfLibMocks.createMock.mockClear()
    pdfLibMocks.embedJpgMock.mockClear()
    pdfLibMocks.addPageMock.mockClear()
    pdfLibMocks.drawImageMock.mockClear()
    pdfLibMocks.saveMock.mockClear()
    imageFileMocks.renderImageToJpegMock.mockReset()
  })

  it('renders JPEG pages, places them, and reports progress', async () => {
    imageFileMocks.renderImageToJpegMock
      .mockResolvedValueOnce({
        bytes: new Uint8Array([1, 2, 3]).buffer,
        width: 1200,
        height: 800,
      })
      .mockResolvedValueOnce({
        bytes: new Uint8Array([4, 5, 6]).buffer,
        width: 1400,
        height: 900,
      })

    const progressUpdates: Array<{ completed: number; total: number }> = []
    const blob = await createImageToPdf({
      items,
      options,
      onProgress: (progress) => progressUpdates.push(progress),
    })

    expect(pdfLibMocks.createMock).toHaveBeenCalledTimes(1)
    expect(imageFileMocks.renderImageToJpegMock).toHaveBeenNthCalledWith(
      1,
      items[0]?.file,
      expect.objectContaining({ rotation: 0, quality: 0.82 }),
    )
    expect(imageFileMocks.renderImageToJpegMock).toHaveBeenNthCalledWith(
      2,
      items[1]?.file,
      expect.objectContaining({ rotation: 90, quality: 0.82 }),
    )

    expect(pdfLibMocks.embedJpgMock).toHaveBeenCalledTimes(2)
    expect(pdfLibMocks.addPageMock).toHaveBeenCalledTimes(2)
    expect(pdfLibMocks.drawImageMock).toHaveBeenCalledTimes(2)
    expect(pdfLibMocks.addPageMock).toHaveBeenNthCalledWith(1, [841.89, 595.28])
    expect(pdfLibMocks.addPageMock).toHaveBeenNthCalledWith(2, [841.89, 595.28])
    expect(progressUpdates).toEqual([
      { completed: 1, total: 2 },
      { completed: 2, total: 2 },
    ])
    expect(blob.type).toBe('application/pdf')
    expect(blob.size).toBeGreaterThan(0)
  })
})

function createQueueItem(
  name: string,
  width: number,
  height: number,
  rotation: ImageQueueItem['rotation'],
): ImageQueueItem {
  return {
    id: name,
    file: new File(['image'], name, { type: 'image/jpeg' }),
    name,
    size: 2048,
    previewUrl: `blob:${name}`,
    width,
    height,
    rotation,
  }
}
