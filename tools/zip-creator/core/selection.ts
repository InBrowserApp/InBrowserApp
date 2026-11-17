import type { InputItem, ZipItem } from "../types"

type DropItem = Readonly<{ entry: FileSystemEntry | null; file: File | null }>

export type FolderHandle = Readonly<{
  name: string
  kind: "directory"
  values: () => AsyncIterable<
    | FolderHandle
    | Readonly<{
        kind: "file"
        name: string
        getFile: () => Promise<File>
      }>
  >
}>

// Drag data is protected after the drop handler returns: capture it before awaiting.
export function captureDrop(data: DataTransfer): DropItem[] {
  const sources = Array.from(data.items).filter((item) => item.kind === "file")
  return sources.length
    ? sources.map((item) => ({
        entry: item.webkitGetAsEntry?.() ?? null,
        file: item.getAsFile(),
      }))
    : Array.from(data.files, (file) => ({ entry: null, file }))
}

export function selectFiles(files: readonly File[]): ZipItem[] {
  return files.map((file) => ({
    path: file.webkitRelativePath || file.name,
    file,
  }))
}

export async function readDrop(
  sources: readonly DropItem[],
  signal: AbortSignal
) {
  const items: InputItem[] = []
  const pending = sources
    .map((source, root) => ({
      ...source,
      parent: "",
      root,
    }))
    .reverse()
  while (pending.length) {
    signal.throwIfAborted()
    const { entry, file, parent, root } = pending.pop()!
    if (!entry) {
      if (!file) throw new Error("Unreadable dropped item")
      items.push({ path: file.name, file, root })
    } else if (entry.isFile) {
      const selected = await new Promise<File>((resolve, reject) => {
        ;(entry as FileSystemFileEntry).file(resolve, reject)
      })
      items.push({ path: `${parent}${entry.name}`, file: selected, root })
    } else {
      const path = `${parent}${entry.name}`
      items.push({ path, file: null, root })
      const reader = (entry as FileSystemDirectoryEntry).createReader()
      // Chromium returns at most 100 entries per batch. Keep the same reader.
      while (true) {
        signal.throwIfAborted()
        const batch = await new Promise<FileSystemEntry[]>(
          (resolve, reject) => {
            reader.readEntries(resolve, reject)
          }
        )
        if (batch.length === 0) break
        for (const child of batch) {
          pending.push({ entry: child, file: null, parent: `${path}/`, root })
        }
      }
    }
  }
  signal.throwIfAborted()
  if (!items.length) throw new Error("No readable files or folders")
  return items
}

export async function readFolder(
  handle: FolderHandle,
  signal: AbortSignal,
  parent = ""
): Promise<ZipItem[]> {
  signal.throwIfAborted()
  const path = `${parent}${handle.name}`
  const items: ZipItem[] = [{ path, file: null }]
  for await (const child of handle.values()) {
    signal.throwIfAborted()
    if (child.kind === "directory") {
      for (const item of await readFolder(child, signal, `${path}/`)) {
        items.push(item)
      }
    } else {
      items.push({ path: `${path}/${child.name}`, file: await child.getFile() })
    }
  }
  signal.throwIfAborted()
  return items
}
