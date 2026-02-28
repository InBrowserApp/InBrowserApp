import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CameraOutput from './CameraOutput.vue'

const NButtonStub = {
  props: ['tag', 'href', 'download'],
  emits: ['click'],
  template:
    '<component :is="tag || \'button\'" :href="href" :download="download" @click="$emit(\'click\')"><slot /><slot name="icon" /></component>',
}

const mountOutput = (
  overrides: Partial<{
    outputKind: 'photo' | 'video' | ''
    outputUrl: string
    displayMimeType: string
    fileSizeLabel: string
    downloadName: string
  }> = {},
) =>
  mount(CameraOutput, {
    props: {
      outputKind: 'photo',
      outputUrl: 'blob:photo',
      displayMimeType: 'image/jpeg',
      fileSizeLabel: '1.0 KB',
      downloadName: 'photo.jpg',
      ...overrides,
    },
    global: {
      stubs: {
        ToolSection: { template: '<section><slot /></section>' },
        ToolSectionHeader: { template: '<h3><slot /></h3>' },
        NFlex: { template: '<div><slot /></div>' },
        NGrid: { template: '<div><slot /></div>' },
        NGi: { template: '<div><slot /></div>' },
        NText: { template: '<span><slot /></span>' },
        NIcon: { template: '<span />' },
        NButton: NButtonStub,
      },
    },
  })

describe('CameraOutput', () => {
  it('renders a photo output and emits clear', async () => {
    const wrapper = mountOutput()

    expect(wrapper.find('img').attributes('src')).toBe('blob:photo')
    expect(wrapper.find('a[download="photo.jpg"]').attributes('href')).toBe('blob:photo')

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('clear')).toBeTruthy()
  })

  it('renders a video output when kind is video', () => {
    const wrapper = mountOutput({ outputKind: 'video', outputUrl: 'blob:video' })

    expect(wrapper.find('video').attributes('src')).toBe('blob:video')
  })
})
