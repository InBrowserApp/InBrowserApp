import { defineComponent, markRaw } from 'vue'
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PDFMetadataSectionHeader from './PDFMetadataSectionHeader.vue'

const DummyIcon = defineComponent({
  name: 'DummyIcon',
  template: '<svg class="dummy-icon" />',
})

describe('PDFMetadataSectionHeader', () => {
  it('renders the title with the provided icon', () => {
    const wrapper = mount(PDFMetadataSectionHeader, {
      props: {
        title: 'Upload PDF',
        icon: markRaw(DummyIcon),
      },
      global: {
        stubs: {
          ToolSectionHeader: {
            template: '<h2 class="section-header"><slot /></h2>',
          },
          NFlex: {
            template: '<div class="n-flex"><slot /></div>',
          },
          NIcon: {
            template: '<div class="n-icon"><slot /></div>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Upload PDF')
    expect(wrapper.find('.dummy-icon').exists()).toBe(true)
  })
})
