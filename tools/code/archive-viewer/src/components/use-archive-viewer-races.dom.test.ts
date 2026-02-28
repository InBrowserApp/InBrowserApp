import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { useArchiveViewer } from './use-archive-viewer'
import { openArchive } from '../utils/archive-open'
import type { ArchiveEntry, ArchiveHandle } from '../types'

vi.mock('../utils/archive-open', () => ({
  openArchive: vi.fn(),
}))

const mockedOpenArchive = vi.mocked(openArchive)

type ViewerState = ReturnType<typeof useArchiveViewer>

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

function createHandle(
  entries: ArchiveEntry[],
  options?: { readEntry?: ArchiveHandle['readEntry'] },
) {
  const readEntry =
    options?.readEntry ??
    (vi.fn(async () => new Blob(['default'], { type: 'text/plain' })) as ArchiveHandle['readEntry'])

  return {
    format: 'zip' as const,
    entries,
    readEntry,
    dispose: vi.fn(async () => undefined),
  }
}

function mountComposable(): ViewerState {
  let state: ViewerState | null = null
  const Harness = defineComponent({
    setup() {
      state = useArchiveViewer()
      return () => h('div')
    },
  })

  mount(Harness)

  if (!state) {
    throw new Error('Composable state not initialized')
  }

  return state as ViewerState
}

beforeEach(() => {
  mockedOpenArchive.mockReset()
})

