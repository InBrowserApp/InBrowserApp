import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { filesize } from 'filesize'
import { useObjectUrl } from '@vueuse/core'
import type { DataTableColumns, UploadFileInfo } from 'naive-ui'
import type { ArchiveEntry, ArchiveEntryKind, ArchiveHandle } from '../types'
import { openArchive } from '../utils/archive-open'
import {
  buildRows,
  normalizeDirectoryPath,
  splitPathSegments,
  toDirectoryPath,
} from './archive-explorer-rows'
import { renderArchiveRowNameCell } from './archive-row-icon'
import {
  MAX_TEXT_PREVIEW_BYTES,
  isImageEntry,
  isTextEntry,
  resolveTextPreviewLanguage,
} from './archive-preview'

export const labels = {
  uploadTitle: 'Upload archive',
  uploadHint: 'Click or drag to upload an archive file',
  supportedFormats: 'Supported formats: ZIP, TAR, GZ, TGZ',
  unsupportedFormat: 'Unsupported file format. Please upload ZIP, TAR, GZ, or TGZ.',
  selectedFile: 'Selected file',
  selectNewFile: 'Choose another archive',
  localNote: 'Runs locally in your browser. No uploads.',
  parsingArchive: 'Parsing archive entries...',
  entriesTitle: 'Archive explorer',
  searchPlaceholder: 'Search in current folder',
  rootFolder: 'Root',
  goToParent: 'Up',
  emptyFolder: 'This folder is empty.',
  previewTitle: 'Preview',
  noSelection: 'Select a file entry to preview.',
  loadingPreview: 'Loading preview...',
  noPreview: 'Preview is not available for this file type.',
  previewTooLarge: 'Preview is limited to 1 MB. Download to inspect full content.',
  downloadEntry: 'Download selected entry',
  errorTitle: 'Error',
} as const

export type ArchiveRow = {
  key: string
  path: string
  name: string
  kind: ArchiveEntryKind
  extension: string
  kindLabel: string
  sizeLabel: string
  modifiedAtLabel: string
}

export type ArchiveBreadcrumb = {
  label: string
  path: string
}

const SUPPORTED_ARCHIVE_SUFFIXES = ['.zip', '.tar', '.gz', '.tgz', '.tar.gz']

export function useArchiveViewer() {
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
  let openRequestToken = 0
  let previewRequestToken = 0

  const selectedBlobUrl = useObjectUrl(selectedBlob)

  const acceptedFormats = SUPPORTED_ARCHIVE_SUFFIXES.join(',')

  const breadcrumbs = computed<ArchiveBreadcrumb[]>(() => {
    const segments = splitPathSegments(currentDirectory.value)
    const result: ArchiveBreadcrumb[] = [{ label: labels.rootFolder, path: '' }]

    let nextSegments: string[] = []
    for (const segment of segments) {
      nextSegments = [...nextSegments, segment]
      result.push({
        label: segment,
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
      kindLabel: kindLabel(row.kind),
      sizeLabel: row.kind === 'file' ? formatBytes(row.size) : '-',
      modifiedAtLabel: formatDate(row.modifiedAt),
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

  const columns: DataTableColumns<ArchiveRow> = [
    {
      title: 'Name',
      key: 'name',
      ellipsis: { tooltip: true },
      minWidth: 260,
      render: (row) => renderArchiveRowNameCell(row),
    },
    {
      title: 'Kind',
      key: 'kindLabel',
      width: 120,
    },
    {
      title: 'Size',
      key: 'sizeLabel',
      width: 140,
    },
    {
      title: 'Modified',
      key: 'modifiedAtLabel',
      width: 180,
    },
  ]

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

    if (!isSupportedArchiveFile(selected)) {
      errorMessage.value = labels.unsupportedFormat
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
      errorMessage.value = error instanceof Error ? error.message : 'Unable to parse archive.'
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

      if (blob.size > MAX_TEXT_PREVIEW_BYTES) {
        previewKind.value = 'none'
        previewText.value = labels.previewTooLarge
        return
      }

      if (isImageEntry(entry, blob)) {
        previewKind.value = 'image'
        previewText.value = ''
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
      previewText.value = labels.noPreview
    } catch (error) {
      if (requestToken !== previewRequestToken) {
        return
      }

      previewKind.value = 'none'
      previewText.value = error instanceof Error ? error.message : labels.noPreview
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
    canGoToParentDirectory,
    closePreviewModal,
    columns,
    clearFile,
    downloadName,
    entries,
    errorMessage,
    formatBytes,
    goToDirectory,
    goToParentDirectory,
    handleBeforeUpload,
    isLoadingPreview,
    isParsing,
    isPreviewModalVisible,
    labels,
    previewKind,
    previewLanguage,
    previewText,
    rows,
    search,
    selectedBlobUrl,
    selectedEntry,
    tableRowProps,
    totalUncompressedSize,
  }
}

function isSupportedArchiveFile(file: File): boolean {
  const name = file.name.toLowerCase()
  return SUPPORTED_ARCHIVE_SUFFIXES.some((suffix) => name.endsWith(suffix))
}

function kindLabel(kind: ArchiveEntryKind): string {
  const map: Record<ArchiveEntryKind, string> = {
    file: 'file',
    directory: 'directory',
    symlink: 'symlink',
    other: 'other',
  }

  return map[kind]
}

function formatBytes(value: number): string {
  return filesize(value) as string
}

function formatDate(value: Date | null): string {
  if (!value) return '-'
  return value.toLocaleString()
}
