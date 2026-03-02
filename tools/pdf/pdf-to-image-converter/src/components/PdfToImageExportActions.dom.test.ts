import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const wrapper = (name: string) =>
    defineComponent({
      name,
      template: '<div><slot /></div>',
    })
  const actual = (await vi.importActual('naive-ui')) as Record<string, unknown>
  return {
    ...actual,
    NButton: defineComponent({
      name: 'NButton',
      props: {
        disabled: {
          type: Boolean,
          default: false,
        },
      },
      emits: ['click'],
      template:
        '<button class="n-button" :disabled="disabled" @click="$emit(\'click\')"><slot name="icon" /><slot /></button>',
    }),
    NIcon: wrapper('NIcon'),
    NText: wrapper('NText'),
  }
})
import PdfToImageExportActions from './PdfToImageExportActions.vue'
function mountComponent(
  props: Partial<InstanceType<typeof PdfToImageExportActions>['$props']> = {},
) {
  return mount(PdfToImageExportActions, {
    props: {
      numPages: 3,
      hasCurrentImage: true,
      isRendering: false,
      isExporting: false,
      exportProgress: 0,
      currentDownloadUrl: 'blob:page',
      currentDownloadName: 'p1.png',
      zipDownloadUrl: null,
      zipDownloadName: 'all.zip',
      ...props,
    },
  })
}
describe('PdfToImageExportActions', () => {
  it('emits export-all when export button clicked', async () => {
    const wrapper = mountComponent()
    const buttons = wrapper.findAll('button.n-button')
    await buttons[1]?.trigger('click')
    expect(wrapper.emitted('export-all')).toHaveLength(1)
  })
  it('shows exporting status with progress', () => {
    const wrapper = mountComponent({ isExporting: true, exportProgress: 2 })
    expect(wrapper.text()).toContain('Exporting pages 2/3')
  })
  it('renders zip download button when zip url exists', () => {
    const wrapper = mountComponent({ zipDownloadUrl: 'blob:zip' })
    expect(wrapper.text()).toContain('Download ZIP')
  })
})
