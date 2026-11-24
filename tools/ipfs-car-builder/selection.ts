import type { UnixFsSource } from "@workspace/ipfs-files/import"

export function sourcesFromFiles(files: readonly File[]): UnixFsSource[] {
  return files.map((file) => ({
    path: file.webkitRelativePath || file.name,
    file,
  }))
}

async function visit(
  entry: FileSystemEntry,
  signal: AbortSignal,
  out: UnixFsSource[]
) {
  signal.throwIfAborted()
  const path = entry.fullPath.slice(1)
  if (entry.isFile) {
    const file = await new Promise<File>((resolve, reject) =>
      (entry as FileSystemFileEntry).file(resolve, reject)
    )
    out.push({ path, file })
    return
  }

  const reader = (entry as FileSystemDirectoryEntry).createReader()
  out.push({ path })
  while (true) {
    signal.throwIfAborted()
    const entries = await new Promise<FileSystemEntry[]>((resolve, reject) =>
      reader.readEntries(resolve, reject)
    )
    if (entries.length === 0) return
    for (const child of entries) await visit(child, signal, out)
  }
}

export function dropSource(transfer: DataTransfer) {
  const files = Array.from(transfer.files)
  const entries = Array.from(transfer.items ?? [])
    .map((item) => item.webkitGetAsEntry?.())
    .filter((entry): entry is FileSystemEntry => Boolean(entry))

  return async (signal: AbortSignal) => {
    if (entries.length === 0) return sourcesFromFiles(files)
    const result: UnixFsSource[] = []
    for (const entry of entries) await visit(entry, signal, result)
    return result
  }
}
