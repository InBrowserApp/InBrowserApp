import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import DataUriDownloadSection from './DataUriDownloadSection.vue'

const ToolSectionStub = defineComponent({
  template: '<section><slot /></section>',
})

const NFlexStub = defineComponent({
  template: '<div><slot /></div>',
})

const NButtonStub = defineComponent({
  props: {
    href: String,
    download: String,
    disabled: Boolean,
    tag: String,
  },
  template:
    '<a :href="href" :download="download" :data-disabled="disabled"><slot name="icon" /><slot /></a>',
})

describe('DataUriDownloadSection', () => {
  it('disables download when no url is provided', () => {
    const wrapper = mount(DataUriDownloadSection, {
      props: {
        downloadUrl: undefined,
        downloadName: 'data.txt',
      },
      global: {
        stubs: {
          ToolSection: ToolSectionStub,
          NFlex: NFlexStub,
          NButton: NButtonStub,
          NIcon: true,
        },
      },
    })

    const link = wrapper.get('a')
    expect(link.attributes('download')).toBe('data.txt')
    expect(link.attributes('href')).toBeUndefined()
  })

  it('passes download attributes when url is available', () => {
    const wrapper = mount(DataUriDownloadSection, {
      props: {
        downloadUrl: 'blob:demo',
        downloadName: 'file.bin',
      },
      global: {
        stubs: {
          ToolSection: ToolSectionStub,
          NFlex: NFlexStub,
          NButton: NButtonStub,
          NIcon: true,
        },
      },
    })

    const link = wrapper.get('a')
    expect(link.attributes('href')).toBe('blob:demo')
    expect(link.attributes('download')).toBe('file.bin')
  })
})
