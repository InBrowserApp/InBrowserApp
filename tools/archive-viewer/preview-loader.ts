import {
  MAX_TEXT_PREVIEW_BYTES,
  isImageEntry,
  isPdfEntry,
  isTextEntry,
  resolveTextPreviewLanguage,
} from "./core/preview"
import { withGuessedMimeType } from "./core/mime"

import type { PreviewState } from "./components/preview-dialog"
import type { ArchiveEntry, ArchiveHandle } from "./core/types"
import type { ArchiveViewerMessages } from "./types"

type LoadedPreview = Readonly<{
  preview: PreviewState
  textDownloadUrl: string | null
}>

async function loadEntryPreview(
  handle: ArchiveHandle,
  entry: ArchiveEntry,
  messages: ArchiveViewerMessages
): Promise<LoadedPreview> {
  const blob = withGuessedMimeType(
    await handle.readEntry(entry.path),
    entry.path
  )
  const downloadUrl = URL.createObjectURL(blob)

  if (isImageEntry(entry, blob)) {
    return {
      preview: { status: "image", blob, objectUrl: downloadUrl },
      textDownloadUrl: null,
    }
  }

  if (isPdfEntry(entry, blob)) {
    return {
      preview: { status: "pdf", blob, objectUrl: downloadUrl },
      textDownloadUrl: null,
    }
  }

  if (blob.size > MAX_TEXT_PREVIEW_BYTES) {
    return {
      preview: {
        status: "unavailable",
        message: messages.previewTooLarge,
        blob,
      },
      textDownloadUrl: downloadUrl,
    }
  }

  if (isTextEntry(entry, blob)) {
    return {
      preview: {
        status: "text",
        blob,
        language: resolveTextPreviewLanguage(entry, blob),
        text: await blob.text(),
      },
      textDownloadUrl: downloadUrl,
    }
  }

  return {
    preview: { status: "unavailable", message: messages.noPreview, blob },
    textDownloadUrl: downloadUrl,
  }
}

function cleanupLoadedPreview(loadedPreview: LoadedPreview) {
  cleanupPreview(loadedPreview.preview)
  if (loadedPreview.textDownloadUrl) {
    URL.revokeObjectURL(loadedPreview.textDownloadUrl)
  }
}

function cleanupPreview(preview: PreviewState) {
  if (preview.status === "image" || preview.status === "pdf") {
    URL.revokeObjectURL(preview.objectUrl)
  }
}

export { cleanupLoadedPreview, cleanupPreview, loadEntryPreview }
