import { gzipSync } from 'node:zlib'
import { describe, expect, it, vi } from 'vitest'
import { __test__, detectArchiveFormat, openArchive } from './archive-open'
import type { ArchiveEntryKind } from '../types'

function writeString(target: Uint8Array, offset: number, length: number, value: string) {
  const bytes = new TextEncoder().encode(value)
  target.set(bytes.subarray(0, length), offset)
}

function writeOctal(target: Uint8Array, offset: number, length: number, value: number) {
  const octal = value.toString(8)
  const padded = octal.padStart(length - 1, '0')
  writeString(target, offset, length, `${padded}\0`)
}

function splitTarPath(path: string) {
  if (path.length <= 100) {
    return { name: path, prefix: '' }
  }

  const slashIndex = path.lastIndexOf('/')
  if (slashIndex <= 0) {
    throw new Error('Path too long without directory separator')
  }

  const prefix = path.slice(0, slashIndex)
  const name = path.slice(slashIndex + 1)
  if (prefix.length > 155 || name.length > 100) {
    throw new Error('Path too long for simple USTAR fixture')
  }

  return { name, prefix }
}

function createTarHeader(
  path: string,
  contentSize: number,
  typeFlag: string,
  mtime = 0,
): Uint8Array {
  const header = new Uint8Array(512)
  const { name, prefix } = splitTarPath(path)

  writeString(header, 0, 100, name)
  writeOctal(header, 100, 8, 0o644)
  writeOctal(header, 108, 8, 0)
  writeOctal(header, 116, 8, 0)
  writeOctal(header, 124, 12, contentSize)
  writeOctal(header, 136, 12, mtime)

  for (let index = 148; index < 156; index += 1) {
    header[index] = 0x20
  }

  writeString(header, 156, 1, typeFlag)
  writeString(header, 257, 6, 'ustar')
  writeString(header, 263, 2, '00')
  writeString(header, 345, 155, prefix)

  const checksum = header.reduce((total, byte) => total + byte, 0)
  const checksumOctal = checksum.toString(8).padStart(6, '0')
  writeString(header, 148, 8, `${checksumOctal}\0 `)

  return header
}

function concatChunks(chunks: Uint8Array[]): Uint8Array {
  const totalLength = chunks.reduce((total, chunk) => total + chunk.length, 0)
  const output = new Uint8Array(totalLength)
  let offset = 0
  for (const chunk of chunks) {
    output.set(chunk, offset)
    offset += chunk.length
  }
  return output
}

function toFileArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(bytes.length)
  copy.set(bytes)
  return copy.buffer
}

function toBlobPart(bytes: Uint8Array): ArrayBuffer {
  return toFileArrayBuffer(bytes)
}

function createTar(
  entries: Array<{ path: string; content?: string; kind?: ArchiveEntryKind }>,
): Uint8Array {
  const chunks: Uint8Array[] = []
  const encoder = new TextEncoder()

  for (const entry of entries) {
    const kind = entry.kind ?? 'file'
    const content = kind === 'file' ? encoder.encode(entry.content ?? '') : new Uint8Array(0)
    const typeFlag: '0' | '5' = kind === 'directory' ? '5' : '0'
    const normalizedPath =
      kind === 'directory' && !entry.path.endsWith('/') ? `${entry.path}/` : entry.path

    chunks.push(createTarHeader(normalizedPath, content.length, typeFlag, 1711929600))
    chunks.push(content)

    const paddingSize = Math.ceil(content.length / 512) * 512 - content.length
    if (paddingSize > 0) {
      chunks.push(new Uint8Array(paddingSize))
    }
  }

  chunks.push(new Uint8Array(1024))
  return concatChunks(chunks)
}

