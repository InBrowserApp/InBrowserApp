import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import ArchiveViewer from './ArchiveViewer.vue'
import { openArchive } from '../utils/archive-open'
import type { ArchiveEntry, ArchiveHandle } from '../types'

vi.mock('../utils/archive-open', () => ({
  openArchive: vi.fn(),
}))

const mockedOpenArchive = vi.mocked(openArchive)

const BaseStub = defineComponent({
  name: 'BaseStub',
  inheritAttrs: false,
  template: '<div><slot /></div>',
})

const CopyToClipboardButtonStub = defineComponent({
  name: 'CopyToClipboardButton',
  props: {
    content: {
      type: String,
      required: false,
      default: '',
    },
  },
  template:
    '<button data-testid="copy-preview" :data-content="content"><slot name="label" /></button>',
})

const mountViewer = () =>
  mount(ArchiveViewer, {
    global: {
      stubs: {
        ToolSection: BaseStub,
        ToolSectionHeader: BaseStub,
        CopyToClipboardButton: CopyToClipboardButtonStub,
        teleport: true,
        Teleport: true,
      },
    },
  })

const makeFile = (name: string, content = 'content') => new File([content], name)

const createArchiveHandle = (
  entries: ArchiveEntry[],
  readBlob: Blob | Error,
  format: ArchiveHandle['format'] = 'zip',
) => {
  const readEntry =
    readBlob instanceof Error
      ? vi.fn(async () => {
          throw readBlob
        })
      : vi.fn(async () => readBlob)
  const dispose = vi.fn(async () => undefined)

  return {
    handle: {
      format,
      entries,
      readEntry,
      dispose,
    } satisfies ArchiveHandle,
    readEntry,
    dispose,
  }
}

async function uploadSingleFile(wrapper: ReturnType<typeof mountViewer>, file: File) {
  const fileInput = wrapper.find('input[type="file"]')
  if (!fileInput.exists()) {
    throw new Error('Missing file input')
  }

  Object.defineProperty(fileInput.element, 'files', {
    configurable: true,
    value: [file],
  })

  await fileInput.trigger('change')
  await flushPromises()
}

async function clickTableRowByText(wrapper: ReturnType<typeof mountViewer>, text: string) {
  const row = wrapper.findAll('tbody tr').find((candidate) => candidate.text().includes(text))
  if (!row) {
    throw new Error(`Missing table row: ${text}`)
  }

  await row.trigger('click')
  await flushPromises()
}

let createObjectUrlSpy: ReturnType<typeof vi.spyOn> | null = null
let revokeObjectUrlSpy: ReturnType<typeof vi.spyOn> | null = null
let showOpenFilePickerSpy: ReturnType<typeof vi.spyOn> | null = null

beforeEach(() => {
  mockedOpenArchive.mockReset()

  const url = URL as Partial<typeof URL>
  if (!url.createObjectURL) {
    Object.defineProperty(URL, 'createObjectURL', {
      value: vi.fn(() => 'blob:mock'),
      writable: true,
    })
  }

  if (!url.revokeObjectURL) {
    Object.defineProperty(URL, 'revokeObjectURL', {
      value: vi.fn(() => undefined),
      writable: true,
    })
  }

  createObjectUrlSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock')
  revokeObjectUrlSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)

  const pickerWindow = window as Window & {
    showOpenFilePicker?: () => Promise<Array<{ getFile: () => Promise<File> }>>
  }

  if (!pickerWindow.showOpenFilePicker) {
    Object.defineProperty(pickerWindow, 'showOpenFilePicker', {
      value: vi.fn(),
      writable: true,
    })
  }

  showOpenFilePickerSpy = vi
    .spyOn(
      pickerWindow as {
        showOpenFilePicker: () => Promise<Array<{ getFile: () => Promise<File> }>>
      },
      'showOpenFilePicker',
    )
    .mockRejectedValue(new DOMException('cancelled', 'AbortError'))
})

afterEach(() => {
  createObjectUrlSpy?.mockRestore()
  revokeObjectUrlSpy?.mockRestore()
  showOpenFilePickerSpy?.mockRestore()

  createObjectUrlSpy = null
  revokeObjectUrlSpy = null
  showOpenFilePickerSpy = null
})

