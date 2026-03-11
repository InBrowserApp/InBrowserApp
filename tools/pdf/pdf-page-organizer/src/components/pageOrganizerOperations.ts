import { createPageState, type OrganizerPage } from './pageOrganizerState'

export type SelectionState = {
  selectedPageIds: string[]
  lastSelectedPageId: string | null
}

export const reorderPagesState = (
  pages: OrganizerPage[],
  oldIndex: number | null,
  newIndex: number | null,
): OrganizerPage[] | null => {
  if (
    oldIndex === null ||
    newIndex === null ||
    oldIndex === newIndex ||
    oldIndex < 0 ||
    newIndex < 0 ||
    oldIndex >= pages.length ||
    newIndex >= pages.length
  ) {
    return null
  }

  const nextPages = [...pages]
  const [movedPage] = nextPages.splice(oldIndex, 1)

  if (!movedPage) {
    return null
  }

  nextPages.splice(newIndex, 0, movedPage)
  return nextPages
}

export const movePageState = (
  pages: OrganizerPage[],
  pageId: string,
  offset: number,
): OrganizerPage[] | null => {
  const index = pages.findIndex((page) => page.id === pageId)
  return index < 0 ? null : reorderPagesState(pages, index, index + offset)
}

export const rotatePageState = (
  pages: OrganizerPage[],
  pageId: string,
  delta: number,
): OrganizerPage[] | null => {
  const page = pages.find((item) => item.id === pageId)
  if (!page) {
    return null
  }

  return pages.map((currentPage) =>
    currentPage.id === pageId
      ? {
          ...currentPage,
          rotationOffset: page.rotationOffset + delta,
        }
      : currentPage,
  )
}

export const rotatePagesState = (
  pages: OrganizerPage[],
  pageIds: string[],
  delta: number,
): OrganizerPage[] | null => {
  if (!pageIds.length) {
    return null
  }

  const selectedIds = new Set(pageIds)
  return pages.map((page) =>
    selectedIds.has(page.id)
      ? {
          ...page,
          rotationOffset: page.rotationOffset + delta,
        }
      : page,
  )
}

export const deletePagesState = (
  pages: OrganizerPage[],
  pageIds: string[],
): OrganizerPage[] | null => {
  if (!pageIds.length) {
    return null
  }

  const deletedIds = new Set(pageIds)
  return pages.filter((page) => !deletedIds.has(page.id))
}

export const togglePageSelectionState = (
  pages: OrganizerPage[],
  selectedPageIds: string[],
  lastSelectedPageId: string | null,
  pageId: string,
  useShift = false,
): SelectionState | null => {
  const index = pages.findIndex((page) => page.id === pageId)
  if (index < 0) {
    return null
  }

  const nextSelection = new Set(selectedPageIds)
  const lastIndex =
    lastSelectedPageId === null ? -1 : pages.findIndex((page) => page.id === lastSelectedPageId)

  if (useShift && lastIndex >= 0) {
    const start = Math.min(index, lastIndex)
    const end = Math.max(index, lastIndex)

    for (let current = start; current <= end; current += 1) {
      const page = pages[current]
      if (page) {
        nextSelection.add(page.id)
      }
    }
  } else if (nextSelection.has(pageId)) {
    nextSelection.delete(pageId)
  } else {
    nextSelection.add(pageId)
  }

  return {
    selectedPageIds: [...nextSelection],
    lastSelectedPageId: pageId,
  }
}

export const createPagesFromRotations = (
  originalPageRotations: number[],
  existingPagesByNumber?: Map<number, OrganizerPage>,
): OrganizerPage[] =>
  originalPageRotations.map((rotation, index) => ({
    ...createPageState(index + 1, rotation, existingPagesByNumber?.get(index + 1)),
    rotationOffset: 0,
  }))