describe('detectArchiveFormat', () => {
  it('detects format from extension first', () => {
    expect(detectArchiveFormat('bundle.tar.gz', new Uint8Array())).toBe('tgz')
    expect(detectArchiveFormat('bundle.tgz', new Uint8Array())).toBe('tgz')
    expect(detectArchiveFormat('bundle.tar', new Uint8Array())).toBe('tar')
    expect(detectArchiveFormat('bundle.zip', new Uint8Array())).toBe('zip')
    expect(detectArchiveFormat('bundle.gz', new Uint8Array())).toBe('gz')
  })

  it('detects format from signatures', () => {
    expect(detectArchiveFormat('unknown.bin', new Uint8Array([0x50, 0x4b, 0x03, 0x04]))).toBe('zip')
    expect(detectArchiveFormat('unknown.bin', new Uint8Array([0x50, 0x4b, 0x05, 0x06]))).toBe('zip')
    expect(detectArchiveFormat('unknown.bin', new Uint8Array([0x50, 0x4b, 0x07, 0x08]))).toBe('zip')
    expect(detectArchiveFormat('unknown.bin', new Uint8Array([0x1f, 0x8b]))).toBe('gz')

    const tarProbe = new Uint8Array(300)
    tarProbe.set(new TextEncoder().encode('ustar'), 257)
    expect(detectArchiveFormat('unknown.bin', tarProbe)).toBe('tar')

    const sparseTarProbe = new Uint8Array(300)
    sparseTarProbe[257] = 117
    sparseTarProbe[258] = 115
    sparseTarProbe[259] = 116
    sparseTarProbe[260] = 97
    sparseTarProbe[261] = 114
    expect(detectArchiveFormat('unknown.bin', sparseTarProbe)).toBe('tar')
  })

  it('throws for unsupported archive format', () => {
    expect(() => detectArchiveFormat('hello.txt', new Uint8Array([1, 2, 3]))).toThrow(
      'Unsupported archive format',
    )
  })
})

describe('openArchive', () => {
  it('opens TAR archives and reads entries', async () => {
    const tarBytes = createTar([
      { path: 'docs', kind: 'directory' },
      { path: 'docs/readme.txt', content: 'hello tar' },
    ])
    const file = new File([toFileArrayBuffer(tarBytes)], 'sample.tar', {
      type: 'application/x-tar',
    })

    const handle = await openArchive(file)

    expect(handle.format).toBe('tar')
    expect(handle.entries.map((entry) => entry.path)).toEqual(['docs/', 'docs/readme.txt'])

    const readme = await handle.readEntry('docs/readme.txt')
    expect(await readme.text()).toBe('hello tar')

    await expect(handle.readEntry('docs/')).rejects.toThrow('Only files can be previewed')
    await handle.dispose()
  })

  it('opens GZ archives as single-file entries', async () => {
    const compressed = gzipSync(Buffer.from('hello gzip'))
    const file = new File([compressed], 'notes.txt.gz', { type: 'application/gzip' })

    const handle = await openArchive(file)

    expect(handle.format).toBe('gz')
    expect(handle.entries).toHaveLength(1)
    expect(handle.entries[0]?.path).toBe('notes.txt')

    const content = await handle.readEntry('notes.txt')
    expect(await content.text()).toBe('hello gzip')
  })

  it('opens TGZ archives and lists TAR entries', async () => {
    const tarBytes = createTar([{ path: 'bin/app.sh', content: '#!/bin/sh\necho ok\n' }])
    const tgzBytes = gzipSync(Buffer.from(tarBytes))
    const file = new File([tgzBytes], 'bundle.tgz', { type: 'application/gzip' })

    const handle = await openArchive(file)

    expect(handle.format).toBe('tgz')
    expect(handle.entries).toHaveLength(1)
    expect(handle.entries[0]?.path).toBe('bin/app.sh')

    const content = await handle.readEntry('bin/app.sh')
    expect(await content.text()).toContain('echo ok')
  })

  it('opens ZIP archives and reads file entries', async () => {
    const { BlobWriter, TextReader, ZipWriter } = await import('@zip.js/zip.js')

    const blobWriter = new BlobWriter()
    const zipWriter = new ZipWriter(blobWriter)
    await zipWriter.add('docs/readme.txt', new TextReader('hello zip'))
    await zipWriter.close()

    const blob = await blobWriter.getData()
    const file = new File([blob], 'sample.zip', { type: 'application/zip' })

    const handle = await openArchive(file)

    expect(handle.format).toBe('zip')
    expect(handle.entries).toHaveLength(1)
    expect(handle.entries[0]?.path).toBe('docs/readme.txt')

    const readme = await handle.readEntry('docs/readme.txt')
    expect(await readme.text()).toBe('hello zip')

    await expect(handle.readEntry('missing.txt')).rejects.toThrow('Archive entry not found')
    await handle.dispose()
  })
})

