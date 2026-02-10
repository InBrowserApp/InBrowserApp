import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { filesize } from 'filesize'
import { useObjectUrl } from '@vueuse/core'
import type { DataTableColumns, UploadFileInfo } from 'naive-ui'
import type { ArchiveEntry, ArchiveEntryKind, ArchiveHandle } from '../types'
import { openArchive } from '../utils/archive-open'

export const labels = {
  uploadTitle: 'Upload archive',
  uploadHint: 'Click or drag to upload an archive file',
  supportedFormats: 'Supported formats: ZIP, TAR, GZ, TGZ',
  selectedFile: 'Selected file',
  clearFile: 'Clear file',
  localNote: 'Runs locally in your browser. No uploads.',
  parsingArchive: 'Parsing archive entries...',
  summaryTitle: 'Archive summary',
  archiveFormat: 'Format',
  entryCount: 'Entries',
  totalUncompressed: 'Total uncompressed size',
  entriesTitle: 'Entries',
  searchPlaceholder: 'Search by path',
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
  kindLabel: string
  sizeLabel: string
  modifiedAtLabel: string
}

const MAX_TEXT_PREVIEW_BYTES = 1024 * 1024
const TEXT_EXTENSIONS = new Set([
  'txt',
  'md',
  'json',
  'js',
  'ts',
  'tsx',
  'jsx',
  'css',
  'html',
  'xml',
  'yml',
  'yaml',
  'toml',
  'csv',
  'log',
  'ini',
  'conf',
])

export function useArchiveViewer() {
  const archiveFile = ref<File | null>(null)
  const archiveHandle = ref<ArchiveHandle | null>(null)
  const entries = ref<ArchiveEntry[]>([])
  const search = ref('')
  const selectedPath = ref('')
  const selectedBlob = ref<Blob | null>(null)
  const previewKind = ref<'none' | 'text' | 'image'>('none')
  const previewText = ref('')
  const isParsing = ref(false)
  const isLoadingPreview = ref(false)
  const errorMessage = ref('')

  const selectedBlobUrl = useObjectUrl(selectedBlob)

  const filteredEntries = computed(() => {
    const query = search.value.trim().toLowerCase()
    if (!query) return entries.value
    return entries.value.filter((entry) => entry.path.toLowerCase().includes(query))
  })

  const rows = computed<ArchiveRow[]>(() =>
    filteredEntries.value.map((entry) => ({
      key: entry.path,
      path: entry.path,
      kindLabel: kindLabel(entry.kind),
      sizeLabel: entry.kind === 'file' ? formatBytes(entry.size) : '-',
      modifiedAtLabel: formatDate(entry.modifiedAt),
    })),
  )

  const selectedEntry = computed(
    () => entries.value.find((entry) => entry.path === selectedPath.value) ?? null,
  )

  const downloadName = computed(() => selectedEntry.value?.path.split('/').pop() || 'entry.bin')

  const totalUncompressedSize = computed(() =>
    entries.value.reduce((total, entry) => total + (entry.kind === 'file' ? entry.size : 0), 0),
  )

  const columns: DataTableColumns<ArchiveRow> = [
    {
      title: 'Path',
      key: 'path',
      ellipsis: { tooltip: true },
      minWidth: 280,
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
      style: row.path === selectedPath.value ? 'background: var(--n-table-color-hover);' : '',
      onClick: () => {
        selectedPath.value = row.path
      },
    }
  }

  async function handleBeforeUpload(data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) {
    const selected = data.file.file
    if (!selected) return false

    await openSelectedFile(selected)
    return false
  }

  async function openSelectedFile(file: File) {
    isParsing.value = true
    errorMessage.value = ''
    archiveFile.value = file
    search.value = ''

    await disposeArchive()
    resetPreviewState()

    try {
      const opened = await openArchive(file)
      archiveHandle.value = opened
      entries.value = opened.entries

      const firstFile = opened.entries.find((entry) => entry.kind === 'file')
      selectedPath.value = firstFile?.path ?? ''
    } catch (error) {
      archiveHandle.value = null
      entries.value = []
      selectedPath.value = ''
      errorMessage.value = error instanceof Error ? error.message : 'Unable to parse archive.'
    } finally {
      isParsing.value = false
    }
  }

  async function clearFile() {
    archiveFile.value = null
    entries.value = []
    search.value = ''
    errorMessage.value = ''
    await disposeArchive()
    resetPreviewState()
  }

  function resetPreviewState() {
    selectedBlob.value = null
    previewKind.value = 'none'
    previewText.value = ''
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
    await disposeArchive()
  })

  async function loadPreview() {
    resetPreviewState()

    const entry = selectedEntry.value
    const handle = archiveHandle.value
    if (!entry || !handle || entry.kind !== 'file') {
      return
    }

    isLoadingPreview.value = true

    try {
      const blob = await handle.readEntry(entry.path)
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
        previewKind.value = 'text'
        previewText.value = await blob.text()
        return
      }

      previewKind.value = 'none'
      previewText.value = labels.noPreview
    } catch (error) {
      previewKind.value = 'none'
      previewText.value = error instanceof Error ? error.message : labels.noPreview
    } finally {
      isLoadingPreview.value = false
    }
  }

  async function disposeArchive() {
    if (!archiveHandle.value) return
    await archiveHandle.value.dispose()
    archiveHandle.value = null
  }

  return {
    archiveFile,
    archiveHandle,
    columns,
    clearFile,
    downloadName,
    entries,
    errorMessage,
    formatBytes,
    handleBeforeUpload,
    isLoadingPreview,
    isParsing,
    labels,
    previewKind,
    previewText,
    rows,
    search,
    selectedBlobUrl,
    selectedEntry,
    tableRowProps,
    totalUncompressedSize,
  }
}

function isTextEntry(entry: ArchiveEntry, blob: Blob): boolean {
  if (blob.type.startsWith('text/')) return true
  if (blob.type.includes('json') || blob.type.includes('xml') || blob.type.includes('yaml'))
    return true
  return TEXT_EXTENSIONS.has(entry.extension)
}

function isImageEntry(entry: ArchiveEntry, blob: Blob): boolean {
  if (blob.type.startsWith('image/')) return true
  return ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(entry.extension)
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
