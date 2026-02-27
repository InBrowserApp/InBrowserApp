import { computed, onBeforeUnmount, ref, toValue, watch } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import type { MaybeRefOrGetter } from 'vue'
import type { UploadFileInfo } from 'naive-ui'
import type { ArchiveEntry, ArchiveEntryKind, ArchiveHandle } from '../types'
import { openArchive } from '../utils/archive-open'
import {
  buildRows,
  normalizeDirectoryPath,
  splitPathSegments,
  toDirectoryPath,
} from './archive-explorer-rows'
import {
  exportArchiveEntriesToDirectory,
  isAbortError,
  pickArchiveFile,
  pickDirectoryForExport,
} from './archive-browser-apis'
import { formatBytes } from './archive-format'
import {
  computeExportProgressPercent,
  getMessageApi,
  isSupportedArchiveFile,
} from './archive-viewer-helpers'
import {
  MAX_TEXT_PREVIEW_BYTES,
  isImageEntry,
  isTextEntry,
  resolveTextPreviewLanguage,
} from './archive-preview'

export type ArchiveRow = {
  key: string
  path: string
  name: string
  kind: ArchiveEntryKind
  extension: string
  size: number
  modifiedAt: Date | null
  sortName: string
  sortKind: string
  sortSize: number
  sortModifiedAt: number
}

export type ArchiveBreadcrumb = {
  name: string
  path: string
}

export type ArchiveViewerLogicLabels = {
  unsupportedFormat: string
  selectFileFailed: string
  exportSucceeded: string
  exportFailed: string
  previewTooLarge: string
  noPreview: string
  parseFailed: string
}

const SUPPORTED_ARCHIVE_SUFFIXES = ['.zip', '.tar', '.gz', '.tgz', '.tar.gz']

const DEFAULT_LOGIC_LABELS: ArchiveViewerLogicLabels = {
  unsupportedFormat: 'Unsupported file format. Please upload ZIP, TAR, GZ, or TGZ.',
  selectFileFailed: 'Unable to select archive.',
  exportSucceeded: 'Archive exported to local folder.',
  exportFailed: 'Failed to export archive entries.',
  previewTooLarge: 'Preview is limited to 1 MB. Download to inspect full content.',
  noPreview: 'Preview is not available for this file type.',
  parseFailed: 'Unable to parse archive.',
}