describe('archive-open helpers', () => {
  it('normalizes paths, joins segments, and strips suffixes', () => {
    expect(__test__.normalizeArchivePath('\\folder\\note.txt')).toBe('folder/note.txt')
    expect(__test__.normalizeArchivePath('./folder/note.txt')).toBe('folder/note.txt')
    expect(__test__.normalizeArchivePath('/folder/note.txt')).toBe('folder/note.txt')
    expect(__test__.normalizeArchivePath('..')).toBe('')

    expect(__test__.joinTarPath('', 'file.txt')).toBe('file.txt')
    expect(__test__.joinTarPath('docs', 'file.txt')).toBe('docs/file.txt')
    expect(__test__.stripSuffix('notes.txt.gz', '.gz')).toBe('notes.txt')
    expect(__test__.stripSuffix('notes.txt', '.gz')).toBe('notes.txt')
    expect(__test__.extractExtension('docs/file.TXT')).toBe('txt')
  })

  it('parses tar helper fields and entry kinds', () => {
    const header = new Uint8Array(512)
    writeString(header, 0, 100, 'demo.txt')
    writeString(header, 124, 12, '00000000011')
    writeString(header, 136, 12, '00000000000')

    expect(__test__.readTarString(header, 0, 100)).toBe('demo.txt')
    expect(__test__.readTarNumber(header, 124, 12)).toBe(9)
    expect(__test__.isZeroBlock(new Uint8Array(16))).toBe(true)
    expect(__test__.isZeroBlock(new Uint8Array([0, 1]))).toBe(false)

    expect(__test__.getTarEntryKind('5', 'folder/')).toBe('directory')
    expect(__test__.getTarEntryKind('2', 'link')).toBe('symlink')
    expect(__test__.getTarEntryKind('0', 'file.txt')).toBe('file')
    expect(__test__.getTarEntryKind('x', 'meta')).toBe('other')
  })

  it('parses PAX path and gzip headers', async () => {
    expect(__test__.parsePaxPath('24 path=folder/demo.txt\n')).toBe('folder/demo.txt')
    expect(__test__.parsePaxPath('12 size=9\n')).toBeNull()
    expect(__test__.stripTrailingNulls('name\0\0')).toBe('name')

    const compressed = gzipSync(Buffer.from('payload'))
    const file = new File([compressed], 'payload.gz')
    const header = await __test__.parseGzipHeader(file)

    expect(header.originalName).toBeNull()
    expect(header.modifiedAt === null || header.modifiedAt instanceof Date).toBe(true)

    await expect(__test__.parseGzipHeader(new File(['bad'], 'bad.gz'))).rejects.toThrow(
      'Invalid GZIP signature',
    )
  })

  it('detects signatures, dates, mime types, and sorting', () => {
    expect(__test__.isZipSignature(new Uint8Array([0x50, 0x4b, 0x03, 0x04]))).toBe(true)
    expect(__test__.isGzipSignature(new Uint8Array([0x1f, 0x8b]))).toBe(true)

    const tarProbe = new Uint8Array(300)
    tarProbe.set(new TextEncoder().encode('ustar'), 257)
    expect(__test__.isLikelyTar(tarProbe)).toBe(true)

    expect(__test__.toDate(0)).toBeNull()
    expect(__test__.toDate(1700000000)).toBeInstanceOf(Date)

    expect(__test__.guessMimeType('data.json')).toBe('application/json')
    expect(__test__.guessMimeType('data.bin')).toBe('application/octet-stream')

    const sorted = __test__.sortEntries([
      {
        path: 'z.txt',
        size: 1,
        compressedSize: null,
        kind: 'file',
        modifiedAt: null,
        extension: 'txt',
      },
      {
        path: 'a/',
        size: 0,
        compressedSize: null,
        kind: 'directory',
        modifiedAt: null,
        extension: '',
      },
    ])

    expect(sorted[0]?.path).toBe('a/')
    expect(sorted[1]?.path).toBe('z.txt')
  })

  it('indexes tar payload and ungzips content', async () => {
    const tarBytes = createTar([{ path: 'root/note.txt', content: 'abc' }])
    const indexed = __test__.indexTarEntries(tarBytes)

    expect(indexed).toHaveLength(1)
    expect(indexed[0]?.path).toBe('root/note.txt')
    expect(indexed[0]?.dataSize).toBe(3)

    const compressed = gzipSync(Buffer.from('abc'))
    const blob = await __test__.ungzip(new File([compressed], 'note.gz'))
    expect(await blob.text()).toBe('abc')
  })
})

