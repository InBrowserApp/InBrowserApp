import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { messages } from './locale/archive-viewer-messages'

export type ArchiveViewerLabels = {
  uploadTitle: string
  uploadHint: string
  supportedFormats: string
  unsupportedFormat: string
  selectFileFailed: string
  selectNewFile: string
  localNote: string
  parsingArchive: string
  entriesTitle: string
  exportAllEntries: string
  exportingAllEntries: string
  exportSucceeded: string
  exportFailed: string
  searchPlaceholder: string
  rootFolder: string
  goToParent: string
  emptyFolder: string
  previewTitle: string
  noSelection: string
  loadingPreview: string
  noPreview: string
  previewTooLarge: string
  downloadEntry: string
  copyPreview: string
  errorTitle: string
  columnName: string
  columnKind: string
  columnSize: string
  columnModified: string
  kindFile: string
  kindDirectory: string
  kindSymlink: string
  parseFailed: string
}

export function useArchiveViewerLabels() {
  const { t } = useI18n({ messages })
  return computed<ArchiveViewerLabels>(() => ({
    uploadTitle: t('upload-title'),
    uploadHint: t('upload-hint'),
    supportedFormats: t('supported-formats'),
    unsupportedFormat: t('unsupported-format'),
    selectFileFailed: t('select-file-failed'),
    selectNewFile: t('select-new-file'),
    localNote: t('local-note'),
    parsingArchive: t('parsing-archive'),
    entriesTitle: t('entries-title'),
    exportAllEntries: t('export-all-entries'),
    exportingAllEntries: t('exporting-all-entries'),
    exportSucceeded: t('export-succeeded'),
    exportFailed: t('export-failed'),
    searchPlaceholder: t('search-placeholder'),
    rootFolder: t('root-folder'),
    goToParent: t('go-to-parent'),
    emptyFolder: t('empty-folder'),
    previewTitle: t('preview-title'),
    noSelection: t('no-selection'),
    loadingPreview: t('loading-preview'),
    noPreview: t('no-preview'),
    previewTooLarge: t('preview-too-large'),
    downloadEntry: t('download-entry'),
    copyPreview: t('copy-preview'),
    errorTitle: t('error-title'),
    columnName: t('column-name'),
    columnKind: t('column-kind'),
    columnSize: t('column-size'),
    columnModified: t('column-modified'),
    kindFile: t('kind-file'),
    kindDirectory: t('kind-directory'),
    kindSymlink: t('kind-symlink'),
    parseFailed: t('parse-failed'),
  }))
}
