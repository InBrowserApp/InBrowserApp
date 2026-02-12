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