describe('useArchiveViewer race guards', () => {
  it('ignores stale open after dispose wait and stale open rejection', async () => {
    const entry: ArchiveEntry = {
      path: 'active.txt',
      kind: 'file',
      size: 4,
      compressedSize: 2,
      modifiedAt: null,
      extension: 'txt',
    }

    const disposeDeferred = createDeferred<void>()
    const staleRejectDeferred = createDeferred<ArchiveHandle>()

    const firstHandle = createHandle([entry])
    ;(firstHandle.dispose as ReturnType<typeof vi.fn>).mockImplementationOnce(
      async () => disposeDeferred.promise,
    )

    const freshHandle = createHandle([entry])

    mockedOpenArchive
      .mockResolvedValueOnce(firstHandle)
      .mockImplementationOnce(async () => staleRejectDeferred.promise)
      .mockResolvedValueOnce(freshHandle)

    const state = mountComposable()

    const baseFile = new File(['base'], 'base.zip')
    await state.handleBeforeUpload({ file: { file: baseFile } as never, fileList: [] })
    await flushPromises()

    const staleBeforeOpenFile = new File(['stale-before-open'], 'stale-before-open.zip')
    const staleBeforeOpen = state.handleBeforeUpload({
      file: { file: staleBeforeOpenFile } as never,
      fileList: [],
    })

    await state.clearFile()
    disposeDeferred.resolve()
    await staleBeforeOpen
    await flushPromises()

    expect(mockedOpenArchive).toHaveBeenCalledTimes(1)

    const staleRejectFile = new File(['stale-reject'], 'stale-reject.zip')
    const staleRejectUpload = state.handleBeforeUpload({
      file: { file: staleRejectFile } as never,
      fileList: [],
    })
    await flushPromises()

    const freshFile = new File(['fresh'], 'fresh.zip')
    await state.handleBeforeUpload({ file: { file: freshFile } as never, fileList: [] })
    await flushPromises()

    staleRejectDeferred.reject(new Error('stale open failed'))
    await staleRejectUpload
    await flushPromises()

    expect(state.archiveFile.value?.name).toBe('fresh.zip')
    expect(state.selectedEntry.value?.path).toBe('active.txt')
    expect(state.errorMessage.value).toBe('')
  })

  it('keeps latest preview when stale preview resolves or fails later', async () => {
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

    const staleTextDeferred = createDeferred<string>()
    const staleReadDeferred = createDeferred<Blob>()
    let firstSelectionRound = true

    const slowTextBlob = new Blob(['slow'], { type: 'text/plain' })
    vi.spyOn(slowTextBlob, 'text').mockImplementation(async () => staleTextDeferred.promise)

    const readEntry = vi.fn(async (path: string) => {
      if (path === 'a.txt' && firstSelectionRound) {
        firstSelectionRound = false
        return slowTextBlob
      }

      if (path === 'a.txt') {
        return staleReadDeferred.promise
      }

      return new Blob(['second preview'], { type: 'text/plain' })
    })

    mockedOpenArchive.mockResolvedValueOnce(createHandle(entries, { readEntry }))

    const state = mountComposable()

    const file = new File(['race'], 'race.zip')
    await state.handleBeforeUpload({ file: { file } as never, fileList: [] })
    await flushPromises()

    const secondRow = state.rows.value.find((row) => row.path === 'b.txt')
    if (!secondRow) {
      throw new Error('Missing b.txt row')
    }

    state.tableRowProps(secondRow).onClick()
    await flushPromises()

    expect(state.previewText.value).toBe('second preview')

    staleTextDeferred.resolve('stale text')
    await flushPromises()

    expect(state.selectedEntry.value?.path).toBe('b.txt')
    expect(state.previewText.value).toBe('second preview')

    const firstRow = state.rows.value.find((row) => row.path === 'a.txt')
    if (!firstRow) {
      throw new Error('Missing a.txt row')
    }

    state.tableRowProps(firstRow).onClick()
    await flushPromises()
    state.tableRowProps(secondRow).onClick()
    await flushPromises()

    staleReadDeferred.reject(new Error('stale read failed'))
    await flushPromises()

    expect(state.selectedEntry.value?.path).toBe('b.txt')
    expect(state.previewText.value).toBe('second preview')
  })

  it('reloads preview when next archive keeps the same selected path', async () => {
    const entry: ArchiveEntry = {
      path: 'readme.txt',
      kind: 'file',
      size: 1,
      compressedSize: 1,
      modifiedAt: null,
      extension: 'txt',
    }

    mockedOpenArchive
      .mockResolvedValueOnce(
        createHandle([entry], {
          readEntry: vi.fn(async () => new Blob(['first archive'], { type: 'text/plain' })),
        }),
      )
      .mockResolvedValueOnce(
        createHandle([entry], {
          readEntry: vi.fn(async () => new Blob(['second archive'], { type: 'text/plain' })),
        }),
      )

    const state = mountComposable()

    await state.handleBeforeUpload({
      file: { file: new File(['first'], 'first.zip') } as never,
      fileList: [],
    })
    await flushPromises()
    expect(state.previewText.value).toBe('first archive')

    await state.handleBeforeUpload({
      file: { file: new File(['second'], 'second.zip') } as never,
      fileList: [],
    })
    await flushPromises()

    expect(state.selectedEntry.value?.path).toBe('readme.txt')
    expect(state.previewText.value).toBe('second archive')
  })

  it('reloads preview when clicking the same file row again', async () => {
    const entry: ArchiveEntry = {
      path: 'same.txt',
      kind: 'file',
      size: 1,
      compressedSize: 1,
      modifiedAt: null,
      extension: 'txt',
    }

    let readCount = 0
    const readEntry = vi.fn(async () => {
      readCount += 1
      return new Blob([`preview-${readCount}`], { type: 'text/plain' })
    })

    mockedOpenArchive.mockResolvedValueOnce(createHandle([entry], { readEntry }))

    const state = mountComposable()

    await state.handleBeforeUpload({
      file: { file: new File(['same'], 'same.zip') } as never,
      fileList: [],
    })
    await flushPromises()
    expect(state.previewText.value).toBe('preview-1')

    const row = state.rows.value.find((currentRow) => currentRow.path === 'same.txt')
    if (!row) {
      throw new Error('Missing same.txt row')
    }

    state.tableRowProps(row).onClick()
    await flushPromises()

    expect(state.previewText.value).toBe('preview-2')
    expect(readEntry).toHaveBeenCalledTimes(2)
  })
})