describe('archive-open edge cases', () => {
  it('handles TAR long path and PAX path records', () => {
    const encoder = new TextEncoder()

    const longPath = 'very/long/path/that/should/win/over/header-name.txt'
    const longPathBytes = encoder.encode(`${longPath}\0`)

    const longLinkHeader = createTarHeader('LONGNAME', longPathBytes.length, 'L')
    const longLinkPadding = new Uint8Array(
      Math.ceil(longPathBytes.length / 512) * 512 - longPathBytes.length,
    )

    const content = encoder.encode('hello')
    const fileHeader = createTarHeader('fallback.txt', content.length, '0')
    const filePadding = new Uint8Array(Math.ceil(content.length / 512) * 512 - content.length)

    const paxPayload = encoder.encode('28 path=from-pax/entry.txt\n')
    const paxHeader = createTarHeader('PAX', paxPayload.length, 'x')
    const paxPadding = new Uint8Array(Math.ceil(paxPayload.length / 512) * 512 - paxPayload.length)

    const paxFileContent = encoder.encode('ok')
    const paxFileHeader = createTarHeader('ignored.txt', paxFileContent.length, '\0')
    const paxFilePadding = new Uint8Array(
      Math.ceil(paxFileContent.length / 512) * 512 - paxFileContent.length,
    )

    const tarBytes = concatChunks([
      longLinkHeader,
      longPathBytes,
      longLinkPadding,
      fileHeader,
      content,
      filePadding,
      paxHeader,
      paxPayload,
      paxPadding,
      paxFileHeader,
      paxFileContent,
      paxFilePadding,
      new Uint8Array(1024),
    ])

    const entries = __test__.indexTarEntries(tarBytes)

    expect(entries.map((entry) => entry.path)).toEqual([longPath, 'from-pax/entry.txt'])
  })

  it('handles gzip header flags and missing decompressor support', async () => {
    const encoder = new TextEncoder()
    const headerParts: Uint8Array[] = []

    const flags = 0x04 | 0x08 | 0x10 | 0x02
    headerParts.push(new Uint8Array([0x1f, 0x8b, 0x08, flags, 0x01, 0x00, 0x00, 0x00, 0x00, 0x03]))
    headerParts.push(new Uint8Array([0x02, 0x00]))
    headerParts.push(new Uint8Array([0xaa, 0xbb]))
    headerParts.push(encoder.encode('named-file.txt\0'))
    headerParts.push(encoder.encode('comment\0'))
    headerParts.push(new Uint8Array([0x00, 0x00]))

    const headerOnlyFile = new File([toBlobPart(concatChunks(headerParts))], 'meta.gz')
    const parsed = await __test__.parseGzipHeader(headerOnlyFile)

    expect(parsed.originalName).toBe('named-file.txt')
    expect(parsed.modifiedAt).toBeInstanceOf(Date)

    const originalDecompressionStream = globalThis.DecompressionStream
    Object.defineProperty(globalThis, 'DecompressionStream', {
      configurable: true,
      value: undefined,
    })

    await expect(
      __test__.ungzip(new File([toBlobPart(new Uint8Array([0x1f, 0x8b]))], 'x.gz')),
    ).rejects.toThrow('This browser does not support GZIP decompression.')

    Object.defineProperty(globalThis, 'DecompressionStream', {
      configurable: true,
      value: originalDecompressionStream,
    })
  })

  it('parses gzip header without reading full file buffer', async () => {
    const encoder = new TextEncoder()
    const headerParts: Uint8Array[] = []
    const flags = 0x08

    headerParts.push(new Uint8Array([0x1f, 0x8b, 0x08, flags, 0x01, 0x00, 0x00, 0x00, 0x00, 0x03]))
    headerParts.push(encoder.encode('huge.txt\0'))

    const largePayload = new Uint8Array(1024 * 1024)
    const blob = new Blob([toBlobPart(concatChunks(headerParts)), toBlobPart(largePayload)])

    const arrayBuffer = vi.fn(async () => {
      throw new Error('should not read full file arrayBuffer')
    })
    const slice = vi.fn((start?: number, end?: number) => blob.slice(start, end))

    const fileLike = {
      size: blob.size,
      arrayBuffer,
      slice,
    } as unknown as File

    const parsed = await __test__.parseGzipHeader(fileLike)

    expect(parsed.originalName).toBe('huge.txt')
    expect(arrayBuffer).not.toHaveBeenCalled()
    expect(slice).toHaveBeenCalled()

    const maxSliceEnd = Math.max(...slice.mock.calls.map(([, end]) => Number(end)))
    expect(maxSliceEnd).toBeLessThan(blob.size)
  })

  it('handles tar/gzip read errors and parser fallbacks', async () => {
    const tarBytes = createTar([{ path: 'one.txt', content: '1' }])
    const tarFile = new File([toFileArrayBuffer(tarBytes)], 'one.tar')
    const tarHandle = await openArchive(tarFile)

    await expect(tarHandle.readEntry('missing.txt')).rejects.toThrow('Archive entry not found')

    const gzBytes = gzipSync(Buffer.from('hello'))
    const gzFile = new File([gzBytes], 'single.gz')
    const gzHandle = await openArchive(gzFile)

    await expect(gzHandle.readEntry('not-single')).rejects.toThrow('Archive entry not found')

    const truncated = createTarHeader('bad.txt', 12, '0')
    expect(() => __test__.indexTarEntries(truncated)).toThrow(
      'Invalid TAR: truncated entry payload.',
    )

    expect(__test__.parsePaxPath('broken-line')).toBeNull()
    expect(__test__.parsePaxPath('12 invalid')).toBeNull()

    const header = new Uint8Array(16)
    writeString(header, 0, 8, 'bad')
    expect(__test__.readTarNumber(header, 0, 8)).toBe(0)

    expect(__test__.joinTarPath('prefix', '')).toBe('prefix')

    const sorted = __test__.sortEntries([
      {
        path: 'a-file.txt',
        size: 1,
        compressedSize: null,
        kind: 'file',
        modifiedAt: null,
        extension: 'txt',
      },
      {
        path: 'z-dir/',
        size: 0,
        compressedSize: null,
        kind: 'directory',
        modifiedAt: null,
        extension: '',
      },
    ])

    expect(sorted[0]?.kind).toBe('directory')

    const sortedNonDirectory = __test__.sortEntries([
      {
        path: 'a-link',
        size: 0,
        compressedSize: null,
        kind: 'symlink',
        modifiedAt: null,
        extension: '',
      },
      {
        path: 'b-other',
        size: 0,
        compressedSize: null,
        kind: 'other',
        modifiedAt: null,
        extension: '',
      },
    ])
    expect(sortedNonDirectory.map((item) => item.path)).toEqual(['a-link', 'b-other'])

    const sortedSameKind = __test__.sortEntries([
      {
        path: 'b-file.txt',
        size: 0,
        compressedSize: null,
        kind: 'file',
        modifiedAt: null,
        extension: 'txt',
      },
      {
        path: 'a-file.txt',
        size: 0,
        compressedSize: null,
        kind: 'file',
        modifiedAt: null,
        extension: 'txt',
      },
    ])
    expect(sortedSameKind.map((item) => item.path)).toEqual(['a-file.txt', 'b-file.txt'])
  })

  it('covers zip defaults and tar skip behavior', async () => {
    const { BlobWriter, TextReader, ZipWriter } = await import('@zip.js/zip.js')

    const blobWriter = new BlobWriter()
    const zipWriter = new ZipWriter(blobWriter)
    await zipWriter.add('folder/', undefined, { directory: true })
    await zipWriter.add('plain-name', new TextReader('x'))
    await zipWriter.close()

    const blob = await blobWriter.getData()
    const file = new File([blob], 'defaults.zip', { type: 'application/zip' })
    const handle = await openArchive(file)

    const folder = handle.entries.find((entry) => entry.path === 'folder/')
    if (!folder) {
      throw new Error('Missing folder entry')
    }
    expect(folder.kind).toBe('directory')
    expect(folder.size).toBe(0)
    expect(folder.compressedSize).toBe(0)
    expect(folder.modifiedAt instanceof Date).toBe(true)

    expect(await handle.readEntry('plain-name').then((value) => value.text())).toBe('x')

    const plain = handle.entries.find((entry) => entry.path === 'plain-name')
    if (!plain) {
      throw new Error('Missing plain-name entry')
    }
    expect(plain.size).toBe(1)
    expect(typeof plain.compressedSize).toBe('number')
    expect(plain.modifiedAt instanceof Date).toBe(true)

    await expect(handle.readEntry('folder/')).rejects.toThrow('Archive entry not found')
    await handle.dispose()

    const encoder = new TextEncoder()
    const emptyNameHeader = createTarHeader('./', 0, '0', 1711929600)
    const payload = encoder.encode('name=invalid')
    const globalPaxHeader = createTarHeader('PAXGLOBAL', payload.length, 'g', 1711929600)
    const globalPadding = new Uint8Array(Math.ceil(payload.length / 512) * 512 - payload.length)
    const tarBytes = concatChunks([
      emptyNameHeader,
      globalPaxHeader,
      payload,
      globalPadding,
      new Uint8Array(1024),
    ])
    expect(__test__.indexTarEntries(tarBytes)).toEqual([])

    const invalidNumberHeader = createTarHeader('invalid-number.txt', 0, '0', 1711929600)
    writeString(invalidNumberHeader, 124, 12, '\0')
    const invalidNumberTar = concatChunks([invalidNumberHeader, new Uint8Array(1024)])
    const invalidIndexed = __test__.indexTarEntries(invalidNumberTar)
    expect(invalidIndexed[0]?.dataSize).toBe(0)

    vi.doMock('@zip.js/zip.js', () => {
      class BlobReader {
        constructor(_file: File) {
          return
        }
      }

      class BlobWriter {
        constructor() {
          return
        }
      }

      class ZipReader {
        constructor(_reader: BlobReader) {
          return
        }

        async getEntries() {
          return [
            {
              filename: './',
              directory: false,
              uncompressedSize: undefined,
              compressedSize: undefined,
              lastModDate: undefined,
              async getData(_writer: unknown) {
                return new Blob(['ignored'])
              },
            },
            {
              filename: 'mock/file.txt',
              directory: false,
              uncompressedSize: undefined,
              compressedSize: undefined,
              lastModDate: undefined,
              async getData(_writer: unknown) {
                return new Blob(['ok'])
              },
            },
          ]
        }

        async close() {
          return
        }
      }

      return {
        BlobReader,
        BlobWriter,
        ZipReader,
      }
    })

    vi.resetModules()

    const { openArchive: mockedOpenArchive } = await import('./archive-open')
    const mockedZip = new File([toBlobPart(new Uint8Array([0x50, 0x4b, 0x03, 0x04]))], 'mock.zip')
    const mockedHandle = await mockedOpenArchive(mockedZip)
    const entry = mockedHandle.entries.find((item) => item.path === 'mock/file.txt')
    if (!entry) {
      throw new Error('Missing mocked entry')
    }
    expect(entry.size).toBe(0)
    expect(entry.compressedSize).toBeNull()
    expect(entry.modifiedAt).toBeNull()

    vi.doUnmock('@zip.js/zip.js')
    vi.resetModules()
  })

  it('covers gzip fallback naming and header defaults', async () => {
    const compressed = gzipSync(Buffer.from('payload'))
    const blankNameGz = new File([compressed], '.gz')
    const handle = await openArchive(blankNameGz)

    expect(handle.format).toBe('gz')
    expect(handle.entries[0]?.path).toBe('archive.bin')
    expect(handle.entries[0]?.extension).toBe('bin')
    await handle.dispose()

    const bytes = new Uint8Array([0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03])
    const parsed = await __test__.parseGzipHeader(new File([toBlobPart(bytes)], 'tiny.gz'))
    expect(parsed.originalName).toBeNull()
    expect(parsed.modifiedAt).toBeNull()

    const explicitExtraHeader = new Uint8Array([
      0x1f, 0x8b, 0x08, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00,
    ])
    const parsedExtra = await __test__.parseGzipHeader(
      new File([toBlobPart(explicitExtraHeader)], 'extra.gz'),
    )
    expect(parsedExtra.originalName).toBeNull()

    const minimalHeader = new Uint8Array([0x1f, 0x8b])
    const parsedMinimal = await __test__.parseGzipHeader(
      new File([toBlobPart(minimalHeader)], 'minimal.gz'),
    )
    expect(parsedMinimal.originalName).toBeNull()
    expect(parsedMinimal.modifiedAt).toBeNull()

    const shortHeader = new Uint8Array([0x1f, 0x8b, 0x08, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03])
    const parsedShort = await __test__.parseGzipHeader(
      new File([toBlobPart(shortHeader)], 'short.gz'),
    )
    expect(parsedShort.modifiedAt).toBeNull()
  })
})
