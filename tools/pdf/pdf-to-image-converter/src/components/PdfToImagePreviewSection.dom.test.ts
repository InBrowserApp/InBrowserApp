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
    NAlert: wrapper('NAlert'),
    NEmpty: wrapper('NEmpty'),
    NPagination: defineComponent({
      name: 'NPagination',
      emits: ['update:page'],
      template: '<div class="n-pagination" />',
    }),
    NSkeleton: wrapper('NSkeleton'),
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
import PdfToImagePreviewSection from './PdfToImagePreviewSection.vue'
function mountComponent(
  props: Partial<InstanceType<typeof PdfToImagePreviewSection>['$props']> = {},
) {
  return mount(PdfToImagePreviewSection, {
    props: {
      page: 1,
      numPages: 3,
      pageImage: null,
      isRendering: false,
      errorMessage: '',
      ...props,
    },
  })
}
describe('PdfToImagePreviewSection', () => {
  it('emits page updates from pagination', async () => {
    const wrapper = mountComponent()
    await wrapper.findComponent({ name: 'NPagination' }).vm.$emit('update:page', 2)
    expect(wrapper.emitted('update:page')?.[0]).toEqual([2])
  })
  it('hides pagination when only one page', () => {
    const wrapper = mountComponent({ numPages: 1 })
    expect(wrapper.findComponent({ name: 'NPagination' }).exists()).toBe(false)
  })
  it('renders image details text when image exists', () => {
    const wrapper = mountComponent({
      page: 2,
      pageImage: {
        page: 2,
        width: 120,
        height: 200,
        blob: new Blob(['img']),
        dpi: 144,
        format: 'png',
        quality: 0.92,
      },
    })
    expect(wrapper.text()).toContain('120 × 200')
    expect(wrapper.text()).toContain('144 DPI')
  })
  it('shows error alert when render fails', () => {
    const wrapper = mountComponent({
      numPages: 2,
      errorMessage: 'render failed',
    })
    expect(wrapper.text()).toContain('render failed')
  })
})
