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
})
