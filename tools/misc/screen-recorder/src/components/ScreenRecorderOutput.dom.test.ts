import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { NInput } from 'naive-ui'
import ScreenRecorderOutput from './ScreenRecorderOutput.vue'

describe('ScreenRecorderOutput', () => {
  it('shows fallback values when mime type, file name, and blob are missing', () => {
    const wrapper = mount(ScreenRecorderOutput, {
      props: {
        recordingBlob: null,
        recordingUrl: 'blob:video',
        mimeType: '',
        fileName: '   ',
        onClear: vi.fn(),
      },
      global: {
        stubs: {
          ToolSection: { template: '<section><slot /></section>' },
          ToolSectionHeader: { template: '<h3><slot /></h3>' },
        },
      },
    })

    expect(wrapper.text()).toContain('Unknown')
    expect(wrapper.text()).toContain('0 B')

    const downloadLink = wrapper.find('a[download]')
    expect(downloadLink.attributes('download')).toBe('screen-recording.webm')
  })

  it('emits file name updates, formats details, and clears output', async () => {
    const onClear = vi.fn()
    const onUpdateFileName = vi.fn()
    const wrapper = mount(ScreenRecorderOutput, {
      props: {
        recordingBlob: new Blob([new Uint8Array(2048)], { type: 'video/mp4' }),
        recordingUrl: 'blob:video',
        mimeType: 'video/mp4',
        fileName: 'recording',
        onClear,
        'onUpdate:fileName': onUpdateFileName,
      },
      global: {
        stubs: {
          ToolSection: { template: '<section><slot /></section>' },
          ToolSectionHeader: { template: '<h3><slot /></h3>' },
        },
      },
    })

    expect(wrapper.text()).toContain('video/mp4')
    expect(wrapper.text()).toContain('2.0 KB')

    const downloadLink = wrapper.find('a[download]')
    expect(downloadLink.attributes('download')).toBe('recording.mp4')

    wrapper.findComponent(NInput).vm.$emit('update:value', 'renamed')
    await wrapper.vm.$nextTick()
    expect(onUpdateFileName).toHaveBeenCalledWith('renamed')

    const clearButton = wrapper
      .findAll('button')
      .find((candidate) => candidate.text().trim().includes('Clear'))
    expect(clearButton).toBeTruthy()

    await clearButton!.trigger('click')
    expect(onClear).toHaveBeenCalledTimes(1)
  })
})
