export type OrganizerPage = {
  id: string
  sourcePageNumber: number
  originalRotation: number
  rotationOffset: number
  thumbnailUrl: string | null
  isLoading: boolean
  hasError: boolean
}

export type OrganizerPageSnapshot = {
  sourcePageNumber: number
  rotationOffset: number
}

export type ThumbnailSize = 'compact' | 'comfortable' | 'large'

export type ActionResult = {
  success: boolean
  errorCode?: string
}

export const THUMBNAIL_WIDTH = 220
export const PREVIEW_WIDTH = 960

export const normalizeRotation = (value: number): number => {
  const normalized = value % 360
  return normalized < 0 ? normalized + 360 : normalized
}

export const createOutputFileName = (file: File | null): string => {
  const filename = file?.name.trim() ?? ''
  const baseName = filename.replace(/\.pdf$/i, '') || 'organized'
  return `${baseName}-organized.pdf`
}

export const createPageState = (
  pageNumber: number,
  originalRotation: number,
  existingPage?: OrganizerPage,
): OrganizerPage => ({
  id: String(pageNumber),
  sourcePageNumber: pageNumber,
  originalRotation,
  rotationOffset: existingPage?.rotationOffset ?? 0,
  thumbnailUrl: existingPage?.thumbnailUrl ?? null,
  isLoading: existingPage ? existingPage.isLoading : true,
  hasError: existingPage?.hasError ?? false,
})

export const snapshotPages = (pages: OrganizerPage[]): OrganizerPageSnapshot[] =>
  pages.map((page) => ({
    sourcePageNumber: page.sourcePageNumber,
    rotationOffset: page.rotationOffset,
  }))

export const areSnapshotsEqual = (
  left: OrganizerPageSnapshot[],
  right: OrganizerPageSnapshot[],
): boolean => {
  if (left.length !== right.length) {
    return false
  }

  return left.every(
    (page, index) =>
      page.sourcePageNumber === right[index]?.sourcePageNumber &&
      page.rotationOffset === right[index]?.rotationOffset,
  )
}

export const restorePagesFromSnapshot = (
  snapshot: OrganizerPageSnapshot[],
  originalPageRotations: number[],
  existingPagesByNumber: Map<number, OrganizerPage>,
): OrganizerPage[] =>
  snapshot.map(({ sourcePageNumber, rotationOffset }) => ({
    ...createPageState(
      sourcePageNumber,
      originalPageRotations[sourcePageNumber - 1] ?? 0,
      existingPagesByNumber.get(sourcePageNumber),
    ),
    rotationOffset,
  }))
