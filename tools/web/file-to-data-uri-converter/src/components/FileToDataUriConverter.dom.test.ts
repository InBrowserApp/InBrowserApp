import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import FileToDataUriConverter from './FileToDataUriConverter.vue'

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
    const wrapper = mount(FileToDataUriConverter)

    expect(wrapper.text()).not.toContain('data:text/plain')

    const file = new File(['Hello'], 'hello.txt', { type: 'text/plain' })
    await wrapper.vm.$nextTick()

    await (wrapper.vm as any).handleBeforeUpload({
      file: { file } as any,
      fileList: [{ file } as any],
    })
    await flushPromises()

    expect(wrapper.text()).toContain('data:text/plain')
  })

  it('shows error when file read fails', async () => {
    const wrapper = mount(FileToDataUriConverter)

    const file = new File(['Hello'], 'fail.txt', { type: 'text/plain' })
    await (wrapper.vm as any).handleBeforeUpload({
      file: { file } as any,
      fileList: [{ file } as any],
    })
    await flushPromises()

    expect(wrapper.text()).toContain('read-failed')
  })

  it('clears output when file is cleared', async () => {
    const wrapper = mount(FileToDataUriConverter)

    const file = new File(['Hello'], 'hello.txt', { type: 'text/plain' })
    await (wrapper.vm as any).handleBeforeUpload({
      file: { file } as any,
      fileList: [{ file } as any],
    })
    await flushPromises()

    ;(wrapper.vm as any).clearFile()
    await flushPromises()

    expect(wrapper.text()).not.toContain('data:text/plain')
  })
})
