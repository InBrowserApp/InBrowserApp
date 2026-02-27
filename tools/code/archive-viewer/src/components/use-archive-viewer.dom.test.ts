import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { useArchiveViewer } from './use-archive-viewer'
import * as browserApis from './archive-browser-apis'
import { openArchive } from '../utils/archive-open'
import type { ArchiveEntry, ArchiveHandle } from '../types'
import type { ArchiveRow } from './use-archive-viewer'
import * as naiveUi from 'naive-ui'

vi.mock('../utils/archive-open', () => ({
  openArchive: vi.fn(),
}))

const mockedOpenArchive = vi.mocked(openArchive)

function createArchiveHandle(entries: ArchiveEntry[], readBlob: Blob | Error): ArchiveHandle {
  const readEntry =
    readBlob instanceof Error
      ? vi.fn(async () => {
          throw readBlob
        })
      : vi.fn(async () => readBlob)

  const dispose = vi.fn(async () => undefined)

  return {
    format: 'zip',
    entries,
    readEntry,
    dispose,
  }
}

function createDeferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void

  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })

  return {
    promise,
    resolve,
    reject,
  }
}

type ViewerState = ReturnType<typeof useArchiveViewer>

function mountComposable(): { wrapper: ReturnType<typeof mount>; state: ViewerState } {
  let state: ViewerState | null = null
  const Harness = defineComponent({
    setup() {
      state = useArchiveViewer()
      return () => h('div')
    },
  })

  const wrapper = mount(Harness)
  if (!state) {
    throw new Error('Composable state not initialized')
  }

  return {
    wrapper,
    state: state as ViewerState,
  }
}

let createObjectUrlSpy: ReturnType<typeof vi.spyOn> | null = null
let revokeObjectUrlSpy: ReturnType<typeof vi.spyOn> | null = null

beforeEach(() => {
  mockedOpenArchive.mockReset()

  const url = URL as Partial<typeof URL>
  if (!url.createObjectURL) {
    Object.defineProperty(URL, 'createObjectURL', {
      value: vi.fn(() => 'blob:mock'),
      writable: true,
    })
  }

  if (!url.revokeObjectURL) {
    Object.defineProperty(URL, 'revokeObjectURL', {
      value: vi.fn(() => undefined),
      writable: true,
    })
  }

  createObjectUrlSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock')
  revokeObjectUrlSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)
})

afterEach(() => {
  createObjectUrlSpy?.mockRestore()
  revokeObjectUrlSpy?.mockRestore()
  createObjectUrlSpy = null
  revokeObjectUrlSpy = null
})

