import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createImageZip } from './create-image-zip'

const addedEntries: Array<{ name: string; blob: Blob }> = []
const closeSpy = vi.fn(async () => undefined)
const getDataSpy = vi.fn(() => new Blob(['zip']))

vi.mock('@zip.js/zip.js', () => ({
  BlobReader: class {
    blob: Blob

    constructor(blob: Blob) {
      this.blob = blob
    }
  },
  BlobWriter: class {
    getData() {
      return getDataSpy()
    }
  },
  ZipWriter: class {
    async add(name: string, reader: { blob: Blob }) {
      addedEntries.push({ name, blob: reader.blob })
    }

    async close() {
      await closeSpy()
    }
  },
}))

describe('createImageZip', () => {
  beforeEach(() => {
    addedEntries.length = 0
    closeSpy.mockClear()
    getDataSpy.mockClear()
  })

  it('writes all entries and returns zip blob', async () => {
    const one = new Blob(['one'])
    const two = new Blob(['two'])

    const blob = await createImageZip([
      { name: 'doc-p1.png', blob: one },
      { name: 'doc-p2.png', blob: two },
    ])

    expect(addedEntries).toEqual([
      { name: 'doc-p1.png', blob: one },
      { name: 'doc-p2.png', blob: two },
    ])
    expect(closeSpy).toHaveBeenCalledOnce()
    expect(getDataSpy).toHaveBeenCalledOnce()
    expect(blob).toBeInstanceOf(Blob)
  })
})
