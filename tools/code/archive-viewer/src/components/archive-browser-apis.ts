import type { ArchiveEntry, ArchiveHandle } from '../types'

type BrowserFileHandle = {
  getFile: () => Promise<File>
}

type BrowserPickerWindow = Window & {
  showOpenFilePicker?: (options?: {
    multiple?: boolean
    excludeAcceptAllOption?: boolean
    types?: Array<{
      description?: string
      accept: Record<string, string[]>
    }>
  }) => Promise<BrowserFileHandle[]>
}

type FileWriterHandle = {
  write: (data: Blob) => Promise<void>
  close: () => Promise<void>
}

type FileHandle = {
  createWritable: () => Promise<FileWriterHandle>
}

export type DirectoryHandle = {
  getDirectoryHandle: (
    name: string,
    options?: {
      create?: boolean
    },
  ) => Promise<DirectoryHandle>
  getFileHandle: (
    name: string,
    options?: {
      create?: boolean
    },
  ) => Promise<FileHandle>
}

export type ExportArchiveProgress = {
  completedFiles: number
  totalFiles: number
}

type BrowserDirectoryWindow = Window & {
  showDirectoryPicker?: () => Promise<DirectoryHandle>
}

export function supportsImageClipboard(blob: Blob | null): boolean {
  if (!blob || !blob.type.startsWith('image/')) {
    return false
  }

  if (typeof ClipboardItem === 'undefined') {
    return false
  }

  return typeof navigator !== 'undefined' && typeof navigator.clipboard?.write === 'function'
}

export async function copyImageToClipboard(blob: Blob): Promise<void> {
  const clipboardItem = new ClipboardItem({ [blob.type || 'image/png']: blob })
  await navigator.clipboard.write([clipboardItem])
}

export async function pickArchiveFile(acceptedSuffixes: string[]): Promise<File | null> {
  const pickerWindow = window as BrowserPickerWindow
  if (typeof pickerWindow.showOpenFilePicker === 'function') {
    const [fileHandle] = await pickerWindow.showOpenFilePicker({
      multiple: false,
      excludeAcceptAllOption: false,
      types: [
        {
          description: 'Archive files',
          accept: {
            'application/octet-stream': acceptedSuffixes,
          },
        },
      ],
    })

    if (!fileHandle) {
      return null
    }

    return await fileHandle.getFile()
  }

  return await pickArchiveFileWithInput(acceptedSuffixes)
}

export async function pickDirectoryForExport(): Promise<DirectoryHandle | null> {
  const pickerWindow = window as BrowserDirectoryWindow
  if (typeof pickerWindow.showDirectoryPicker !== 'function') {
    throw new Error('Your browser does not support folder export.')
  }

  return await pickerWindow.showDirectoryPicker()
}

export async function exportArchiveEntriesToDirectory(params: {
  directoryHandle: DirectoryHandle
  entries: ArchiveEntry[]
  readEntry: ArchiveHandle['readEntry']
  onProgress?: (progress: ExportArchiveProgress) => void
}): Promise<void> {
  const totalFiles = params.entries.reduce(
    (count, entry) => count + (entry.kind === 'file' ? 1 : 0),
    0,
  )
  let completedFiles = 0

  params.onProgress?.({ completedFiles, totalFiles })

  for (const entry of params.entries) {
    if (entry.kind === 'directory') {
      await ensureDirectory(params.directoryHandle, entry.path)
      continue
    }

    if (entry.kind !== 'file') {
      continue
    }

    const blob = await params.readEntry(entry.path)
    await writeFile(params.directoryHandle, entry.path, blob)

    completedFiles += 1
    params.onProgress?.({ completedFiles, totalFiles })
  }
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

function pickArchiveFileWithInput(acceptedSuffixes: string[]): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = acceptedSuffixes.join(',')

    const handleSelection = () => {
      const file = input.files?.[0] ?? null
      input.removeEventListener('change', handleSelection)
      resolve(file)
    }

    input.addEventListener('change', handleSelection, { once: true })
    input.click()
  })
}

async function ensureDirectory(
  rootHandle: DirectoryHandle,
  path: string,
): Promise<DirectoryHandle> {
  const directorySegments = splitPath(path)
  let currentHandle = rootHandle

  for (const segment of directorySegments) {
    currentHandle = await currentHandle.getDirectoryHandle(segment, { create: true })
  }

  return currentHandle
}

async function writeFile(rootHandle: DirectoryHandle, path: string, blob: Blob): Promise<void> {
  const segments = splitPath(path)
  if (!segments.length) {
    return
  }

  const fileName = segments.pop()
  if (!fileName) {
    return
  }

  const directoryPath = segments.join('/')
  const directoryHandle = await ensureDirectory(rootHandle, directoryPath)

  const fileHandle = await directoryHandle.getFileHandle(fileName, { create: true })
  const writable = await fileHandle.createWritable()
  await writable.write(blob)
  await writable.close()
}

function splitPath(path: string): string[] {
  return path.split('/').filter((segment) => segment && segment !== '.' && segment !== '..')
}
