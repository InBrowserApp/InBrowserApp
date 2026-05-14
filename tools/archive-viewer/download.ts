import { safeDownloadName } from "./core/path"

import type { ArchiveEntry, ArchiveHandle } from "./core/types"

async function downloadArchiveEntry(
  handle: ArchiveHandle,
  entry: ArchiveEntry
) {
  const blob = await handle.readEntry(entry.path)
  const url = URL.createObjectURL(blob)
  triggerDownload(url, safeDownloadName(entry.path))
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function triggerDownload(url: string, fileName: string) {
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = fileName
  anchor.rel = "noopener"
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
}

export { downloadArchiveEntry }
