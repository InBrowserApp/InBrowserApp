import { ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import {
  createPagesFromRotations,
  deletePagesState,
  movePageState,
  reorderPagesState,
  rotatePageState,
  rotatePagesState,
  togglePageSelectionState,
} from './pageOrganizerOperations'
import {
  areSnapshotsEqual,
  createOutputFileName,
  createPageState,
  normalizeRotation,
  restorePagesFromSnapshot,
  snapshotPages,
  type OrganizerPage,
} from './pageOrganizerState'
import { usePageOrganizerEdits } from './usePageOrganizerEdits'

const createPages = (): OrganizerPage[] => [
  createPageState(1, 0),
  createPageState(2, 90),
  createPageState(3, 180),
]

describe('page organizer state helpers', () => {
  it('normalizes rotations and builds output file names', () => {
    expect(normalizeRotation(-90)).toBe(270)
    expect(normalizeRotation(450)).toBe(90)
    expect(createOutputFileName(null)).toBe('organized-organized.pdf')
    expect(createOutputFileName(new File(['pdf'], 'report.PDF'))).toBe('report-organized.pdf')
    expect(createOutputFileName(new File(['pdf'], '  '))).toBe('organized-organized.pdf')
  })

  it('creates, snapshots, compares, and restores page state', () => {
    const existingPage: OrganizerPage = {
      ...createPageState(4, 0),
      rotationOffset: 270,
      thumbnailUrl: 'blob:4',
      isLoading: false,
      hasError: true,
    }
    const page = createPageState(4, 180, existingPage)
    expect(page).toMatchObject({
      sourcePageNumber: 4,
      originalRotation: 180,
      rotationOffset: 270,
      thumbnailUrl: 'blob:4',
      isLoading: false,
      hasError: true,
    })

    const snapshot = snapshotPages([page])
    expect(snapshot).toEqual([{ sourcePageNumber: 4, rotationOffset: 270 }])
    expect(areSnapshotsEqual(snapshot, snapshotPages([page]))).toBe(true)
    expect(areSnapshotsEqual(snapshot, [])).toBe(false)
    expect(areSnapshotsEqual(snapshot, [{ sourcePageNumber: 4, rotationOffset: 0 }])).toBe(false)

    const restored = restorePagesFromSnapshot(
      [
        { sourcePageNumber: 1, rotationOffset: 90 },
        { sourcePageNumber: 5, rotationOffset: 180 },
      ],
      [0],
      new Map<number, OrganizerPage>([[1, existingPage]]),
    )
    expect(restored[0]).toMatchObject({ originalRotation: 0, thumbnailUrl: 'blob:4' })
    expect(restored[1]).toMatchObject({ originalRotation: 0, rotationOffset: 180 })
  })
})

describe('page organizer operations', () => {
  it('handles reorder, move, rotate, delete, and selection helpers', () => {
    const pages = createPages()

    expect(reorderPagesState(pages, null, 1)).toBeNull()
    expect(reorderPagesState(pages, 0, 0)).toBeNull()
    expect(reorderPagesState(pages, 0, 5)).toBeNull()

    const sparsePages = [] as ReturnType<typeof createPages>
    sparsePages.length = 2
    sparsePages[1] = createPageState(2, 0)
    expect(reorderPagesState(sparsePages, 0, 1)).toBeNull()

    expect(reorderPagesState(pages, 0, 2)?.map((page) => page.sourcePageNumber)).toEqual([2, 3, 1])
    expect(movePageState(pages, 'missing', 1)).toBeNull()
    expect(movePageState(pages, '2', -1)?.map((page) => page.sourcePageNumber)).toEqual([2, 1, 3])

    expect(rotatePageState(pages, 'missing', 90)).toBeNull()
    expect(rotatePageState(pages, '2', 90)?.[1]?.rotationOffset).toBe(90)
    expect(rotatePagesState(pages, [], 90)).toBeNull()
    expect(rotatePagesState(pages, ['1', '3'], -90)?.map((page) => page.rotationOffset)).toEqual([
      -90, 0, -90,
    ])

    expect(deletePagesState(pages, [])).toBeNull()
    expect(deletePagesState(pages, ['2'])?.map((page) => page.id)).toEqual(['1', '3'])

    expect(togglePageSelectionState(pages, [], null, 'missing')).toBeNull()
    expect(togglePageSelectionState(pages, [], null, '1')).toEqual({
      selectedPageIds: ['1'],
      lastSelectedPageId: '1',
    })
    expect(togglePageSelectionState(pages, ['1'], '1', '3', true)).toEqual({
      selectedPageIds: ['1', '2', '3'],
      lastSelectedPageId: '3',
    })
    expect(togglePageSelectionState(pages, ['2'], '9', '2')).toEqual({
      selectedPageIds: [],
      lastSelectedPageId: '2',
    })

    const existingPagesByNumber = new Map<number, OrganizerPage>([
      [2, { ...pages[1]!, thumbnailUrl: 'blob:2', isLoading: false }],
    ])
    expect(createPagesFromRotations([0, 90], existingPagesByNumber)[1]).toMatchObject({
      thumbnailUrl: 'blob:2',
      isLoading: false,
      originalRotation: 90,
      rotationOffset: 0,
    })
  })
})

describe('usePageOrganizerEdits', () => {
  it('tracks selection, history, and page edits', () => {
    const pages = ref<OrganizerPage[]>(createPages())
    const originalPageRotations = ref([0, 90, 180])
    const beforeRestore = vi.fn()
    const afterPagesUpdated = vi.fn()

    const edits = usePageOrganizerEdits({
      pages,
      originalPageRotations,
      beforeRestore,
      afterPagesUpdated,
    })

    edits.undoChanges()
    edits.redoChanges()
    expect(beforeRestore).not.toHaveBeenCalled()

    edits.resetHistory(pages.value)
    edits.applyPages([...pages.value], 'push')
    expect(edits.canUndo.value).toBe(false)
    expect(afterPagesUpdated).toHaveBeenCalled()

    edits.togglePageSelection('missing')
    edits.rotateSelectedPages(90)
    edits.deleteSelectedPages()
    expect(edits.selectedCount.value).toBe(0)

    edits.selectAllPages()
    expect(edits.selectedCount.value).toBe(3)
    edits.deletePage('1')
    expect(edits.selectedPageSet.value.has('1')).toBe(false)

    edits.movePage('missing', 1)
    edits.reorderPages(null, 1)
    edits.rotatePage('missing', 90)
    edits.clearSelection()
    edits.deleteSelectedPages()

    edits.clearSelection()
    edits.togglePageSelection('2')
    edits.togglePageSelection('3', true)

    edits.rotateSelectedPages(90)
    expect(pages.value.find((page) => page.id === '2')?.rotationOffset).toBe(90)
    expect(edits.canUndo.value).toBe(true)

    edits.undoChanges()
    expect(beforeRestore).toHaveBeenCalledTimes(1)
    expect(pages.value.find((page) => page.id === '2')?.rotationOffset).toBe(0)
    expect(edits.canRedo.value).toBe(true)

    edits.redoChanges()
    expect(beforeRestore).toHaveBeenCalledTimes(2)
    expect(pages.value.find((page) => page.id === '2')?.rotationOffset).toBe(90)

    edits.clearSelection()
    edits.clearHistory()
    expect(edits.canUndo.value).toBe(false)
    expect(edits.canRedo.value).toBe(false)

    const nextPages: OrganizerPage[] = [
      { ...pages.value[0]!, id: '9', sourcePageNumber: 9 },
      { ...pages.value[1]!, id: '2', sourcePageNumber: 2 },
    ]
    pages.value = nextPages
    edits.selectAllPages()
    edits.syncSelectionWithPages()
    edits.resetChanges()
    expect(beforeRestore).toHaveBeenCalledTimes(3)
    expect(pages.value.map((page) => page.sourcePageNumber)).toEqual([1, 2, 3])

    edits.applyPages([...pages.value], 'none')
    expect(afterPagesUpdated).toHaveBeenCalled()
  })
})
