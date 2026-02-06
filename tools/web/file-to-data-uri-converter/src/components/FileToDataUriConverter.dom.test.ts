import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h, type ComponentPublicInstance } from 'vue'
import { NMessageProvider, type UploadFileInfo } from 'naive-ui'
import FileToDataUriConverter from './FileToDataUriConverter.vue'

// Wrapper component with NMessageProvider
const TestWrapper = {
  setup() {
    return () => h(NMessageProvider, () => h(FileToDataUriConverter))
  },
}

const originalFileReader = globalThis.FileReader

class MockFileReader {
  public result: string | null = null
  public onload: null | (() => void) = null
  public onerror: null | (() => void) = null

  readAsDataURL(file: File) {
    if (file.name === 'fail.txt') {
      this.onerror?.()
      return
    }
    if (file.name === 'empty-result.txt') {
      this.result = null
      this.onload?.()
      return
    }

    this.result = 'data:text/plain;base64,SGVsbG8='
    this.onload?.()
  }
}

type ExposedConverterMethods = {
  handleBeforeUpload: (data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) => unknown
  clearFile: () => void
}

const createUploadInfo = (file: File): UploadFileInfo => ({
  id: file.name,
  name: file.name,
  status: 'pending',
  file,
  type: file.type,
})

function getConverterVm(wrapper: ReturnType<typeof mount>) {
  const inner = wrapper.findComponent(FileToDataUriConverter)
  return inner.vm as ComponentPublicInstance & ExposedConverterMethods
}

describe('FileToDataUriConverter', () => {
  beforeAll(() => {
    vi.stubGlobal('FileReader', MockFileReader)
  })

  afterAll(() => {
    if (originalFileReader) {
      vi.stubGlobal('FileReader', originalFileReader)
    }
  })

  it('shows Data URI section after upload', async () => {
    const wrapper = mount(TestWrapper)
    const vm = getConverterVm(wrapper)

    expect(wrapper.text()).not.toContain('data:text/plain')

    const file = new File(['Hello'], 'hello.txt', { type: 'text/plain' })
    const fileInfo = createUploadInfo(file)
    await wrapper.vm.$nextTick()

    await vm.handleBeforeUpload({
      file: fileInfo,
      fileList: [fileInfo],
    })
    await flushPromises()

    expect(wrapper.text()).toContain('data:text/plain')
  })

  it('shows error when file read fails', async () => {
    const wrapper = mount(TestWrapper)
    const vm = getConverterVm(wrapper)

    const file = new File(['Hello'], 'fail.txt', { type: 'text/plain' })
    const fileInfo = createUploadInfo(file)
    await vm.handleBeforeUpload({
      file: fileInfo,
      fileList: [fileInfo],
    })
    await flushPromises()

    expect(wrapper.text()).toContain('Failed to read file')
  })

  it('clears output when file is cleared', async () => {
    const wrapper = mount(TestWrapper)
    const vm = getConverterVm(wrapper)

    const file = new File(['Hello'], 'hello.txt', { type: 'text/plain' })
    const fileInfo = createUploadInfo(file)
    await vm.handleBeforeUpload({
      file: fileInfo,
      fileList: [fileInfo],
    })
    await flushPromises()

    vm.clearFile()
    await flushPromises()

    expect(wrapper.text()).not.toContain('data:text/plain')
  })

  it('shows validation error when multiple files are provided', async () => {
    const wrapper = mount(TestWrapper)
    const vm = getConverterVm(wrapper)

    const fileA = new File(['A'], 'a.txt', { type: 'text/plain' })
    const fileB = new File(['B'], 'b.txt', { type: 'text/plain' })
    const fileInfoA = createUploadInfo(fileA)
    const fileInfoB = createUploadInfo(fileB)

    await vm.handleBeforeUpload({
      file: fileInfoA,
      fileList: [fileInfoA, fileInfoB],
    })
    await flushPromises()

    expect(wrapper.text()).toContain('Only one file can be uploaded')
  })

  it('returns early when upload info has no file', async () => {
    const wrapper = mount(TestWrapper)
    const vm = getConverterVm(wrapper)

    const emptyInfo = {
      id: 'none',
      name: 'none',
      status: 'pending',
      file: undefined,
      type: '',
    } as unknown as UploadFileInfo

    await vm.handleBeforeUpload({
      file: emptyInfo,
      fileList: [emptyInfo],
    })
    await flushPromises()

    expect(wrapper.text()).toContain('Click or drag to upload a file')
    expect(wrapper.text()).not.toContain('Failed to read file')
  })

  it('shows unknown type and zero-byte summary for empty files', async () => {
    const wrapper = mount(TestWrapper)
    const vm = getConverterVm(wrapper)

    const emptyFile = new File([], 'empty.bin', { type: '' })
    const fileInfo = createUploadInfo(emptyFile)

    await vm.handleBeforeUpload({
      file: fileInfo,
      fileList: [fileInfo],
    })
    await flushPromises()

    expect(wrapper.text()).toContain('0 Bytes')
    expect(wrapper.text()).toContain('Unknown type')
  })

  it('shows placeholder when FileReader returns an empty result', async () => {
    const wrapper = mount(TestWrapper)
    const vm = getConverterVm(wrapper)

    const file = new File(['hello'], 'empty-result.txt', { type: 'text/plain' })
    const fileInfo = createUploadInfo(file)

    await vm.handleBeforeUpload({
      file: fileInfo,
      fileList: [fileInfo],
    })
    await flushPromises()

    expect(wrapper.text()).toContain('Generated Data URI will appear here...')
    expect(wrapper.text()).not.toContain('Failed to read file')
  })

  it('keeps the computed file summary empty before a file is selected', () => {
    const wrapper = mount(TestWrapper)
    const state = (
      wrapper.findComponent(FileToDataUriConverter).vm.$ as unknown as {
        setupState: { fileSummary: string }
      }
    ).setupState

    expect(state.fileSummary).toBe('')
  })
})