export function useArchiveViewer(providedLabels?: MaybeRefOrGetter<ArchiveViewerLogicLabels>) {
  const logicLabels = computed(() => toValue(providedLabels) ?? DEFAULT_LOGIC_LABELS)

  const archiveFile = ref<File | null>(null)
  const archiveHandle = ref<ArchiveHandle | null>(null)
  const entries = ref<ArchiveEntry[]>([])
  const search = ref('')
  const currentDirectory = ref('')
  const selectedPath = ref('')
  const selectedBlob = ref<Blob | null>(null)
  const previewKind = ref<'none' | 'text' | 'image'>('none')
  const previewText = ref('')
  const previewLanguage = ref('plaintext')
  const isParsing = ref(false)
  const isLoadingPreview = ref(false)
  const isPreviewModalVisible = ref(false)
  const errorMessage = ref('')
  const isExportingAll = ref(false)
  const exportProgressPercent = ref(0)
  let openRequestToken = 0
  let previewRequestToken = 0
  const message = getMessageApi()

  const selectedBlobUrl = useObjectUrl(selectedBlob)
  const acceptedFormats = SUPPORTED_ARCHIVE_SUFFIXES.join(',')

  const breadcrumbs = computed<ArchiveBreadcrumb[]>(() => {
    const segments = splitPathSegments(currentDirectory.value)
    const result: ArchiveBreadcrumb[] = []

    let nextSegments: string[] = []
    for (const segment of segments) {
      nextSegments = [...nextSegments, segment]
      result.push({
        name: segment,
        path: toDirectoryPath(nextSegments),
      })
    }

    return result
  })

  const canGoToParentDirectory = computed(
    () => splitPathSegments(currentDirectory.value).length > 0,
  )

  const visibleRows = computed(() => {
    const rows = buildRows(entries.value, currentDirectory.value)
    const query = search.value.trim().toLowerCase()
    if (!query) {
      return rows
    }

    return rows.filter((row) => row.name.toLowerCase().includes(query))
  })

  const rows = computed<ArchiveRow[]>(() =>
    visibleRows.value.map((row) => ({
      key: row.path,
      path: row.path,
      name: row.name,
      kind: row.kind,
      extension: row.extension,
      size: row.size,
      modifiedAt: row.modifiedAt,
      sortName: row.name.toLowerCase(),
      sortKind: row.kind,
      sortSize: row.kind === 'file' ? row.size : -1,
      sortModifiedAt: row.modifiedAt?.getTime() ?? 0,
    })),
  )

  const selectedEntry = computed(
    () => entries.value.find((entry) => entry.path === selectedPath.value) ?? null,
  )

  const downloadName = computed(() => selectedEntry.value?.path.split('/').pop() || 'entry.bin')

  const totalUncompressedSize = computed(() =>
    entries.value.reduce((total, entry) => total + (entry.kind === 'file' ? entry.size : 0), 0),
  )

  const archiveSizeSummary = computed(() => {
    if (!archiveFile.value) {
      return ''
    }

    const compressedSize = archiveFile.value.size
    const uncompressedSize = totalUncompressedSize.value

    if (!archiveHandle.value || isParsing.value || uncompressedSize <= 0) {
      return formatBytes(compressedSize)
    }

    const ratio = Math.round((compressedSize / uncompressedSize) * 100)
    return `${formatBytes(compressedSize)} / ${formatBytes(uncompressedSize)} (${ratio}%)`
  })

  const shouldShowCopyPreview = computed(() => {
    return (
      previewKind.value === 'text' &&
      typeof navigator !== 'undefined' &&
      typeof navigator.clipboard?.writeText === 'function'
    )
  })

  const canExportAllEntries = computed(() =>
    entries.value.some((entry) => entry.kind === 'file' || entry.kind === 'directory'),
  )

  function tableRowProps(row: ArchiveRow) {
    return {
      style: 'cursor: pointer;',
      onClick: () => {
        onRowClick(row)
      },
    }
  }

  async function handleBeforeUpload(data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) {
    const selected = data.file.file
    if (!selected) return false

    if (!isSupportedArchiveFile(selected, SUPPORTED_ARCHIVE_SUFFIXES)) {
      errorMessage.value = logicLabels.value.unsupportedFormat
      return false
    }

    await openSelectedFile(selected)
    return false
  }

  function onRowClick(row: ArchiveRow) {
    if (row.kind === 'directory') {
      goToDirectory(row.path)
      return
    }

    selectedPath.value = row.path
    isPreviewModalVisible.value = true
  }

  function goToDirectory(path: string) {
    currentDirectory.value = normalizeDirectoryPath(path)
  }

  function goToParentDirectory() {
    const segments = splitPathSegments(currentDirectory.value)
    if (!segments.length) return

    segments.pop()
    currentDirectory.value = toDirectoryPath(segments)
  }

  function closePreviewModal() {
    isPreviewModalVisible.value = false
  }

  async function chooseAnotherArchive() {
    try {
      const selected = await pickArchiveFile(SUPPORTED_ARCHIVE_SUFFIXES)
      if (!selected) {
        return
      }

      if (!isSupportedArchiveFile(selected, SUPPORTED_ARCHIVE_SUFFIXES)) {
        errorMessage.value = logicLabels.value.unsupportedFormat
        return
      }

      await openSelectedFile(selected)
    } catch (error) {
      if (isAbortError(error)) {
        return
      }

      errorMessage.value =
        error instanceof Error ? error.message : logicLabels.value.selectFileFailed
    }
  }

  async function exportAllEntries() {
    const handle = archiveHandle.value
    if (!handle) {
      return
    }

    isExportingAll.value = true
    exportProgressPercent.value = 0
    errorMessage.value = ''

    try {
      const directoryHandle = await pickDirectoryForExport()
      if (!directoryHandle) {
        return
      }

      await exportArchiveEntriesToDirectory({
        directoryHandle,
        entries: entries.value,
        readEntry: handle.readEntry,
        onProgress: (progress) => {
          exportProgressPercent.value = computeExportProgressPercent(progress)
        },
      })

      exportProgressPercent.value = 100
      message?.success(logicLabels.value.exportSucceeded)
    } catch (error) {
      if (isAbortError(error)) {
        return
      }

      errorMessage.value = error instanceof Error ? error.message : logicLabels.value.exportFailed
    } finally {
      isExportingAll.value = false
    }
  }

  async function openSelectedFile(file: File) {
    const requestToken = ++openRequestToken
    isParsing.value = true
    errorMessage.value = ''
    archiveFile.value = file
    search.value = ''
    currentDirectory.value = ''
    isPreviewModalVisible.value = false

    invalidatePreviewRequests()
    await disposeArchive()
    if (requestToken !== openRequestToken) {
      return
    }

    resetPreviewState()

    try {
      const opened = await openArchive(file)
      if (requestToken !== openRequestToken) {
        await opened.dispose()
        return
      }

      archiveHandle.value = opened
      entries.value = opened.entries

      const firstFile = opened.entries.find((entry) => entry.kind === 'file')
      selectedPath.value = firstFile?.path ?? ''
    } catch (error) {
      if (requestToken !== openRequestToken) {
        return
      }

      archiveHandle.value = null
      entries.value = []
      selectedPath.value = ''
      errorMessage.value = error instanceof Error ? error.message : logicLabels.value.parseFailed
    } finally {
      if (requestToken === openRequestToken) {
        isParsing.value = false
      }
    }
  }

  async function clearFile() {
    invalidateOpenRequests()
    invalidatePreviewRequests()

    archiveFile.value = null
    entries.value = []
    search.value = ''
    currentDirectory.value = ''
    selectedPath.value = ''
    errorMessage.value = ''
    isPreviewModalVisible.value = false
    exportProgressPercent.value = 0

    await disposeArchive()
    resetPreviewState()
  }

  function resetPreviewState() {
    selectedBlob.value = null
    previewKind.value = 'none'
    previewText.value = ''
    previewLanguage.value = 'plaintext'
  }

  watch(selectedPath, async () => {
    await loadPreview()
  })

  watch(entries, () => {
    if (!selectedPath.value) return

    const exists = entries.value.some((entry) => entry.path === selectedPath.value)
    if (!exists) {
      selectedPath.value = ''
    }
  })

  onBeforeUnmount(async () => {
    invalidateOpenRequests()
    invalidatePreviewRequests()
    await disposeArchive()
  })

  async function loadPreview() {
    const requestToken = ++previewRequestToken
    resetPreviewState()

    const entry = selectedEntry.value
    const handle = archiveHandle.value
    if (!entry || !handle || entry.kind !== 'file') {
      return
    }

    isLoadingPreview.value = true

    try {
      const blob = await handle.readEntry(entry.path)
      if (requestToken !== previewRequestToken) {
        return
      }

      selectedBlob.value = blob

      if (isImageEntry(entry, blob)) {
        previewKind.value = 'image'
        previewText.value = ''
        return
      }

      if (blob.size > MAX_TEXT_PREVIEW_BYTES) {
        previewKind.value = 'none'
        previewText.value = logicLabels.value.previewTooLarge
        return
      }

      if (isTextEntry(entry, blob)) {
        previewLanguage.value = resolveTextPreviewLanguage(entry, blob)
        const text = await blob.text()
        if (requestToken !== previewRequestToken) {
          return
        }

        previewKind.value = 'text'
        previewText.value = text
        return
      }

      previewKind.value = 'none'
      previewText.value = logicLabels.value.noPreview
    } catch (error) {
      if (requestToken !== previewRequestToken) {
        return
      }

      previewKind.value = 'none'
      previewText.value = error instanceof Error ? error.message : logicLabels.value.noPreview
    } finally {
      if (requestToken === previewRequestToken) {
        isLoadingPreview.value = false
      }
    }
  }

  async function disposeArchive() {
    const handle = archiveHandle.value
    if (!handle) return

    archiveHandle.value = null
    await handle.dispose()
  }

  function invalidateOpenRequests() {
    openRequestToken += 1
    isParsing.value = false
  }

  function invalidatePreviewRequests() {
    previewRequestToken += 1
    isLoadingPreview.value = false
  }

  return {
    acceptedFormats,
    archiveFile,
    archiveHandle,
    archiveSizeSummary,
    breadcrumbs,
    canExportAllEntries,
    canGoToParentDirectory,
    chooseAnotherArchive,
    clearFile,
    exportAllEntries,
    closePreviewModal,
    downloadName,
    entries,
    errorMessage,
    formatBytes,
    goToDirectory,
    goToParentDirectory,
    handleBeforeUpload,
    isExportingAll,
    exportProgressPercent,
    isLoadingPreview,
    isParsing,
    isPreviewModalVisible,
    previewKind,
    previewLanguage,
    previewText,
    rows,
    search,
    selectedBlobUrl,
    selectedEntry,
    shouldShowCopyPreview,
    tableRowProps,
    totalUncompressedSize,
  }
}
