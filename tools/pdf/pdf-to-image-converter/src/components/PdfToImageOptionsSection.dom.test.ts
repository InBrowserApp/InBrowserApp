import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const wrapper = (name: string) =>
    defineComponent({
      name,
      template: '<div><slot /></div>',
    })

  return {
    NButton: wrapper('NButton'),
    NButtonGroup: wrapper('NButtonGroup'),
    NFlex: wrapper('NFlex'),
    NForm: wrapper('NForm'),
    NFormItem: wrapper('NFormItem'),
    NInputNumber: defineComponent({
      name: 'NInputNumber',
      emits: ['update:value'],
      template: '<div class="n-input-number" />',
    }),
    NSlider: defineComponent({
      name: 'NSlider',
      emits: ['update:value'],
      template: '<div class="n-slider" />',
    }),
    NSelect: defineComponent({
      name: 'NSelect',
      emits: ['update:value'],
      template: '<div class="n-select" />',
    }),
    NText: wrapper('NText'),
  }
})

vi.mock('@shared/ui/tool', async () => {
  const { defineComponent } = await import('vue')
  return {
    ToolSection: defineComponent({
      name: 'ToolSection',
      template: '<section><slot /></section>',
    }),
    ToolSectionHeader: defineComponent({
      name: 'ToolSectionHeader',
      template: '<h2><slot /></h2>',
    }),
  }
})

import PdfToImageOptionsSection from './PdfToImageOptionsSection.vue'

const ExportActionsStub = defineComponent({
  name: 'PdfToImageExportActions',
  emits: ['export-all'],
  template: '<button class="export-all" @click="$emit(\'export-all\')">export-all</button>',
})

const baseProps = {
  format: 'jpeg' as const,
  dpi: 144,
  quality: 0.9,
  numPages: 5,
  hasCurrentImage: true,
  isRendering: false,
  isExporting: false,
  exportProgress: 0,
  currentDownloadUrl: 'blob:current',
  currentDownloadName: 'p1.jpg',
  zipDownloadUrl: null,
  zipDownloadName: 'all.zip',
}

function mountComponent(
  props: Partial<InstanceType<typeof PdfToImageOptionsSection>['$props']> = {},
) {
  return mount(PdfToImageOptionsSection, {
    props: {
      ...baseProps,
      ...props,
    },
    global: {
      stubs: {
        PdfToImageExportActions: ExportActionsStub,
      },
    },
  })
}

describe('PdfToImageOptionsSection', () => {
  it('emits format, dpi, and quality updates', async () => {
    const wrapper = mountComponent()

    await wrapper.findComponent({ name: 'NSelect' }).vm.$emit('update:value', 'webp')
    await wrapper.findComponent({ name: 'NInputNumber' }).vm.$emit('update:value', 300)
    await wrapper.findComponent({ name: 'NSlider' }).vm.$emit('update:value', 0.8)

    expect(wrapper.emitted('update:format')?.[0]).toEqual(['webp'])
    expect(wrapper.emitted('update:dpi')?.[0]).toEqual([300])
    expect(wrapper.emitted('update:quality')?.[0]).toEqual([0.8])
  })

  it('re-emits export-all from child actions component', async () => {
    const wrapper = mountComponent()

    await wrapper.get('button.export-all').trigger('click')

    expect(wrapper.emitted('export-all')).toHaveLength(1)
  })

  it('hides quality controls for png format', () => {
    const wrapper = mountComponent({ format: 'png' })

    expect(wrapper.findComponent({ name: 'NSlider' }).exists()).toBe(false)
  })
})