describe('ArchiveViewer', () => {
  it('opens archive and supports directory-style navigation', async () => {
    const entries: ArchiveEntry[] = [
      {
        path: 'docs/',
        size: 0,
        compressedSize: null,
        kind: 'directory',
        modifiedAt: null,
        extension: '',
      },
      {
        path: 'docs/readme.txt',
        size: 11,
        compressedSize: 9,
        kind: 'file',
        modifiedAt: new Date('2025-01-01T00:00:00.000Z'),
        extension: 'txt',
      },
    ]

    const { handle } = createArchiveHandle(
      entries,
      new Blob(['hello world'], { type: 'text/plain' }),
    )
    mockedOpenArchive.mockResolvedValue(handle)

    const wrapper = mountViewer()
    const file = makeFile('docs.zip')
    await uploadSingleFile(wrapper, file)

    expect(mockedOpenArchive).toHaveBeenCalledWith(file)
    expect(wrapper.text()).toContain('Archive explorer')

    await clickTableRowByText(wrapper, 'docs')
    expect(wrapper.findAll('tbody tr').some((row) => row.text().includes('readme.txt'))).toBe(true)

    const upButton = wrapper.find('button[aria-label="Up"]')
    expect(upButton.exists()).toBe(true)

    await upButton.trigger('click')
    await flushPromises()

    expect(wrapper.findAll('tbody tr').some((row) => row.text().includes('docs'))).toBe(true)
    expect(wrapper.find('button[aria-label="Up"]').exists()).toBe(false)
  })

  it('opens modal preview for files and exposes download link', async () => {
    const entries: ArchiveEntry[] = [
      {
        path: 'readme.txt',
        size: 11,
        compressedSize: 9,
        kind: 'file',
        modifiedAt: null,
        extension: 'txt',
      },
    ]

    const { handle, readEntry } = createArchiveHandle(
      entries,
      new Blob(['hello world'], { type: 'text/plain' }),
    )
    mockedOpenArchive.mockResolvedValue(handle)

    const wrapper = mountViewer()
    await uploadSingleFile(wrapper, makeFile('single.zip'))

    await clickTableRowByText(wrapper, 'readme.txt')

    expect(readEntry).toHaveBeenCalledWith('readme.txt')

    const codeBlock = wrapper.find('code')
    expect(codeBlock.exists()).toBe(true)
    expect(codeBlock.text()).toContain('hello world')

    const downloadLink = wrapper
      .findAll('a')
      .find((link) => link.attributes('download') === 'readme.txt')
    if (!downloadLink) {
      throw new Error('Missing download link')
    }

    expect(downloadLink.text()).toContain('Download')
    expect(downloadLink.attributes('href')).toBe('blob:mock')
    expect(downloadLink.attributes('download')).toBe('readme.txt')
  })

  it('renders image preview when clicking an image file', async () => {
    const entries: ArchiveEntry[] = [
      {
        path: 'image.png',
        size: 4,
        compressedSize: 4,
        kind: 'file',
        modifiedAt: null,
        extension: 'png',
      },
    ]

    const { handle } = createArchiveHandle(
      entries,
      new Blob([new Uint8Array([137, 80, 78, 71])], { type: 'image/png' }),
    )
    mockedOpenArchive.mockResolvedValue(handle)

    const wrapper = mountViewer()
    await uploadSingleFile(wrapper, makeFile('image.zip'))

    await clickTableRowByText(wrapper, 'image.png')

    const image = wrapper.find('img')
    expect(image.exists()).toBe(true)
    expect(image.attributes('src')).toBe('blob:mock')
  })

  it('shows informational preview fallback for unsupported file types', async () => {
    const entries: ArchiveEntry[] = [
      {
        path: 'binary.bin',
        size: 3,
        compressedSize: 3,
        kind: 'file',
        modifiedAt: null,
        extension: 'bin',
      },
    ]

    const { handle } = createArchiveHandle(
      entries,
      new Blob([new Uint8Array([1, 2, 3])], { type: 'application/octet-stream' }),
    )
    mockedOpenArchive.mockResolvedValue(handle)

    const wrapper = mountViewer()
    await uploadSingleFile(wrapper, makeFile('binary.zip'))

    await clickTableRowByText(wrapper, 'binary.bin')

    expect(wrapper.text()).toContain('Preview is not available for this file type.')
  })

  it('shows parse errors when archive cannot be opened', async () => {
    mockedOpenArchive.mockRejectedValue(new Error('invalid archive file'))

    const wrapper = mountViewer()
    await uploadSingleFile(wrapper, makeFile('broken.zip'))

    expect(wrapper.text()).toContain('invalid archive file')
  })

  it('rejects unsupported file extensions before parsing', async () => {
    const wrapper = mountViewer()
    await uploadSingleFile(wrapper, makeFile('wrong.rar'))

    expect(mockedOpenArchive).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('Unsupported file format')
  })

  it('chooses a new archive via browser picker and replaces opened archive', async () => {
    const firstEntries: ArchiveEntry[] = [
      {
        path: 'note.txt',
        size: 4,
        compressedSize: 3,
        kind: 'file',
        modifiedAt: null,
        extension: 'txt',
      },
    ]
    const secondEntries: ArchiveEntry[] = [
      {
        path: 'next.txt',
        size: 5,
        compressedSize: 4,
        kind: 'file',
        modifiedAt: null,
        extension: 'txt',
      },
    ]

    const first = createArchiveHandle(firstEntries, new Blob(['first']))
    const second = createArchiveHandle(secondEntries, new Blob(['second']))
    mockedOpenArchive.mockResolvedValueOnce(first.handle).mockResolvedValueOnce(second.handle)

    const nextFile = makeFile('next.zip', 'next')
    showOpenFilePickerSpy?.mockResolvedValueOnce([
      {
        getFile: async () => nextFile,
      },
    ])

    const wrapper = mountViewer()
    await uploadSingleFile(wrapper, makeFile('clear.zip'))

    const chooseButton = wrapper
      .findAll('button')
      .find((button) => button.text() === 'Choose another archive')
    if (!chooseButton) {
      throw new Error('Missing choose button')
    }

    await chooseButton.trigger('click')
    await flushPromises()

    expect(showOpenFilePickerSpy).toHaveBeenCalledTimes(1)
    expect(mockedOpenArchive).toHaveBeenCalledTimes(2)
    expect((first.dispose as ReturnType<typeof vi.fn>).mock.calls.length).toBe(1)
    expect(wrapper.text()).toContain('next.zip')
    expect(wrapper.text()).not.toContain('clear.zip')
  })
})