describe('useArchiveViewer', () => {
  it('filters rows and supports row selection', async () => {
    const { state } = mountComposable()

    state.entries.value = [
      {
        path: 'docs/a.txt',
        kind: 'file',
        size: 1,
        compressedSize: 1,
        modifiedAt: null,
        extension: 'txt',
      },
      {
        path: 'images/b.png',
        kind: 'file',
        size: 2,
        compressedSize: 1,
        modifiedAt: null,
        extension: 'png',
      },
    ]

    state.search.value = 'docs'
    expect(state.rows.value).toHaveLength(1)
    expect(state.rows.value[0]?.path).toBe('docs/')

    const directoryRow = state.rows.value[0]
    if (!directoryRow) {
      throw new Error('Missing docs directory row')
    }

    state.tableRowProps(directoryRow).onClick()
    await flushPromises()

    state.search.value = ''
    expect(state.rows.value).toHaveLength(1)
    expect(state.rows.value[0]?.path).toBe('docs/a.txt')

    const fileRow = state.rows.value[0]
    if (!fileRow) {
      throw new Error('Missing docs/a.txt row')
    }

    state.tableRowProps(fileRow).onClick()

    await flushPromises()
    expect(state.selectedEntry.value?.path).toBe('docs/a.txt')
    expect(state.downloadName.value).toBe('a.txt')
  })

  it('returns false when upload payload has no file', async () => {
    const { state } = mountComposable()

    const result = await state.handleBeforeUpload({
      file: { file: null } as never,
      fileList: [],
    })

    expect(result).toBe(false)
    expect(mockedOpenArchive).not.toHaveBeenCalled()
  })

  it('handles archive parse failures and non-Error values', async () => {
    mockedOpenArchive.mockRejectedValueOnce('boom')

    const { state } = mountComposable()

    const file = new File(['bad'], 'bad.zip')
    await state.handleBeforeUpload({ file: { file } as never, fileList: [{ file } as never] })
    await flushPromises()

    expect(state.errorMessage.value).toBe('Unable to parse archive.')
    expect(state.entries.value).toEqual([])
  })

  it('sets empty selection when archive has no file entries', async () => {
    const entries: ArchiveEntry[] = [
      {
        path: 'folder/',
        kind: 'directory',
        size: 0,
        compressedSize: null,
        modifiedAt: null,
        extension: '',
      },
    ]

    mockedOpenArchive.mockResolvedValueOnce(createArchiveHandle(entries, new Blob(['ignored'])))

    const { state } = mountComposable()

    const file = new File(['ok'], 'folder.zip')
    await state.handleBeforeUpload({ file: { file } as never, fileList: [{ file } as never] })
    await flushPromises()

    expect(state.selectedEntry.value).toBeNull()
  })

  it('handles large preview files and unsupported previews', async () => {
    const fileEntry: ArchiveEntry = {
      path: 'big.bin',
      kind: 'file',
      size: 1024,
      compressedSize: 100,
      modifiedAt: null,
      extension: 'bin',
    }

    const largeBlob = new Blob([new Uint8Array(1024 * 1024 + 1)], {
      type: 'application/octet-stream',
    })
    mockedOpenArchive.mockResolvedValueOnce(createArchiveHandle([fileEntry], largeBlob))

    const { state } = mountComposable()

    const file = new File(['ok'], 'big.zip')
    await state.handleBeforeUpload({ file: { file } as never, fileList: [{ file } as never] })
    await flushPromises()

    expect(state.previewKind.value).toBe('none')
    expect(state.previewText.value).toContain('Preview is limited to 1 MB')

    const unknownBlob = new Blob([new Uint8Array([1, 2, 3])], {
      type: 'application/octet-stream',
    })
    const secondEntry: ArchiveEntry = {
      ...fileEntry,
      path: 'small.bin',
      extension: 'bin',
    }
    mockedOpenArchive.mockResolvedValueOnce(createArchiveHandle([secondEntry], unknownBlob))

    const second = new File(['ok'], 'small.zip')
    await state.handleBeforeUpload({
      file: { file: second } as never,
      fileList: [{ file: second } as never],
    })
    await flushPromises()

    expect(state.previewKind.value).toBe('none')
    expect(state.previewText.value).toContain('Preview is not available')
  })

  it('handles preview read errors and clears state', async () => {
    const fileEntry: ArchiveEntry = {
      path: 'docs/config.json',
      kind: 'file',
      size: 2,
      compressedSize: 1,
      modifiedAt: null,
      extension: 'json',
    }

    const handle = createArchiveHandle([fileEntry], new Error('read failed'))
    mockedOpenArchive.mockResolvedValueOnce(handle)

    const { state } = mountComposable()

    const file = new File(['ok'], 'err.zip')
    await state.handleBeforeUpload({ file: { file } as never, fileList: [{ file } as never] })
    await flushPromises()

    expect(state.previewKind.value).toBe('none')
    expect(state.previewText.value).toBe('read failed')

    await state.clearFile()
    expect(state.entries.value).toEqual([])
    expect((handle.dispose as ReturnType<typeof vi.fn>).mock.calls.length).toBe(1)
  })

  it('falls back preview text for non-Error reads and supports directory navigation', async () => {
    const entries: ArchiveEntry[] = [
      {
        path: 'folder/',
        kind: 'directory',
        size: 0,
        compressedSize: null,
        modifiedAt: null,
        extension: '',
      },
      {
        path: 'data.bin',
        kind: 'file',
        size: 2,
        compressedSize: 1,
        modifiedAt: null,
        extension: 'bin',
      },
    ]

    const handle: ArchiveHandle = {
      format: 'zip',
      entries,
      readEntry: vi.fn(async () => {
        throw 'boom'
      }),
      dispose: vi.fn(async () => undefined),
    }
    mockedOpenArchive.mockResolvedValueOnce(handle)

    const { state } = mountComposable()

    const file = new File(['ok'], 'fallback.zip')
    await state.handleBeforeUpload({ file: { file } as never, fileList: [{ file } as never] })
    await flushPromises()

    expect(state.previewKind.value).toBe('none')
    expect(state.previewText.value).toContain('Preview is not available')

    const directoryRow = state.rows.value.find((row: ArchiveRow) => row.path === 'folder/')
    if (!directoryRow) {
      throw new Error('Missing directory row')
    }

    state.tableRowProps(directoryRow).onClick()
    await flushPromises()

    expect(state.selectedEntry.value?.path).toBe('data.bin')
    expect(state.rows.value).toHaveLength(0)
  })

  it('treats json mime as text preview', async () => {
    const fileEntry: ArchiveEntry = {
      path: 'payload.bin',
      kind: 'file',
      size: 14,
      compressedSize: 10,
      modifiedAt: null,
      extension: 'bin',
    }

    mockedOpenArchive.mockResolvedValueOnce(
      createArchiveHandle([fileEntry], new Blob(['{"ok":true}'], { type: 'application/json' })),
    )

    const { state } = mountComposable()

    const file = new File(['ok'], 'payload.zip')
    await state.handleBeforeUpload({ file: { file } as never, fileList: [{ file } as never] })
    await flushPromises()

    expect(state.previewKind.value).toBe('text')
    expect(state.previewText.value).toContain('"ok":true')
  })

  it('formats archive size summary and detects plist code language', async () => {
    const plistEntry: ArchiveEntry = {
      path: 'config.plist',
      kind: 'file',
      size: 20,
      compressedSize: 10,
      modifiedAt: null,
      extension: 'plist',
    }

    mockedOpenArchive.mockResolvedValueOnce(
      createArchiveHandle(
        [plistEntry],
        new Blob(['<plist><dict/></plist>'], { type: 'application/xml' }),
      ),
    )

    const { state } = mountComposable()

    const file = new File(['1234567890'], 'config.zip')
    await state.handleBeforeUpload({ file: { file } as never, fileList: [{ file } as never] })
    await flushPromises()

    expect(state.archiveSizeSummary.value).toBe('10 B / 20 B (50%)')
    expect(state.previewKind.value).toBe('text')
    expect(state.previewLanguage.value).toBe('xml')
    expect(state.previewText.value).toContain('<plist>')
  })

  it('ignores stale archive open results from earlier uploads', async () => {
    const firstEntries: ArchiveEntry[] = [
      {
        path: 'old.txt',
        kind: 'file',
        size: 3,
        compressedSize: 2,
        modifiedAt: null,
        extension: 'txt',
      },
    ]
    const secondEntries: ArchiveEntry[] = [
      {
        path: 'new.txt',
        kind: 'file',
        size: 3,
        compressedSize: 2,
        modifiedAt: null,
        extension: 'txt',
      },
    ]

    const firstHandle = createArchiveHandle(firstEntries, new Blob(['old']))
    const secondHandle = createArchiveHandle(secondEntries, new Blob(['new']))
    const deferredFirstOpen = createDeferred<ArchiveHandle>()

    mockedOpenArchive
      .mockImplementationOnce(async () => deferredFirstOpen.promise)
      .mockResolvedValueOnce(secondHandle)

    const { state } = mountComposable()

    const firstFile = new File(['first'], 'first.zip')
    const secondFile = new File(['second'], 'second.zip')

    const firstUpload = state.handleBeforeUpload({
      file: { file: firstFile } as never,
      fileList: [{ file: firstFile } as never],
    })

    await flushPromises()

    const secondUpload = state.handleBeforeUpload({
      file: { file: secondFile } as never,
      fileList: [{ file: secondFile } as never],
    })

    await secondUpload
    await flushPromises()

    deferredFirstOpen.resolve(firstHandle)
    await firstUpload
    await flushPromises()

    expect(state.archiveFile.value?.name).toBe('second.zip')
    expect(state.entries.value.map((entry) => entry.path)).toEqual(['new.txt'])
    expect(state.selectedEntry.value?.path).toBe('new.txt')
    expect((firstHandle.dispose as ReturnType<typeof vi.fn>).mock.calls.length).toBe(1)
    expect((secondHandle.dispose as ReturnType<typeof vi.fn>).mock.calls.length).toBe(0)
  })

  it('keeps latest preview when earlier preview resolves later', async () => {
    const entries: ArchiveEntry[] = [
      {
        path: 'a.txt',
        kind: 'file',
        size: 1,
        compressedSize: 1,
        modifiedAt: null,
        extension: 'txt',
      },
      {
        path: 'b.txt',
        kind: 'file',
        size: 1,
        compressedSize: 1,
        modifiedAt: null,
        extension: 'txt',
      },
    ]

    const deferredFirstPreview = createDeferred<Blob>()
    const readEntry = vi.fn(async (path: string) => {
      if (path === 'a.txt') {
        return deferredFirstPreview.promise
      }

      return new Blob(['second preview'], { type: 'text/plain' })
    })

    const handle: ArchiveHandle = {
      format: 'zip',
      entries,
      readEntry,
      dispose: vi.fn(async () => undefined),
    }

    mockedOpenArchive.mockResolvedValueOnce(handle)

    const { state } = mountComposable()

    const file = new File(['ok'], 'race.zip')
    await state.handleBeforeUpload({ file: { file } as never, fileList: [{ file } as never] })
    await flushPromises()

    expect(readEntry).toHaveBeenCalledWith('a.txt')

    const targetRow = state.rows.value.find((row) => row.path === 'b.txt')
    if (!targetRow) {
      throw new Error('Missing b.txt row')
    }

    state.tableRowProps(targetRow).onClick()
    await flushPromises()

    expect(state.selectedEntry.value?.path).toBe('b.txt')
    expect(state.previewKind.value).toBe('text')
    expect(state.previewText.value).toBe('second preview')

    deferredFirstPreview.resolve(new Blob(['first preview'], { type: 'text/plain' }))
    await flushPromises()

    expect(state.selectedEntry.value?.path).toBe('b.txt')
    expect(state.previewText.value).toBe('second preview')
  })

  it('disposes archive when component scope unmounts', async () => {
    const fileEntry: ArchiveEntry = {
      path: 'img.png',
      kind: 'file',
      size: 3,
      compressedSize: 2,
      modifiedAt: null,
      extension: 'png',
    }

    const handle = createArchiveHandle(
      [fileEntry],
      new Blob([new Uint8Array([1, 2, 3])], { type: 'image/png' }),
    )
    mockedOpenArchive.mockResolvedValueOnce(handle)

    const { state, wrapper } = mountComposable()

    const file = new File(['ok'], 'image.zip')
    await state.handleBeforeUpload({ file: { file } as never, fileList: [{ file } as never] })
    await flushPromises()

    expect(state.previewKind.value).toBe('image')

    wrapper.unmount()

    expect((handle.dispose as ReturnType<typeof vi.fn>).mock.calls.length).toBeGreaterThan(0)
  })

  it('closes preview modal and clears stale selection after entries update', async () => {
    const initialEntry: ArchiveEntry = {
      path: 'note.txt',
      kind: 'file',
      size: 4,
      compressedSize: 3,
      modifiedAt: null,
      extension: 'txt',
    }

    mockedOpenArchive.mockResolvedValueOnce(createArchiveHandle([initialEntry], new Blob(['note'])))

    const { state } = mountComposable()

    const file = new File(['ok'], 'modal.zip')
    await state.handleBeforeUpload({ file: { file } as never, fileList: [{ file } as never] })
    await flushPromises()

    const row = state.rows.value.find((item) => item.path === 'note.txt')
    if (!row) {
      throw new Error('Missing note.txt row')
    }

    state.tableRowProps(row).onClick()
    await flushPromises()

    expect(state.isPreviewModalVisible.value).toBe(true)

    state.closePreviewModal()
    expect(state.isPreviewModalVisible.value).toBe(false)

    state.entries.value = []
    await flushPromises()

    expect(state.selectedEntry.value).toBeNull()

    state.goToDirectory('missing/deep/path/')
    state.entries.value = [
      {
        path: 'root.txt',
        kind: 'file',
        size: 1,
        compressedSize: 1,
        modifiedAt: null,
        extension: 'txt',
      },
    ]
    await flushPromises()

    expect(state.rows.value).toHaveLength(0)
  })

  it('chooses another archive through browser picker api', async () => {
    const firstEntry: ArchiveEntry = {
      path: 'first.txt',
      kind: 'file',
      size: 5,
      compressedSize: 3,
      modifiedAt: null,
      extension: 'txt',
    }
    const secondEntry: ArchiveEntry = {
      path: 'next.txt',
      kind: 'file',
      size: 4,
      compressedSize: 2,
      modifiedAt: null,
      extension: 'txt',
    }

    const firstHandle = createArchiveHandle([firstEntry], new Blob(['first']))
    const secondHandle = createArchiveHandle([secondEntry], new Blob(['next']))

    mockedOpenArchive.mockResolvedValueOnce(firstHandle).mockResolvedValueOnce(secondHandle)

    const { state } = mountComposable()

    const firstFile = new File(['first'], 'first.zip')
    await state.handleBeforeUpload({
      file: { file: firstFile } as never,
      fileList: [{ file: firstFile } as never],
    })
    await flushPromises()

    const pickerSpy = vi.fn(async () => [
      {
        getFile: async () => new File(['next'], 'next.zip'),
      },
    ])

    Object.defineProperty(window, 'showOpenFilePicker', {
      configurable: true,
      writable: true,
      value: pickerSpy,
    })

    await state.chooseAnotherArchive()
    await flushPromises()

    expect(pickerSpy).toHaveBeenCalledTimes(1)
    expect(state.archiveFile.value?.name).toBe('next.zip')
    expect(state.selectedEntry.value?.path).toBe('next.txt')
    expect((firstHandle.dispose as ReturnType<typeof vi.fn>).mock.calls.length).toBe(1)
  })

  it('treats ico extension as image preview', async () => {
    const fileEntry: ArchiveEntry = {
      path: 'favicon.ico',
      kind: 'file',
      size: 4,
      compressedSize: 3,
      modifiedAt: null,
      extension: 'ico',
    }

    mockedOpenArchive.mockResolvedValueOnce(
      createArchiveHandle([fileEntry], new Blob([new Uint8Array([0, 0, 1, 0])])),
    )

    const { state } = mountComposable()

    const file = new File(['ok'], 'icon.zip')
    await state.handleBeforeUpload({ file: { file } as never, fileList: [{ file } as never] })
    await flushPromises()

    expect(state.previewKind.value).toBe('image')
  })

  it('exports all entries to a selected folder', async () => {
    const entries: ArchiveEntry[] = [
      {
        path: 'docs/',
        kind: 'directory',
        size: 0,
        compressedSize: null,
        modifiedAt: null,
        extension: '',
      },
      {
        path: 'docs/readme.txt',
        kind: 'file',
        size: 11,
        compressedSize: 9,
        modifiedAt: null,
        extension: 'txt',
      },
    ]

    const handle = createArchiveHandle(entries, new Blob(['hello world'], { type: 'text/plain' }))
    mockedOpenArchive.mockResolvedValueOnce(handle)

    const directoryHandle = {} as browserApis.DirectoryHandle
    const messageSuccessSpy = vi.fn()
    const useMessageSpy = vi
      .spyOn(naiveUi, 'useMessage')
      .mockReturnValue({ success: messageSuccessSpy } as never)
    const pickDirectorySpy = vi
      .spyOn(browserApis, 'pickDirectoryForExport')
      .mockResolvedValue(directoryHandle)
    const exportSpy = vi
      .spyOn(browserApis, 'exportArchiveEntriesToDirectory')
      .mockImplementation(async ({ onProgress }) => {
        onProgress?.({ completedFiles: 0, totalFiles: 1 })
        onProgress?.({ completedFiles: 1, totalFiles: 1 })
      })

    const { state } = mountComposable()

    const file = new File(['ok'], 'docs.zip')
    await state.handleBeforeUpload({ file: { file } as never, fileList: [{ file } as never] })
    await flushPromises()

    await state.exportAllEntries()
    await flushPromises()

    expect(pickDirectorySpy).toHaveBeenCalledTimes(1)
    expect(exportSpy).toHaveBeenCalledWith({
      directoryHandle,
      entries,
      readEntry: handle.readEntry,
      onProgress: expect.any(Function),
    })
    expect(state.exportProgressPercent.value).toBe(100)
    expect(messageSuccessSpy).toHaveBeenCalledWith('Archive exported to local folder.')

    useMessageSpy.mockRestore()
  })
})
