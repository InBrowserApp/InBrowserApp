import { describe, expect, it } from 'vitest'
import type { ArchiveEntry } from '../types'
import { buildRowIndex, buildRows, getRowsForDirectory } from './archive-explorer-rows'

describe('archive explorer row index', () => {
  it('indexes rows per directory without rescanning the full archive tree', () => {
    const entries: ArchiveEntry[] = [
      {
        path: 'docs/readme.txt',
        kind: 'file',
        size: 10,
        compressedSize: 5,
        modifiedAt: null,
        extension: 'txt',
      },
      {
        path: 'docs/nested/guide.md',
        kind: 'file',
        size: 20,
        compressedSize: 9,
        modifiedAt: null,
        extension: 'md',
      },
      {
        path: 'images/logo.png',
        kind: 'file',
        size: 30,
        compressedSize: 12,
        modifiedAt: null,
        extension: 'png',
      },
    ]

    const index = buildRowIndex(entries)

    expect(getRowsForDirectory(index, '').map((row) => row.path)).toEqual(['docs/', 'images/'])
    expect(getRowsForDirectory(index, 'docs/').map((row) => row.path)).toEqual([
      'docs/nested/',
      'docs/readme.txt',
    ])
    expect(getRowsForDirectory(index, 'docs/nested/').map((row) => row.path)).toEqual([
      'docs/nested/guide.md',
    ])
    expect(buildRows(entries, 'images/').map((row) => row.path)).toEqual(['images/logo.png'])
  })

  it('prefers actual directory metadata over synthetic parent rows', () => {
    const modifiedAt = new Date('2024-02-01T10:00:00.000Z')
    const entries: ArchiveEntry[] = [
      {
        path: 'docs/readme.txt',
        kind: 'file',
        size: 10,
        compressedSize: 5,
        modifiedAt: null,
        extension: 'txt',
      },
      {
        path: 'docs/',
        kind: 'directory',
        size: 0,
        compressedSize: null,
        modifiedAt,
        extension: '',
      },
    ]

    const [docsRow] = getRowsForDirectory(buildRowIndex(entries), '')

    expect(docsRow?.path).toBe('docs/')
    expect(docsRow?.modifiedAt).toEqual(modifiedAt)
  })
})
