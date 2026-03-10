import { computed, ref, type Ref } from 'vue'
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
  restorePagesFromSnapshot,
  snapshotPages,
  type OrganizerPage,
  type OrganizerPageSnapshot,
} from './pageOrganizerState'

type UsePageOrganizerEditsOptions = {
  pages: Ref<OrganizerPage[]>
  originalPageRotations: Ref<number[]>
  beforeRestore: () => void
  afterPagesUpdated: () => void
}

export const usePageOrganizerEdits = ({
  pages,
  originalPageRotations,
  beforeRestore,
  afterPagesUpdated,
}: UsePageOrganizerEditsOptions) => {
  const selectedPageIds = ref<string[]>([])
  const history = ref<OrganizerPageSnapshot[][]>([])
  const historyIndex = ref(-1)
  let lastSelectedPageId: string | null = null

  const selectedPageSet = computed(() => new Set(selectedPageIds.value))
  const selectedCount = computed(() => selectedPageIds.value.length)
  const canUndo = computed(() => historyIndex.value > 0)
  const canRedo = computed(
    () => historyIndex.value >= 0 && historyIndex.value < history.value.length - 1,
  )

  const resetSelection = (): void => {
    selectedPageIds.value = []
    lastSelectedPageId = null
  }

  const syncSelectionWithPages = (): void => {
    const availablePageIds = new Set(pages.value.map((page) => page.id))
    selectedPageIds.value = selectedPageIds.value.filter((pageId) => availablePageIds.has(pageId))

    if (lastSelectedPageId && !availablePageIds.has(lastSelectedPageId)) {
      lastSelectedPageId = null
    }
  }

  const resetHistory = (nextPages: OrganizerPage[]): void => {
    history.value = [snapshotPages(nextPages)]
    historyIndex.value = 0
  }

  const clearHistory = (): void => {
    history.value = []
    historyIndex.value = -1
  }

  const pushHistory = (nextPages: OrganizerPage[]): void => {
    const nextSnapshot = snapshotPages(nextPages)
    const currentSnapshot = history.value[historyIndex.value] ?? []

    if (areSnapshotsEqual(currentSnapshot, nextSnapshot)) {
      return
    }

    history.value = [...history.value.slice(0, historyIndex.value + 1), nextSnapshot]
    historyIndex.value = history.value.length - 1
  }

  const applyPages = (
    nextPages: OrganizerPage[],
    historyMode: 'push' | 'reset' | 'none' = 'push',
  ): void => {
    pages.value = nextPages

    if (historyMode === 'reset') {
      resetHistory(nextPages)
    } else if (historyMode === 'push') {
      pushHistory(nextPages)
    }

    syncSelectionWithPages()
    afterPagesUpdated()
  }

  const restoreFromSnapshot = (snapshot: OrganizerPageSnapshot[]): void => {
    const existingPagesByNumber = new Map(
      pages.value.map((page) => [page.sourcePageNumber, page] as const),
    )

    pages.value = restorePagesFromSnapshot(
      snapshot,
      originalPageRotations.value,
      existingPagesByNumber,
    )
    syncSelectionWithPages()
    afterPagesUpdated()
  }

  const reorderPages = (oldIndex: number | null, newIndex: number | null): void => {
    const nextPages = reorderPagesState(pages.value, oldIndex, newIndex)
    if (nextPages) {
      applyPages(nextPages)
    }
  }

  const movePage = (pageId: string, offset: number): void => {
    const nextPages = movePageState(pages.value, pageId, offset)
    if (nextPages) {
      applyPages(nextPages)
    }
  }

  const rotatePage = (pageId: string, delta: number): void => {
    const nextPages = rotatePageState(pages.value, pageId, delta)
    if (nextPages) {
      applyPages(nextPages)
    }
  }

  const rotateSelectedPages = (delta: number): void => {
    const nextPages = rotatePagesState(pages.value, selectedPageIds.value, delta)
    if (nextPages) {
      applyPages(nextPages)
    }
  }

  const deletePages = (pageIds: string[]): void => {
    const nextPages = deletePagesState(pages.value, pageIds)
    if (nextPages) {
      applyPages(nextPages)
    }
  }

  const togglePageSelection = (pageId: string, useShift = false): void => {
    const nextSelection = togglePageSelectionState(
      pages.value,
      selectedPageIds.value,
      lastSelectedPageId,
      pageId,
      useShift,
    )
    if (!nextSelection) {
      return
    }

    selectedPageIds.value = nextSelection.selectedPageIds
    lastSelectedPageId = nextSelection.lastSelectedPageId
  }

  const selectAllPages = (): void => {
    selectedPageIds.value = pages.value.map((page) => page.id)
    lastSelectedPageId = pages.value.at(-1)?.id ?? null
  }

  const resetChanges = (): void => {
    beforeRestore()
    const existingPagesByNumber = new Map(
      pages.value.map((page) => [page.sourcePageNumber, page] as const),
    )
    applyPages(createPagesFromRotations(originalPageRotations.value, existingPagesByNumber))
  }

  const restoreHistoryStep = (nextIndex: number): void => {
    beforeRestore()
    historyIndex.value = nextIndex
    restoreFromSnapshot(history.value[nextIndex] ?? [])
  }

  return {
    selectedCount,
    selectedPageSet,
    canUndo,
    canRedo,
    resetSelection,
    syncSelectionWithPages,
    resetHistory,
    clearHistory,
    applyPages,
    reorderPages,
    movePage,
    rotatePage,
    rotateSelectedPages,
    deletePage: (pageId: string) => deletePages([pageId]),
    deleteSelectedPages: () => deletePages(selectedPageIds.value),
    togglePageSelection,
    selectAllPages,
    clearSelection: resetSelection,
    resetChanges,
    undoChanges: () => canUndo.value && restoreHistoryStep(historyIndex.value - 1),
    redoChanges: () => canRedo.value && restoreHistoryStep(historyIndex.value + 1),
  }
}
